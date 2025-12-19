import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

if (!API_URL) {
    throw new Error('API_URL is not defined');
}

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Adds access token to request headers
api.interceptors.request.use(
    async (config) => {
        try {
            // Use 'userToken' to match what's saved in LoginScreen
            const token = await SecureStore.getItemAsync('userToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error reading token from storage', error);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and not a retry, try to refresh the token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Get the Refresh Token from the secure storage
                const refreshToken = await SecureStore.getItemAsync('refreshToken');

                if (!refreshToken) {
                    console.log('No refresh token found, session expired completely');
                    // If no refresh token, the session expired completely
                    await SecureStore.deleteItemAsync('userToken');
                    await SecureStore.deleteItemAsync('refreshToken');
                    await SecureStore.deleteItemAsync('user');
                    await SecureStore.deleteItemAsync('biometricEnabled');

                    // TODO: redirect to login
                    // (Use Context API or Redux to manage authentication state)
                    return Promise.reject(error);
                }

                // Request a new Access Token
                const { data } = await axios.post(`${API_URL}/api/v1/auth/refresh-token`, {
                    refreshToken: refreshToken
                });

                // Save the new Access Token with the correct key name
                if (data.accessToken) {
                    console.log('Access token refreshed successfully');
                    await SecureStore.setItemAsync('userToken', data.accessToken);

                    // Update the header of the original request with the new token
                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

                    // Retry the original request with the new token
                    return api(originalRequest);
                } else {
                    throw new Error('No access token in refresh response');
                }
            } catch (refreshError) {
                // If token refresh fails, clear the session
                console.error('Error refreshing token:', refreshError);
                console.log('Clearing session data...');

                await SecureStore.deleteItemAsync('userToken');
                await SecureStore.deleteItemAsync('refreshToken');
                await SecureStore.deleteItemAsync('user');
                await SecureStore.deleteItemAsync('biometricEnabled');
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;