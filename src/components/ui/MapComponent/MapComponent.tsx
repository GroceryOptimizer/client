import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Coordinates, StoreInventory } from '~models';

interface MapProps {
    vendorVisits: StoreInventory[];
    userLocation: Coordinates;
}

const MapComponent: React.FC<MapProps> = ({ vendorVisits, userLocation }) => {
    useEffect(() => {
        // Ensure the map is only initialized once
        if (!document.getElementById('map')) return;

        // Create the map
        const map = L.map('map', {
            center: [userLocation.latitude, userLocation.longitude],
            zoom: 16,
        });

        // Add a tile layer (OpenStreetMap as default)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        const customIcon = L.icon({
            iconUrl: '/marker-icon.png',
            shadowUrl: '/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
        });

        const userIcon = L.icon({
            iconUrl: '/green-icon.png',
            shadowUrl: '/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
        });

        const userMarker = L.marker([userLocation.latitude, userLocation.longitude], {
            icon: userIcon,
        })
            .addTo(map)
            .bindPopup('Your location');

        const storeLocations: L.LatLngTuple[] = [[userLocation.latitude, userLocation.longitude]];

        vendorVisits.forEach((visit) => {
            const { name, location } = visit.store;
            storeLocations.push([location.latitude, location.longitude] as L.LatLngTuple);
            const productList = visit.inventory
                .map((item) => `${item.product.name}: ${item.price} SEK`)
                .join('<br>');

            L.marker([location.latitude, location.longitude], { icon: customIcon })
                .addTo(map)
                .bindPopup(`<b>${name}</b><br> ${productList}`);
        });

        if (storeLocations.length > 1) {
            const routePolyline = L.polyline(storeLocations, {
                color: 'blue',
                weight: 4,
                opacity: 0.7,
            }).addTo(map);

            map.fitBounds(routePolyline.getBounds());
        }

        return () => {
            // Cleanup function to remove map instance on component unmount
            map.remove();
        };
    }, [vendorVisits, userLocation]);

    return <div id="map" style={{ width: '100%', height: '500px' }} />;
};

export default MapComponent;
