import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
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

const AppWithSocket: React.FC = () => {
    const socket = useSocket('http://localhost:5000');

    useEffect(() => {
        if (socket) {
            socket.on('booking-update', () => {
                queryClient.invalidateQueries({ queryKey: ['dashboard'] });
                queryClient.invalidateQueries({ queryKey: ['bookings'] });
            });

            socket.on('mechanic-update', () => {
                queryClient.invalidateQueries({ queryKey: ['dashboard'] });
                queryClient.invalidateQueries({ queryKey: ['mechanics'] });
            });

            socket.on('dashboard-update', () => {
                queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            });

            return () => {
                socket.off('booking-update');
                socket.off('mechanic-update');
                socket.off('dashboard-update');
            };
        }
    }, [socket]);

    return (
        <BrowserRouter>
            <ThemeProvider>
                <AuthProvider>
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
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
};

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AppWithSocket />
        </QueryClientProvider>
    );
}

export default App;