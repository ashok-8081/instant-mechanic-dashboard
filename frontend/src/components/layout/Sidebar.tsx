import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, Wrench, Users, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
    const { logout, user } = useAuth();

    const navItems = [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/bookings', icon: Calendar, label: 'Bookings' },
        { to: '/mechanics', icon: Wrench, label: 'Mechanics' },
        { to: '/customers', icon: Users, label: 'Customers' },
    ];

    return (
        <aside className="w-64 bg-gray-900 dark:bg-gray-950 text-white h-screen fixed left-0 top-0 flex flex-col">
            <div className="p-6 border-b border-gray-800 dark:border-gray-800">
                <h1 className="text-2xl font-bold text-white">Instant Mechanic</h1>
                <p className="text-sm text-gray-400 dark:text-gray-400 mt-1">Operations Dashboard</p>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            }`
                        }
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-800 dark:border-gray-800">
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-800 dark:bg-gray-800 mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-semibold text-white">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.role}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;