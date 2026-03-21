import { useState, useMemo, useEffect } from 'react';
import { MdSearch, MdKeyboardArrowDown } from 'react-icons/md';
import VehicleCard from './VehicleCard';

const filterOptions = ['All Vehicles', 'Registered', 'Moving', 'Stopped', 'Idle', 'Unregistered'];

export default function VehicleList({ vehicles, selectedVehicle, onSelectVehicle }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Vehicles');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Count badges
    const counts = useMemo(() => ({
        'All Vehicles': vehicles.length,
        'Registered': vehicles.filter(v => !v.isUnregistered).length,
        'Moving': vehicles.filter(v => v.status === 'moving').length,
        'Stopped': vehicles.filter(v => v.status === 'stopped').length,
        'Idle': vehicles.filter(v => v.status === 'idle').length,
        'Unregistered': vehicles.filter(v => v.isUnregistered).length,
    }), [vehicles]);

    const filteredVehicles = vehicles.filter((v) => {
        const plate = v.plate || v.vechicleNumb || v.imei || '';
        const imei = v.imei || '';

        const matchesSearch =
            plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
            imei.includes(searchQuery);

        let matchesFilter = true;
        if (statusFilter === 'Registered') {
            matchesFilter = !v.isUnregistered;
        } else if (statusFilter === 'Unregistered') {
            matchesFilter = !!v.isUnregistered;
        } else if (statusFilter !== 'All Vehicles') {
            matchesFilter = v.status === statusFilter.toLowerCase();
        }

        return matchesSearch && matchesFilter;
    });

    const PAGE_SIZE = 30;
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    // Reset visible count when filter/search changes
    const resetKey = `${statusFilter}-${searchQuery}`;
    useEffect(() => { setVisibleCount(PAGE_SIZE); }, [resetKey]);

    const displayedVehicles = filteredVehicles.slice(0, visibleCount);
    const hasMore = visibleCount < filteredVehicles.length;

    return (
        <div className="w-[380px] min-w-[380px] h-screen bg-gray-50 flex flex-col border-r border-gray-200">
            {/* Header */}
            <div className="px-5 pt-5 pb-3">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-bold text-gray-800">Vehicles List</h1>

                    {/* Search */}
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
                        <MdSearch size={18} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search Vehicles"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 w-32"
                        />
                    </div>
                </div>

                {/* Filter Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 shadow-sm hover:border-brand-purple/40 transition-colors"
                    >
                        <span className="flex items-center gap-2">
                            {statusFilter}
                            <span className="text-[10px] bg-brand-purple/10 text-brand-purple font-bold px-1.5 py-0.5 rounded-full">{counts[statusFilter] || 0}</span>
                        </span>
                        <MdKeyboardArrowDown size={20} className="text-gray-400" />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                            {filterOptions.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => {
                                        setStatusFilter(option);
                                        setDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-brand-purple/5 transition-colors flex items-center justify-between ${statusFilter === option
                                            ? 'text-brand-purple font-medium bg-brand-purple/5'
                                            : 'text-gray-700'
                                        }`}
                                >
                                    {option}
                                    <span className="text-[10px] bg-gray-100 text-gray-500 font-bold px-1.5 py-0.5 rounded-full">{counts[option] || 0}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Vehicle Cards — progressive rendering */}
            <div className="flex-1 overflow-y-auto px-5 py-2 space-y-3">
                {displayedVehicles.map((vehicle) => (
                    <VehicleCard
                        key={vehicle.id || vehicle.imei}
                        vehicle={vehicle}
                        isSelected={selectedVehicle?.id === vehicle.id}
                        onSelect={onSelectVehicle}
                    />
                ))}

                {hasMore && (
                    <button
                        onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
                        className="w-full py-3 text-sm font-medium text-brand-purple bg-brand-purple/5 hover:bg-brand-purple/10 rounded-xl transition-colors border border-brand-purple/20"
                    >
                        Show More ({filteredVehicles.length - visibleCount} remaining)
                    </button>
                )}

                {filteredVehicles.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                        <MdSearch size={40} />
                        <p className="mt-2 text-sm">No vehicles found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
