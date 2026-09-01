import React from 'react';

interface BookingStatusBadgeProps {
    status: string;
}

const BookingStatusBadge: React.FC<BookingStatusBadgeProps> = ({ status }) => {
    const statusColors: Record<string, string> = {
        'PENDING': 'bg-yellow-100 text-yellow-800',
        'ASSIGNED': 'bg-blue-100 text-blue-800',
        'MECHANIC_ON_WAY': 'bg-purple-100 text-purple-800',
        'IN_PROGRESS': 'bg-indigo-100 text-indigo-800',
        'COMPLETED': 'bg-green-100 text-green-800',
        'CANCELLED': 'bg-red-100 text-red-800',
    };

    const statusLabels: Record<string, string> = {
        'PENDING': 'Pending',
        'ASSIGNED': 'Assigned',
        'MECHANIC_ON_WAY': 'On The Way',
        'IN_PROGRESS': 'In Progress',
        'COMPLETED': 'Completed',
        'CANCELLED': 'Cancelled',
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
            {statusLabels[status] || status}
        </span>
    );
};

export default BookingStatusBadge;