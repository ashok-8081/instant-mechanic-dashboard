import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { useSocket } from './hooks/useSocket';
import Login from './pages/Login';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Mechanics from './pages/Mechanics';
import Customers from './pages/Customers';

const queryClient = new QueryClient();

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isLoading } = useAuth();
    
    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }
    
    if (!user) {
        return <Navigate to="/login" />;
    }
    
    return <>{children}</>;
};

// Component that uses socket and toast - wrapped inside ToastProvider
const SocketListener: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const socket = useSocket('http://localhost:5000');
    const { showToast } = useToast();

    useEffect(() => {
        if (socket) {
            socket.on('booking-update', (data) => {
                queryClient.invalidateQueries({ queryKey: ['dashboard'] });
                queryClient.invalidateQueries({ queryKey: ['bookings'] });
                showToast(`Booking ${data._id} was updated`, 'info');
            });

            socket.on('mechanic-update', (data) => {
                queryClient.invalidateQueries({ queryKey: ['dashboard'] });
                queryClient.invalidateQueries({ queryKey: ['mechanics'] });
                showToast(`Mechanic ${data.name} status updated`, 'info');
            });

            socket.on('dashboard-update', () => {
                queryClient.invalidateQueries({ queryKey: ['dashboard'] });
                showToast('Dashboard updated with new data', 'success');
            });

            return () => {
                socket.off('booking-update');
                socket.off('mechanic-update');
                socket.off('dashboard-update');
            };
        }
    }, [socket, showToast]);

    return <>{children}</>;
};

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <ThemeProvider>
                    <AuthProvider>
                        <ToastProvider>
                            <SocketListener>
                                <Routes>
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/" element={
                                        <ProtectedRoute>
                                            <Layout />
                                        </ProtectedRoute>
                                    }>
                                        <Route index element={<Dashboard />} />
                                        <Route path="bookings" element={<Bookings />} />
                                        <Route path="mechanics" element={<Mechanics />} />
                                        <Route path="customers" element={<Customers />} />
                                    </Route>
                                </Routes>
                            </SocketListener>
                        </ToastProvider>
                    </AuthProvider>
                </ThemeProvider>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;