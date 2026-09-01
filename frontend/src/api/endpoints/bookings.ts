import apiClient from '../client';

export const bookingsApi = {
    getBookings: (params?: any) => 
        apiClient.get('/bookings', { params }),
    
    getBookingById: (id: string) => 
        apiClient.get(`/bookings/${id}`),
    
    updateStatus: (id: string, status: string) => 
        apiClient.put(`/bookings/${id}/status`, { status }),
};