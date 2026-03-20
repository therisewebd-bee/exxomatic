/**
 * Reusable empty state placeholder used when lists/tables have no data.
 */
export default function EmptyState({ icon, message, subMessage, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm ${className}`}>
      {icon && <div className="text-gray-200 mb-4">{icon}</div>}
      <p className="text-gray-500 font-medium">{message}</p>
      {subMessage && <p className="text-sm text-gray-400 mt-1">{subMessage}</p>}
    </div>
  );
}
