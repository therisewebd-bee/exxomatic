import { useState } from 'react';
import { MdSearch, MdKeyboardArrowDown } from 'react-icons/md';
import VehicleCard from './VehicleCard';

const filterOptions = ['All Vehicles', 'Moving', 'Stopped', 'Idle'];

export default function VehicleList({ vehicles, selectedVehicle, onSelectVehicle }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Vehicles');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const filteredVehicles = vehicles.filter((v) => {
        const plate = v.plate || v.vechicleNumb || v.imei || '';
        const imei = v.imei || '';

        const matchesSearch =
            plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
            imei.includes(searchQuery);

        const matchesFilter =
            statusFilter === 'All Vehicles' ||
            v.status === statusFilter.toLowerCase();

        return matchesSearch && matchesFilter;
    });

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
                        {statusFilter}
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
                                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-brand-purple/5 transition-colors ${statusFilter === option
                                            ? 'text-brand-purple font-medium bg-brand-purple/5'
                                            : 'text-gray-700'
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Vehicle Cards */}
            <div className="flex-1 overflow-y-auto px-5 py-2 space-y-3">
                {filteredVehicles.map((vehicle) => (
                    <VehicleCard
                        key={vehicle.id || vehicle.imei}
                        vehicle={vehicle}
                        isSelected={selectedVehicle?.id === vehicle.id}
                        onSelect={onSelectVehicle}
                    />
                ))}

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
