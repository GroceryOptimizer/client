"use client"

import { useResultStore } from "~/stores/optimizeStore";

export default function V1OptimizePage() {
    const { stores, clear: clearResult } = useResultStore();

    if (stores.length === 0) {
        throw new Error("No stores found");
    }

    return (
        <div>
            <h1>Shopping route</h1>
            {/* Add your optimized content here */}
        </div>
    );
}