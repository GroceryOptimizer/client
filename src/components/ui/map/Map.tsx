import { ReactElement, useEffect, useMemo, useRef } from 'react';
import { Coordinates, StoreInventory } from '~models';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Props {
    className?: string;
    stores: StoreInventory[];
    userLocation: Coordinates;
}

export default function Map({ className, stores, userLocation }: Props): ReactElement {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const map = useRef<L.Map | null>(null);

    const customIcon = useMemo(() => {
        return L.icon({
            iconUrl: '/marker-icon.png',
            shadowUrl: '/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
        });
    }, []);

    const userIcon = useMemo(() => {
        return L.icon({
            iconUrl: '/green-icon.png',
            shadowUrl: '/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
        });
    }, []);

    useEffect(() => {
        if (!(mapRef.current && !map.current)) return;

        map.current = L.map(mapRef.current, {
            zoomControl: false,
        }).setView([userLocation.latitude, userLocation.longitude], 16);

        L.control.zoom({ position: 'bottomright' }).addTo(map.current);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map.current);

        L.marker([userLocation.latitude, userLocation.longitude], {
            icon: userIcon,
        })
            .addTo(map.current)
            .bindPopup('Your location');

        const storeLocations: L.LatLngTuple[] = [[userLocation.latitude, userLocation.longitude]];

        stores.forEach((s) => {
            if (!map.current) return;

            const { name, location } = s.store;
            storeLocations.push([location.latitude, location.longitude] as L.LatLngTuple);
            const productList = s.inventory
                .map((item) => `${item.product.name}: ${item.price} SEK`)
                .join('<br>');

            L.marker([location.latitude, location.longitude], { icon: customIcon })
                .addTo(map.current)
                .bindPopup(`<b>${name}</b><br> ${productList}`);
        });

        if (storeLocations.length > 1) {
            const routePolyline = L.polyline(storeLocations, {
                color: 'blue',
                weight: 4,
                opacity: 0.7,
            }).addTo(map.current);

            map.current.fitBounds(routePolyline.getBounds());
        }

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, [stores, userLocation, customIcon, userIcon]);

    return <div ref={mapRef} className={className} />;
}
