import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
    Calendar, CheckCircle, Clock, XCircle, 
    DollarSign, Users, Wrench, Loader2 
} from 'lucide-react';
import { 
    LineChart, Line, BarChart, Bar, XAxis, YAxis, 
    CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { dashboardApi } from '../api/endpoints/dashboard';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const Dashboard: React.FC = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['dashboard'],
        queryFn: () => dashboardApi.getStats(),
        refetchInterval: 30000, // Refresh every 30 seconds
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
                Error loading dashboard data
            </div>
        );
    }

    const stats = data?.data.data.overview;
    const trends = data?.data.data.trends;
    const breakdown = data?.data.data.breakdown;

    const statCards = [
        { title: 'Total Bookings', value: stats?.totalBookings || 0, icon: Calendar, color: 'bg-blue-500' },
        { title: "Today's Bookings", value: stats?.todayBookings || 0, icon: Clock, color: 'bg-green-500' },
        { title: 'Completed', value: stats?.completedBookings || 0, icon: CheckCircle, color: 'bg-emerald-500' },
        { title: 'Pending', value: stats?.pendingBookings || 0, icon: Clock, color: 'bg-yellow-500' },
        { title: 'Cancelled', value: stats?.cancelledBookings || 0, icon: XCircle, color: 'bg-red-500' },
        { title: 'Revenue', value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'bg-purple-500' },
        { title: 'Active Mechanics', value: stats?.activeMechanics || 0, icon: Wrench, color: 'bg-indigo-500' },
        { title: 'New Customers', value: stats?.newCustomers || 0, icon: Users, color: 'bg-pink-500' },
    ];

    // Format data for charts
    const bookingTrendData = trends?.bookings?.map((item: any) => ({
        date: item._id,
        bookings: item.count
    })) || [];

    const revenueTrendData = trends?.revenue?.map((item: any) => ({
        date: item._id,
        revenue: item.revenue
    })) || [];

    const statusData = breakdown?.status?.map((item: any) => ({
        name: item._id,
        value: item.count
    })) || [];

    const serviceData = breakdown?.services?.map((item: any) => ({
        name: item._id.replace('_', ' '),
        count: item.count,
        revenue: item.revenue
    })) || [];

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, index) => (
                    <Card key={index}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                                </div>
                                <div className={`${stat.color} p-3 rounded-lg`}>
                                    <stat.icon className="text-white" size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Booking Trends */}
                <Card>
                    <CardHeader>
                        <CardTitle>Bookings Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={bookingTrendData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line 
                                        type="monotone" 
                                        dataKey="bookings" 
                                        stroke="#3B82F6" 
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Revenue Trends */}
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={revenueTrendData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line 
                                        type="monotone" 
                                        dataKey="revenue" 
                                        stroke="#10B981" 
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Booking Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {statusData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Service Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>Service Category Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={serviceData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#8B5CF6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;