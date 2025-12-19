import api from './client';

export const register = async (userData: { email: string, password: string, username: string }) => {
    const payload = {
        username: userData.username,
        email: userData.email,
        password: userData.password
    };

    const response = await api.post('/api/v1/auth/register', payload);
    return response.data;
};

export const login = async (userData: { username: string, password: string }) => {
    const payload = {
        username: userData.username,
        password: userData.password
    };

    const response = await api.post('/api/v1/auth/login', payload);
    return response.data;
};

export const refreshToken = async (refreshToken: string) => {
    const response = await api.post('/api/v1/auth/refresh-token', {
        refreshToken: refreshToken
    });
    return response.data;
};