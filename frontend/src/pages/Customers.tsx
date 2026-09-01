import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { customersApi } from '../api/endpoints/customers';
import { Loader2, Mail, Phone, Car, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const Customers: React.FC = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const limit = 10;

    const { data, isLoading, error } = useQuery({
        queryKey: ['customers', page, search],
        queryFn: () => customersApi.getCustomers({ page, limit, search: search || undefined }),
        refetchInterval: 30000,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(searchInput);
        setPage(1);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                Error loading customers
            </div>
        );
    }

    const customers = data?.data.data || [];
    const pagination = data?.data.pagination;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Customers</CardTitle>
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search customers..."
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Search
                        </button>
                    </form>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {customers.map((customer: any) => (
                        <div key={customer._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg">{customer.name}</h3>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <Mail className="w-4 h-4" />
                                            {customer.email}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Phone className="w-4 h-4" />
                                            {customer.phone}
                                        </span>
                                    </div>
                                    {customer.address && (
                                        <p className="text-sm text-gray-500 mt-1">{customer.address}</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-blue-600">{customer.totalBookings || 0}</p>
                                        <p className="text-xs text-gray-500">Bookings</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-green-600">{customer.totalVehicles || 0}</p>
                                        <p className="text-xs text-gray-500">Vehicles</p>
                                    </div>
                                </div>
                            </div>

                            {customer.vehicles && customer.vehicles.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                    <p className="text-xs font-medium text-gray-500 mb-2">Vehicles</p>
                                    <div className="flex flex-wrap gap-2">
                                        {customer.vehicles.map((vehicle: any) => (
                                            <span key={vehicle._id} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                                                {vehicle.make} {vehicle.model} ({vehicle.year}) - {vehicle.licensePlate}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {customer.recentBookings && customer.recentBookings.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                    <p className="text-xs font-medium text-gray-500 mb-2">Recent Bookings</p>
                                    <div className="space-y-1">
                                        {customer.recentBookings.slice(0, 2).map((booking: any) => (
                                            <div key={booking._id} className="flex items-center justify-between text-sm">
                                                <span>{booking.serviceId?.name}</span>
                                                <span className="text-gray-500">
                                                    {new Date(booking.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {pagination && pagination.total > 0 && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-600">
                            Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} customers
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="text-sm">
                                Page {pagination.page} of {pagination.pages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                                disabled={page === pagination.pages}
                                className="p-2 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default Customers;