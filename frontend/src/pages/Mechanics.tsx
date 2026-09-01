import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { mechanicsApi } from '../api/endpoints/mechanics';
import { Loader2, Star, Wrench, CheckCircle, XCircle, Clock } from 'lucide-react';

const Mechanics: React.FC = () => {
    const [statusFilter, setStatusFilter] = useState<string>('');

    const { data, isLoading, error } = useQuery({
        queryKey: ['mechanics', statusFilter],
        queryFn: () => mechanicsApi.getMechanics({ status: statusFilter || undefined }),
        refetchInterval: 30000,
    });

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
                Error loading mechanics
            </div>
        );
    }

    const mechanics = data?.data.data || [];

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'AVAILABLE': 'bg-green-100 text-green-800',
            'BUSY': 'bg-red-100 text-red-800',
            'ON_BREAK': 'bg-yellow-100 text-yellow-800',
            'OFFLINE': 'bg-gray-100 text-gray-800',
            'ON_ROAD': 'bg-blue-100 text-blue-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusIcon = (status: string) => {
        const icons: Record<string, any> = {
            'AVAILABLE': <CheckCircle className="w-4 h-4" />,
            'BUSY': <XCircle className="w-4 h-4" />,
            'ON_BREAK': <Clock className="w-4 h-4" />,
            'ON_ROAD': <Wrench className="w-4 h-4" />,
        };
        return icons[status] || <Clock className="w-4 h-4" />;
    };

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex items-center gap-4">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Status</option>
                    <option value="AVAILABLE">Available</option>
                    <option value="BUSY">Busy</option>
                    <option value="ON_BREAK">On Break</option>
                    <option value="ON_ROAD">On Road</option>
                    <option value="OFFLINE">Offline</option>
                </select>
            </div>

            {/* Mechanics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mechanics.map((mechanic: any) => (
                    <Card key={mechanic._id}>
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{mechanic.name}</h3>
                                    <p className="text-sm text-gray-600">{mechanic.specialization}</p>
                                    <p className="text-sm text-gray-500 mt-1">{mechanic.email}</p>
                                </div>
                                <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(mechanic.status)}`}>
                                    {getStatusIcon(mechanic.status)}
                                    {mechanic.status.replace('_', ' ')}
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-2">
                                <div className="bg-gray-50 p-3 rounded-lg text-center">
                                    <p className="text-xs text-gray-500">Jobs Completed</p>
                                    <p className="font-semibold">{mechanic.jobsCompleted}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg text-center">
                                    <p className="text-xs text-gray-500">Rating</p>
                                    <p className="font-semibold flex items-center justify-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                        {mechanic.rating}
                                    </p>
                                </div>
                            </div>

                            {mechanic.currentBooking && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-xs text-blue-600 font-medium">Current Job</p>
                                    <p className="text-sm text-gray-700">
                                        {mechanic.currentBooking.customerId?.name} - {mechanic.currentBooking.serviceId?.name}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {mechanics.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No mechanics found
                </div>
            )}
        </div>
    );
};

export default Mechanics;