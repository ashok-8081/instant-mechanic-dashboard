import apiClient from '../client';

export const authApi = {
    login: (email: string, password: string) =>
        apiClient.post('/auth/login', { email, password }),
    
    register: (data: { email: string; password: string; name: string }) =>
        apiClient.post('/auth/register', data),
    
    getMe: () => apiClient.get('/auth/me'),
};