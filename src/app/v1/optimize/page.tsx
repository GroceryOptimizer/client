"use client"

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";


const useStoresStock = () => useQuery({
    queryKey: ["cart"],
    queryFn: () => { throw new Error("Stock data not available") },
    staleTime: 60 * 60 * 24
});

export default function V1OptimizePage() {
    const { data: storesStock, isLoading, error } = useStoresStock();

    if (isLoading) {
        return <p>Loading...</p>;
    }

    useEffect(() => {
        console.log("Stores stock fetched:", storesStock);
    }, [storesStock]);

    return (
        <div>
            <h1>Optimized Page</h1>
            {/* Add your optimized content here */}
        </div>
    );
}