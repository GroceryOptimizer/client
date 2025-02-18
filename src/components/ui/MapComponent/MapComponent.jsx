import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = () => {
    useEffect(() => {
        // Ensure the map is only initialized once
        if (!document.getElementById("map")) return;

        // Create the map
        const map = L.map("map", {
            center: [65.58306895412348, 22.158208878223377],
            zoom: 13,
        });

        // Add a tile layer (OpenStreetMap as default)
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

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