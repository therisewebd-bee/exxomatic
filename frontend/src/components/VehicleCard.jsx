import { MdDirectionsCar, MdSpeed, MdArrowForward, MdDelete } from 'react-icons/md';
import { deleteVehicle } from '../services/api';

const statusConfig = {
    moving: { color: 'bg-status-moving', label: 'Moving' },
    stopped: { color: 'bg-status-stopped', label: 'Stopped' },
    idle: { color: 'bg-status-idle', label: 'Idle' },
};

export default function VehicleCard({ vehicle, isSelected, onSelect }) {
    const status = statusConfig[vehicle.status] || statusConfig.idle;
    const plate = vehicle.plate || vehicle.vechicleNumb || vehicle.imei;

    async function handleDelete(e) {
        e.stopPropagation();
        if (!confirm(`Delete vehicle ${plate}?`)) return;
        try {
            await deleteVehicle(vehicle.id);
            window.location.reload();
        } catch (err) {
            alert(err.message || 'Failed to delete');
        }
    }

    return (
        <div
            onClick={() => onSelect(vehicle)}
            className={`
        bg-white rounded-xl p-4 cursor-pointer
        border-2 transition-all duration-200
        hover:shadow-lg hover:-translate-y-0.5
        ${isSelected
                    ? 'border-brand-purple shadow-lg shadow-brand-purple/10'
                    : 'border-transparent shadow-sm hover:border-brand-purple/30'
                }
      `}
        >
            {/* Top row: icon + plate + IMEI */}
            <div className="flex items-center gap-2 mb-3">
                <MdDirectionsCar className="text-sidebar-bg" size={18} />
                <span className="font-semibold text-sm text-gray-800">{plate}</span>
                <span className="text-xs text-gray-400 ml-1">IMEI:{vehicle.imei}</span>
            </div>

            {/* Bottom row: status + speed + buttons */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Status */}
                    <div className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${status.color}`}></span>
                        <span className="text-xs font-medium text-gray-700">{status.label}</span>
                    </div>

                    {/* Speed */}
                    <div className="flex items-center gap-1 text-gray-500">
                        <MdSpeed size={14} />
                        <span className="text-xs font-medium">{vehicle.speed || 0} km/h</span>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    {/* Delete Button */}
                    <button
                        className="flex items-center text-gray-300 hover:text-red-500 text-xs p-1.5 rounded-lg transition"
                        onClick={handleDelete}
                        title="Delete vehicle"
                    >
                        <MdDelete size={16} />
                    </button>

                    {/* View Details Button */}
                    <button
                        className="flex items-center gap-1 bg-brand-purple hover:bg-brand-purple-dark text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200 hover:shadow-md hover:shadow-brand-purple/20"
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect(vehicle);
                        }}
                    >
                        View Details
                        <MdArrowForward size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
