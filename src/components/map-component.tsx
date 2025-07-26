
'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';

// Fix for default icon issue with webpack
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon.src,
    shadowUrl: iconShadow.src,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapItem {
    id: string;
    title: string;
    location: string;
    href: string;
    coords?: [number, number];
}

interface MapComponentProps {
    items: MapItem[];
}

export default function MapComponent({ items }: MapComponentProps) {
    const validItems = items.filter(item => item.coords);

    const defaultCenter: [number, number] = [0.3924, 9.4536];

    return (
        <MapContainer center={defaultCenter} zoom={6} style={{ height: '100%', width: '100%', borderRadius: 'inherit' }}>
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            {validItems.map(item => (
                <Marker key={item.id} position={item.coords!}>
                    <Popup>
                        <div className="font-sans">
                            <h4 className="font-bold">{item.title}</h4>
                            <p className="text-gray-600">{item.location}</p>
                            <Link href={item.href} className="text-blue-600 hover:underline">
                                Voir détails
                            </Link>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
