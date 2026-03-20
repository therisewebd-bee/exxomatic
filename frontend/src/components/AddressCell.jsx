import { useState, useEffect, useRef } from 'react';
import { getDistanceFromLatLonInKm } from '../utils/geoUtils';

// Module-level singletons for efficient caching and queueing across the entire App
const addressCache = []; 
const geocodeQueue = [];
let isGeocoding = false;

const findNearbyAddress = (lat, lng) => {
    // 0.5km proximity check to reuse existing results
    return addressCache.find(item => getDistanceFromLatLonInKm(lat, lng, item.lat, item.lng) < 0.5);
};

const processQueue = async () => {
    if (isGeocoding || geocodeQueue.length === 0) return;
    isGeocoding = true;
    while(geocodeQueue.length > 0) {
        const { lat, lng, onResolve } = geocodeQueue.shift();
        const nearby = findNearbyAddress(lat, lng);
        if (nearby) {
            onResolve(nearby.address);
            continue;
        }
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await res.json();
            const addr = data.address;
            let finalAddress = 'Unknown Location';
            if (addr) {
                // Formatting into a readable string: "Suburban Area, City/District, State"
                const parts = [
                    addr.suburb || addr.road || addr.neighbourhood, 
                    addr.city || addr.town || addr.village || addr.state_district, 
                    addr.state
                ].filter(Boolean);
                finalAddress = parts.join(', ');
            }
            addressCache.push({ lat, lng, address: finalAddress });
            onResolve(finalAddress);
        } catch(e) { 
            onResolve('Resolution Failed'); 
        }
        // Strict 1.1s cooldown to respect Nominatim rate limits (429 prevention)
        await new Promise(r => setTimeout(r, 1100)); 
    }
    isGeocoding = false;
};

/**
 * AddressCell Component
 * Lazily resolves lat/lng into a readable address using an IntersectionObserver
 */
export default function AddressCell({ lat, lng, className = "" }) {
    const [address, setAddress] = useState('Resolving...');
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                const nearby = findNearbyAddress(lat, lng);
                if (nearby) { 
                    setAddress(nearby.address); 
                } else {
                     geocodeQueue.push({ lat, lng, onResolve: setAddress });
                     processQueue();
                }
                observer.disconnect();
            }
        });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [lat, lng]);

    return (
        <span 
            ref={ref} 
            className={`truncate inline-block text-gray-500 ${className}`} 
            title={address}
        >
            {address}
        </span>
    );
}
