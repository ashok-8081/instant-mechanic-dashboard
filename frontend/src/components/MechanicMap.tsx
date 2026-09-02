import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
// Leaflet ships CSS without TypeScript declarations.
// @ts-expect-error -- the bundler resolves this stylesheet at runtime.
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Mechanic {
    _id: string;
    name: string;
    latitude?: number;
    longitude?: number;
    status: string;
    specialization?: string;  // Add this
    currentBooking?: {
        customerId: { name: string };
        serviceId: { name: string };
    };
}

interface MechanicMapProps {
    mechanics: Mechanic[];
}

const MechanicMap: React.FC<MechanicMapProps> = ({ mechanics }) => {
    // Filter mechanics that have location data
    const mechanicsWithLocation = mechanics.filter(m => m.latitude && m.longitude);

    if (mechanicsWithLocation.length === 0) {
        return (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                    No mechanic location data available
                </p>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'AVAILABLE': 'green',
            'BUSY': 'red',
            'ON_BREAK': 'orange',
            'ON_ROAD': 'blue',
            'OFFLINE': 'gray',
        };
        return colors[status] || 'gray';
    };

    // Center map on first mechanic with location
    const center: [number, number] = [
        mechanicsWithLocation[0].latitude!,
        mechanicsWithLocation[0].longitude!
    ];

    return (
        <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <MapContainer
                center={center}
                zoom={12}
                className="h-80 w-full"
                style={{ background: '#f0f0f0' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {mechanicsWithLocation.map((mechanic) => (
                    <Marker
                        key={mechanic._id}
                        position={[mechanic.latitude!, mechanic.longitude!]}
                        icon={L.divIcon({
                            className: 'custom-marker',
                            html: `<div style="
                                background-color: ${getStatusColor(mechanic.status)};
                                width: 14px;
                                height: 14px;
                                border-radius: 50%;
                                border: 2px solid white;
                                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                                position: relative;
                            ">
                                <div style="
                                    position: absolute;
                                    top: -4px;
                                    left: -4px;
                                    width: 22px;
                                    height: 22px;
                                    border-radius: 50%;
                                    border: 2px solid ${getStatusColor(mechanic.status)};
                                    opacity: 0.5;
                                "></div>
                            </div>`,
                            iconSize: [14, 14],
                            iconAnchor: [7, 7],
                        })}
                    >
                        <Popup>
                            <div className="p-2 min-w-[200px]">
                                <h3 className="font-semibold text-gray-900">{mechanic.name}</h3>
                                <p className="text-sm text-gray-600">
                                    Status: <span className="font-medium">{mechanic.status.replace('_', ' ')}</span>
                                </p>
                                <p className="text-sm text-gray-600">
                                    Specialization: {mechanic.specialization || 'General'}
                                </p>
                                {mechanic.currentBooking && (
                                    <>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Current Job: {mechanic.currentBooking.serviceId?.name || 'Unknown'}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Customer: {mechanic.currentBooking.customerId?.name || 'Unknown'}
                                        </p>
                                    </>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Legend */}
            <div className="absolute bottom-2 left-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="dark:text-gray-200">Available</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="dark:text-gray-200">Busy</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span className="dark:text-gray-200">On Break</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="dark:text-gray-200">On Road</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                        <span className="dark:text-gray-200">Offline</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MechanicMap;