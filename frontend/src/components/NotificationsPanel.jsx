import { MdNotifications, MdNotificationsActive } from 'react-icons/md';
import PanelLayout from './ui/PanelLayout';
import EmptyState from './ui/EmptyState';

export default function NotificationsPanel({ notifications }) {
    const actionBadge = (
        <span className="bg-brand-purple/10 text-brand-purple px-4 py-1.5 rounded-full text-sm font-bold">
            {notifications.length} Alerts
        </span>
    );

    return (
        <PanelLayout 
            icon={<MdNotifications size={28} className="text-brand-purple" />} 
            title="Live Notifications" 
            action={actionBadge} 
            maxWidth="4xl"
        >
            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <EmptyState 
                        icon={<MdNotifications size={64} />} 
                        message="No recent notifications" 
                        subMessage="Geofence breaches and system alerts will appear here." 
                    />
                ) : (
                    notifications.map((notif) => (
                        <div key={notif.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition flex items-start gap-4">
                            <div className="p-3 bg-red-50 text-red-500 rounded-lg">
                                <MdNotificationsActive size={24} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-bold text-gray-800">{notif.title}</h4>
                                    <span className="text-xs font-semibold text-gray-400">
                                        {new Date(notif.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">{notif.message}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </PanelLayout>
    );
}
