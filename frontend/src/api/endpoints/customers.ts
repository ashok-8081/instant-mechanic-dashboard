import apiClient from '../client';

export const customersApi = {
    getCustomers: (params?: { search?: string; page?: number; limit?: number }) =>
        apiClient.get('/customers', { params }),
    
    getCustomerById: (id: string) =>
        apiClient.get(`/customers/${id}`),
};