import { useState, useMemo, useEffect, useRef } from 'react';
import { MdSearch, MdKeyboardArrowDown } from 'react-icons/md';
import VehicleCard from './VehicleCard';

const filterOptions = ['All Vehicles', 'Registered', 'Moving', 'Stopped', 'Idle', 'Unregistered'];

export default function VehicleList({ vehicles, selectedVehicle, onSelectVehicle, totalLiveCount = 0, isAdmin, onRegisterRequest, onEditRequest, onAnalyzeRequest }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Vehicles');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Render Throttling (2s update interval to prevent 100% CPU on 66k vehicles)
    const vehiclesRef = useRef(vehicles);
    vehiclesRef.current = vehicles;

    const [throttledVehicles, setThrottledVehicles] = useState(vehicles);

    useEffect(() => {
        const interval = setInterval(() => {
            setThrottledVehicles(vehiclesRef.current);
        }, 2000); // Update list UI every 2 seconds max
        return () => clearInterval(interval);
    }, []);

    // Single-pass: compute both counts AND filtered list together
    const { counts, filteredVehicles } = useMemo(() => {
        const counts = { 'All Vehicles': 0, 'Registered': 0, 'Moving': 0, 'Stopped': 0, 'Idle': 0, 'Unregistered': 0 };
        const filtered = [];
        const query = searchQuery.toLowerCase();

        for (let i = 0; i < throttledVehicles.length; i++) {
            const v = throttledVehicles[i];

            // Count accumulation (always runs for all vehicles)
            counts['All Vehicles']++;
            if (v.isUnregistered) counts['Unregistered']++;
            else counts['Registered']++;
            if (v.status === 'moving') counts['Moving']++;
            else if (v.status === 'stopped') counts['Stopped']++;
            else if (v.status === 'idle') counts['Idle']++;

            // Filter check
            const plate = v.plate || v.vechicleNumb || v.imei || '';
            const imei = v.imei || '';
            const matchesSearch = !query || plate.toLowerCase().includes(query) || imei.includes(searchQuery);

            let matchesFilter = true;
            if (statusFilter === 'Registered') matchesFilter = !v.isUnregistered;
            else if (statusFilter === 'Unregistered') matchesFilter = !!v.isUnregistered;
            else if (statusFilter !== 'All Vehicles') matchesFilter = v.status === statusFilter.toLowerCase();

            if (matchesSearch && matchesFilter) {
                filtered.push(v);
            }
        }

        return { counts, filteredVehicles: filtered };
    }, [throttledVehicles, searchQuery, statusFilter]);

    // Standard Pagination
    const PAGE_SIZE = 30;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(filteredVehicles.length / PAGE_SIZE);

    // Reset to page 1 when filter/search changes
    const resetKey = `${statusFilter}-${searchQuery}`;
    useEffect(() => { setCurrentPage(1); }, [resetKey]);

    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const displayedVehicles = filteredVehicles.slice(startIndex, startIndex + PAGE_SIZE);

    return (
        <div className="w-[380px] min-w-[380px] h-screen bg-gray-50 flex flex-col border-r border-gray-200">
            {/* Header */}
            <div className="px-5 pt-5 pb-3">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Vehicles List</h1>
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                                Global Activity: {totalLiveCount.toLocaleString()} Live
                            </span>
                        </div>
                    </div>

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

            {/* Vehicle Cards — Paginated */}
            <div className="flex-1 overflow-y-auto px-5 py-2 flex flex-col">
                <div className="flex-1 space-y-3">
                    {displayedVehicles.map((vehicle) => (
                        <VehicleCard
                            key={vehicle.id || vehicle.imei}
                            vehicle={vehicle}
                            isSelected={selectedVehicle?.id === vehicle.id}
                            onSelect={onSelectVehicle}
                            isAdmin={isAdmin}
                            onRegisterRequest={onRegisterRequest}
                            onEditRequest={onEditRequest}
                            onAnalyze={onAnalyzeRequest}
                        />
                    ))}

                    {filteredVehicles.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <MdSearch size={40} />
                            <p className="mt-2 text-sm">No vehicles found</p>
                        </div>
                    )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200 pb-2">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="px-3 py-1.5 text-xs font-medium text-brand-purple bg-brand-purple/5 hover:bg-brand-purple/15 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        <span className="text-xs text-gray-500 font-medium tracking-wide">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="px-3 py-1.5 text-xs font-medium text-brand-purple bg-brand-purple/5 hover:bg-brand-purple/15 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
