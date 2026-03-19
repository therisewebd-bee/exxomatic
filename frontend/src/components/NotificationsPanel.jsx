import { MdNotifications, MdNotificationsActive } from 'react-icons/md';

export default function NotificationsPanel({ notifications }) {
    return (
        <div className="flex-1 p-8 overflow-y-auto bg-gray-50 h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <MdNotifications size={28} className="text-brand-purple" />
                        Live Notifications
                    </h2>
                    <span className="bg-brand-purple/10 text-brand-purple px-4 py-1.5 rounded-full text-sm font-bold">
                        {notifications.length} Alerts
                    </span>
                </div>

                <div className="space-y-4">
                    {notifications.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
                            <MdNotifications size={64} className="mx-auto text-gray-200 mb-4" />
                            <p className="text-gray-500 font-medium">No recent notifications</p>
                            <p className="text-sm text-gray-400 mt-1">Geofence breaches and system alerts will appear here.</p>
                        </div>
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
            </div>
        </div>
    );
}
