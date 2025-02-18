import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { StoreInventory } from '~/models/v1';
import markerIcon from "~/assets/marker-icon.png";
import markerShadow from "~/assets/marker-shadow.png";

interface MapProps {
    vendorVisits: StoreInventory[];
}

const MapComponent: React.FC<MapProps> = ({ vendorVisits }) => {
    useEffect(() => {
        // Ensure the map is only initialized once
        if (!document.getElementById("map")) return;

        // Create the map
        const map = L.map("map", {
            center: [65.58306895412348, 22.158208878223377],
            zoom: 16,
        });

        // Add a tile layer (OpenStreetMap as default)
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        const customIcon = L.icon({
            iconUrl: "leaflet/dist/images/marker-icon.png",
            shadowUrl: "leaflet/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
        });

        vendorVisits.forEach((visit) => {
            const { name, location } = visit.store;
            const productList = visit.inventory
                .map((item) => `${item.product.name}: ${item.price} SEK`)
                .join("<br>");

            L.marker([location.latitude, location.longitude])
                .addTo(map)
                .bindPopup(`<b>${name}</b><br> ${productList}`);
        });

        return () => {
            // Cleanup function to remove map instance on component unmount
            map.remove();
        };
    }, []);

    return (
        <div
            id="map"
            style={{ width: "100%", height: "500px" }}
        />
    );
}

export default MapComponent;