/**
 * Reusable status badge with colored dot + label.
 * Used in VehicleCard, VehicleManagementPanel, and MapView popups.
 */

const statusConfig = {
  moving:  { color: 'bg-green-500',  label: 'Moving' },
  stopped: { color: 'bg-red-500',    label: 'Stopped' },
  idle:    { color: 'bg-orange-500', label: 'Idle' },
  online:  { color: 'bg-green-500',  label: 'Online' },
  offline: { color: 'bg-gray-400',   label: 'Offline' },
};

export default function StatusBadge({ status, className = '' }) {
  const config = statusConfig[status] || { color: 'bg-gray-400', label: status || 'Unknown' };

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className={`w-2.5 h-2.5 rounded-full ${config.color}`}></span>
      <span className="text-xs font-medium text-gray-700">{config.label}</span>
    </div>
  );
}

export function StatusPill({ status, className = '' }) {
  const config = statusConfig[status] || { color: 'bg-gray-400', label: status || 'Unknown' };
  
  return (
    <span className={`bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider ${className}`}>
      {config.label}
    </span>
  );
}
