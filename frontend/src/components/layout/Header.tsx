import React, { useState } from 'react';
import { Bell, Search, X } from 'lucide-react';
import LiveIndicator from '../LiveIndicator';
import ThemeToggle from '../ThemeToggle';
import { useToast } from '../../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const { showToast } = useToast();
    const navigate = useNavigate();

    // Sample notifications
    const notifications = [
        { id: 1, message: 'New booking created', time: '2 min ago', read: false },
        { id: 2, message: 'Booking #1234 completed', time: '15 min ago', read: false },
        { id: 3, message: 'Mechanic John Smith is now available', time: '1 hour ago', read: true },
        { id: 4, message: 'New customer registered', time: '2 hours ago', read: true },
    ];

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Navigate to bookings with search query
            navigate(`/bookings?search=${encodeURIComponent(searchQuery)}`);
            showToast(`Searching for: "${searchQuery}"`, 'info');
            setSearchQuery('');
        }
    };

    const handleNotificationClick = () => {
        setShowNotifications(!showNotifications);
        if (!showNotifications && unreadCount > 0) {
            // Show toast for unread notifications
            showToast(`You have ${unreadCount} unread notifications`, 'info');
        }
    };

    const handleNotificationAction = (message: string) => {
        showToast(message, 'info');
        setShowNotifications(false);
    };

    return (
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{title}</h1>
                    <LiveIndicator />
                </div>
                
                <div className="flex items-center gap-4">
                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search bookings, customers..."
                            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </form>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={handleNotificationClick}
                            className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            )}
                        </button>

                        {/* Notification Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                            No notifications
                                        </div>
                                    ) : (
                                        notifications.map(notif => (
                                            <div
                                                key={notif.id}
                                                onClick={() => handleNotificationAction(notif.message)}
                                                className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                                                    !notif.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                                }`}
                                            >
                                                <p className="text-sm text-gray-700 dark:text-gray-200">{notif.message}</p>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{notif.time}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                                    <button 
                                        onClick={() => {
                                            showToast('All notifications cleared', 'success');
                                            setShowNotifications(false);
                                        }}
                                        className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        Clear all
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
};

export default Header;