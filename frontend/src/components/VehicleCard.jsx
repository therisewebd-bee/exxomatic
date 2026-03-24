import { MdDirectionsCar, MdSpeed, MdArrowForward, MdDelete, MdAddCircle, MdEdit, MdBatteryStd, MdFlashOn, MdThermostat } from 'react-icons/md';
import { useDeleteVehicleMutation } from '../hooks/useQueries';

const statusConfig = {
    moving: { color: 'bg-status-moving', label: 'Moving' },
    stopped: { color: 'bg-status-stopped', label: 'Stopped' },
    idle: { color: 'bg-status-idle', label: 'Idle' },
};

export default function VehicleCard({ vehicle, isSelected, onSelect, isAdmin, onRegisterRequest, onEditRequest }) {
    const status = statusConfig[vehicle.status] || statusConfig.idle;
    const plate = vehicle.plate || vehicle.vechicleNumb || vehicle.imei;
    const isUnregistered = vehicle.isUnregistered;
    const diag = vehicle.diagnostics;

    const deleteMutation = useDeleteVehicleMutation();

    async function handleDelete(e) {
        e.stopPropagation();
        if (!confirm(`Delete vehicle ${plate}?`)) return;
        try {
            await deleteMutation.mutateAsync(vehicle.id);
        } catch (err) {
            alert(err.message || 'Failed to delete');
        }
    }

    return (
        <div
            onClick={() => onSelect(vehicle)}
            className={`
                bg-white rounded-xl p-4 cursor-pointer relative select-none
                border-2 transition-all duration-200
                hover:shadow-lg hover:-translate-y-0.5
                ${isUnregistered
                    ? 'border-amber-400 bg-amber-50/50'
                    : vehicle.isAlert ? 'border-red-500 animate-pulse' : (isSelected
                        ? 'border-brand-purple shadow-lg shadow-brand-purple/10'
                        : 'border-transparent shadow-sm hover:border-brand-purple/30')
                }
            `}
        >
            {vehicle.isAlert && (
                <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full absolute -top-2 -right-2 shadow-md z-10 transition-all">
                    BREACH
                </div>
            )}
            {isUnregistered && (
                <div className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full absolute -top-2 -right-2 shadow-md z-10 transition-all">
                    NEW
                </div>
            )}

            {/* Row 1: Vehicle identity */}
            <div className="flex items-center gap-2 mb-2">
                <MdDirectionsCar className={isUnregistered ? "text-amber-500" : "text-sidebar-bg"} size={18} />
                <span className="font-semibold text-sm text-gray-800 truncate">{plate}</span>
                <span className="text-[10px] text-gray-400 ml-auto shrink-0">IMEI:{vehicle.imei}</span>
            </div>

            {/* Row 2: Status + Speed + Diagnostics */}
            <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`w-2.5 h-2.5 rounded-full ${status.color}`}></span>
                    <span className="text-xs font-medium text-gray-700 leading-none">{status.label}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500 shrink-0">
                    <MdSpeed size={14} className="mt-0.5" />
                    <span className="text-xs font-medium leading-none">{vehicle.speed || 0} km/h</span>
                </div>
                {diag && (diag.inputVoltage != null || diag.temperature != null) && (
                    <div className="flex items-center gap-2 ml-auto text-[10px] text-gray-400 font-medium leading-none mt-0.5">
                        {diag.inputVoltage != null && (
                            <div className="flex items-center gap-0.5" title="Vehicle Battery">
                                <MdBatteryStd size={12} className="text-green-500" />
                                <span>{diag.inputVoltage}V</span>
                            </div>
                        )}
                        {diag.batteryVoltage != null && (
                            <div className="flex items-center gap-0.5" title="Internal Battery">
                                <MdFlashOn size={12} className="text-amber-500" />
                                <span>{diag.batteryVoltage}V</span>
                            </div>
                        )}
                        {diag.temperature != null && (
                            <div className="flex items-center gap-0.5" title="Temperature">
                                <MdThermostat size={12} className="text-red-500" />
                                <span>{diag.temperature}°</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Row 3: Action buttons */}
            <div className="flex items-center justify-end gap-2 shrink-0">
                {isUnregistered ? (
                    <button
                        className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-md active:scale-95"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onRegisterRequest) onRegisterRequest(vehicle.imei);
                        }}
                        title="Register & assign to customer"
                    >
                        <MdAddCircle size={16} />
                        Register & Assign
                    </button>
                ) : (
                    <>
                        {isAdmin && (
                            <button
                                className="flex items-center justify-center w-9 h-9 text-brand-purple bg-purple-50 hover:bg-purple-100 rounded-lg transition active:scale-95"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (onEditRequest) onEditRequest(vehicle);
                                }}
                                title="Edit / Assign Customer"
                            >
                                <MdEdit size={18} />
                            </button>
                        )}
                        <button
                            className="flex items-center justify-center w-9 h-9 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition active:scale-95"
                            onClick={handleDelete}
                            title="Delete vehicle"
                        >
                            <MdDelete size={18} />
                        </button>
                        <button
                            className="flex items-center gap-1.5 bg-brand-purple hover:bg-brand-purple-dark text-white text-xs font-bold px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-md hover:shadow-brand-purple/20 active:scale-95 ml-1"
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelect(vehicle);
                            }}
                        >
                            View Details
                            <MdArrowForward size={16} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
