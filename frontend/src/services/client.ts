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
            const token = await SecureStore.getItemAsync('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error leyendo token del storage', error);
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
                    // If no refresh token, the session expired completely
                    return Promise.reject(error);
                }

                // Request a new Access Token
                const { data } = await axios.post(`${API_URL}/api/v1/auth/refresh-token`, {
                    refreshToken: refreshToken
                });

                // Save the new Access Token
                if (data.accessToken) {
                    await SecureStore.setItemAsync('accessToken', data.accessToken);

                    // Update the header of the original request with the new token
                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

                    // Retry the original request with the new token
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // If token refresh fails, clear the session
                console.log('Error refreshing token, closing session...');

                await SecureStore.deleteItemAsync('accessToken');
                await SecureStore.deleteItemAsync('refreshToken');

                // TODO: redirect login
                // (Use Context API or Redux to manage authentication state)
            }
        }

        return Promise.reject(error);
    }
);

export default api;