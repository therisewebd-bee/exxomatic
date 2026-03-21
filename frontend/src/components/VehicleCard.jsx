import { MdDirectionsCar, MdSpeed, MdArrowForward, MdDelete, MdAddCircle } from 'react-icons/md';
import { useDeleteVehicleMutation, useCreateVehicleMutation } from '../hooks/useQueries';
import { useState } from 'react';

const statusConfig = {
    moving: { color: 'bg-status-moving', label: 'Moving' },
    stopped: { color: 'bg-status-stopped', label: 'Stopped' },
    idle: { color: 'bg-status-idle', label: 'Idle' },
};

export default function VehicleCard({ vehicle, isSelected, onSelect }) {
    const status = statusConfig[vehicle.status] || statusConfig.idle;
    const plate = vehicle.plate || vehicle.vechicleNumb || vehicle.imei;
    const isUnregistered = vehicle.isUnregistered;

    const deleteMutation = useDeleteVehicleMutation();
    const createMutation = useCreateVehicleMutation();
    const [registering, setRegistering] = useState(false);
    const [regPlate, setRegPlate] = useState('');

    async function handleDelete(e) {
        e.stopPropagation();
        if (!confirm(`Delete vehicle ${plate}?`)) return;
        try {
            await deleteMutation.mutateAsync(vehicle.id);
        } catch (err) {
            alert(err.message || 'Failed to delete');
        }
    }

    async function handleQuickRegister(e) {
        e.stopPropagation();
        if (registering) {
            if (!regPlate.trim()) return;
            try {
                await createMutation.mutateAsync({ imei: vehicle.imei, vechicleNumb: regPlate.trim() });
                setRegistering(false);
                setRegPlate('');
            } catch (err) {
                alert(err.message || 'Registration failed');
            }
            return;
        }
        setRegistering(true);
    }

    return (
        <div
            onClick={() => onSelect(vehicle)}
            className={`
        bg-white rounded-xl p-4 cursor-pointer relative
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
                <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full absolute -top-2 -right-2 shadow-md">
                    BREACH
                </div>
            )}
            {isUnregistered && (
                <div className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full absolute -top-2 -right-2 shadow-md">
                    NEW
                </div>
            )}
            {/* Top row: icon + plate + IMEI */}
            <div className="flex items-center gap-2 mb-3">
                <MdDirectionsCar className={isUnregistered ? "text-amber-500" : "text-sidebar-bg"} size={18} />
                <span className="font-semibold text-sm text-gray-800">{plate}</span>
                <span className="text-xs text-gray-400 ml-1">IMEI:{vehicle.imei}</span>
            </div>

            {/* Inline Quick Register */}
            {registering && (
                <div className="mb-3 flex gap-2" onClick={e => e.stopPropagation()}>
                    <input
                        type="text"
                        placeholder="Vehicle plate / name"
                        value={regPlate}
                        onChange={e => setRegPlate(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-amber-500 font-mono"
                        autoFocus
                        onKeyDown={e => e.key === 'Enter' && handleQuickRegister(e)}
                    />
                </div>
            )}

            {/* Bottom row: status + speed + buttons */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${status.color}`}></span>
                        <span className="text-xs font-medium text-gray-700">{status.label}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                        <MdSpeed size={14} />
                        <span className="text-xs font-medium">{vehicle.speed || 0} km/h</span>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    {isUnregistered ? (
                        <button
                            className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200 hover:shadow-md"
                            onClick={handleQuickRegister}
                            title="Register this device"
                        >
                            <MdAddCircle size={14} />
                            {registering ? 'Confirm' : 'Quick Register'}
                        </button>
                    ) : (
                        <>
                            <button
                                className="flex items-center text-gray-300 hover:text-red-500 text-xs p-1.5 rounded-lg transition"
                                onClick={handleDelete}
                                title="Delete vehicle"
                            >
                                <MdDelete size={16} />
                            </button>
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
