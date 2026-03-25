import { useState } from 'react';
import {
    MdLocationOn,
    MdDirectionsCar,
    MdMap,
    MdHistory,
    MdNotifications,
    MdSettings,
    MdFence,
    MdAssessment,
    MdKeyboardArrowUp,
    MdKeyboardArrowDown,
    MdLogout,
    MdPeople
} from 'react-icons/md';
import { HiStatusOnline } from 'react-icons/hi';
import UserProfileCard from './UserProfileCard';
import { useAuth } from '../context/AuthContext';

const navItems = [
    {
        id: 'liveMap',
        label: 'Live Tracking',
        icon: <HiStatusOnline size={18} />,
        expandable: true,
        defaultExpanded: true,
        children: [
            { id: 'liveMap', label: 'Live Map', icon: <MdMap size={16} /> },
            { id: 'vehicles', label: 'Active Vehicles', icon: <MdDirectionsCar size={16} /> },
        ],
    },
    {
        id: 'vehicles',
        label: 'Vehicles',
        icon: <MdDirectionsCar size={18} />,
    },
    {
        id: 'geofences',
        label: 'Geofences',
        icon: <MdFence size={18} />,
    },
    {
        id: 'analytics',
        label: 'Analytics',
        icon: <MdHistory size={18} />,
    },
    {
        id: 'reports',
        label: 'Reports',
        icon: <MdAssessment size={18} />,
    },
    {
        id: 'notifications',
        label: 'Notifications',
        icon: <MdNotifications size={18} />,
    },
    {
        id: 'settings',
        label: 'Settings',
        icon: <MdSettings size={18} />,
    },
];

function SidebarItem({ item, activeTab, onTabChange }) {
    const [expanded, setExpanded] = useState(item.defaultExpanded || false);
    const isActive = item.id === activeTab;

    function handleClick() {
        if (item.expandable && item.children) {
            setExpanded(!expanded);
        } else if (item.id) {
            onTabChange(item.id);
        }
    }

    return (
        <div className="mb-1">
            <button
                onClick={handleClick}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                    isActive && !item.children
                        ? 'bg-brand-purple/10 text-brand-purple'
                        : 'text-sidebar-text hover:text-sidebar-text-active hover:bg-sidebar-hover'
                }`}
            >
                <div className="flex items-center gap-3">
                    <span className={`${isActive && !item.children ? 'text-brand-purple' : 'text-brand-purple-light group-hover:text-brand-purple'}`}>
                        {item.icon}
                    </span>
                    <span className="text-sm font-medium">{item.label}</span>
                </div>
                {item.expandable && item.children && (
                    <span className="text-sidebar-text opacity-60">
                        {expanded ? <MdKeyboardArrowUp size={18} /> : <MdKeyboardArrowDown size={18} />}
                    </span>
                )}
            </button>

            {expanded && item.children && (
                <div className="ml-6 mt-1 space-y-0.5">
                    {item.children.map((child) => (
                        <button
                            key={child.id}
                            onClick={() => onTabChange(child.id)}
                            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                                activeTab === child.id
                                    ? 'text-brand-purple bg-brand-purple/10 font-medium'
                                    : 'text-sidebar-text hover:text-sidebar-text-active hover:bg-sidebar-hover'
                            }`}
                        >
                            {child.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function Sidebar({ activeTab, onTabChange, onLogout }) {
    const { user } = useAuth();

    const currentNavItems = [...navItems];
    if (user?.role === 'Admin') {
        const settingsIdx = currentNavItems.findIndex(i => i.id === 'settings');
        currentNavItems.splice(settingsIdx, 0, {
            id: 'users',
            label: 'Users',
            icon: <MdPeople size={18} />,
        });
    }

    return (
        <aside className="w-[180px] min-w-[180px] h-screen bg-sidebar-bg flex flex-col border-r border-white/5">
            {/* Logo */}
            <div className="px-4 py-5 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-purple to-purple-400 flex items-center justify-center shadow-lg shadow-brand-purple/30">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <span className="text-white font-bold text-lg tracking-tight">
                    Exxo<span className="text-brand-purple-light">matic</span>
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-2 overflow-y-auto space-y-0.5">
                {currentNavItems.map((item) => (
                    <SidebarItem key={item.id} item={item} activeTab={activeTab} onTabChange={onTabChange} />
                ))}
            </nav>

            {/* User Profile + Logout */}
            <div className="mt-auto">
                <UserProfileCard />
                <div className="px-3 pb-4">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition"
                    >
                        <MdLogout size={16} />
                        Sign Out
                    </button>
                </div>
            </div>
        </aside>
    );
}
