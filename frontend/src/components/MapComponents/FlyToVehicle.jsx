import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';

// Component to fly to selected vehicle
export default function FlyToVehicle({ selectedVehicle, selectionTime }) {
    const map = useMap();

    useEffect(() => {
        if (selectedVehicle && selectionTime) {
            const lat = Number(selectedVehicle.lat);
            const lng = Number(selectedVehicle.lng);
            
            if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
                const timer = setTimeout(() => {
                    map.flyTo([lat, lng], 16, { animate: true, duration: 1.5 });
                }, 100);
                return () => clearTimeout(timer);
            }
        }
    }, [selectedVehicle?.id, selectionTime, map]);
    return null;
}
