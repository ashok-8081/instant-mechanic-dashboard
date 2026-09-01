import apiClient from '../client';

export const mechanicsApi = {
    getMechanics: (params?: { status?: string; search?: string }) =>
        apiClient.get('/mechanics', { params }),
    
    getMechanicById: (id: string) =>
        apiClient.get(`/mechanics/${id}`),
    
    updateStatus: (id: string, status: string) =>
        apiClient.put(`/mechanics/${id}/status`, { status }),
};