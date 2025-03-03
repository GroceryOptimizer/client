import { Coordinates, StoreInventory } from '~models';
import { getDistance } from './helpers';
import { useState } from 'react';

export function filterStoresByHybrid(
    vendors: StoreInventory[],
    userLocation: Coordinates,
    costWeight: number,
    distanceWeight: number
): StoreInventory[] {
    // 1: Find min/max values for normalization
    let minCost = Infinity,
        maxCost = 0;
    let minDistance = Infinity,
        maxDistance = 0;

    vendors.forEach((vendor) => {
        const totalCost = vendor.inventory.reduce((sum, item) => sum + item.price, 0);
        const distance = getDistance(userLocation, vendor.store.location);

        if (totalCost < minCost) minCost = totalCost;
        if (totalCost > maxCost) maxCost = totalCost;
        if (distance < minDistance) minDistance = distance;
        if (distance > maxDistance) maxDistance = distance;
    });

    // 2: Calculate normalized scores
    let weightedVendors = vendors.map((vendor) => {
        const totalCost = vendor.inventory.reduce((sum, item) => sum + item.price, 0);
        const distance = getDistance(userLocation, vendor.store.location);

        const normalizedCost = (totalCost - minCost) / (maxCost - minCost || 1); // Avoid divide by zero
        const normalizedDistance = (distance - minDistance) / (maxDistance - minDistance || 1);

        // Weighted formula using normalized values
        const hybridScore = normalizedCost * costWeight + normalizedDistance * distanceWeight;

        return { ...vendor, hybridScore };
    });

    // 3: Sort vendors by hybrid score
    weightedVendors.sort((a, b) => a.hybridScore - b.hybridScore);

    // 4: Remove unnecessary stores
    let selectedProducts = new Set<string>();
    let optimizedVendors: StoreInventory[] = [];

    for (let vendor of weightedVendors) {
        let filteredInventory = vendor.inventory.filter((item) => {
            return !selectedProducts.has(item.product.name);
        });

        if (filteredInventory.length > 0) {
            optimizedVendors.push({ ...vendor, inventory: filteredInventory });
            filteredInventory.forEach((item) => selectedProducts.add(item.product.name));
        }
    }

    return optimizedVendors;
}

export function filterStoresByDistance(
    vendors: StoreInventory[],
    userLocation: Coordinates
): StoreInventory[] {
    // 1: Sort by proximity to user
    let sortedVendors = vendors.sort((a, b) => {
        const distanceA = getDistance(userLocation, a.store.location);
        const distanceB = getDistance(userLocation, b.store.location);
        return distanceA - distanceB;
    });

    // 2: Ensure only necessary stores are in the route
    let selectedProducts = new Set<string>();
    let optimizedVendors: StoreInventory[] = [];

    for (let vendor of sortedVendors) {
        let filteredInventory = vendor.inventory.filter((item) => {
            // 3: Only keep products that havent been added to the shopping list yet
            return !selectedProducts.has(item.product.name);
        });

        if (filteredInventory.length > 0) {
            optimizedVendors.push({ ...vendor, inventory: filteredInventory });
            filteredInventory.forEach((item) => selectedProducts.add(item.product.name));
        }
    }

    return optimizedVendors;
}

export function filterStoresByPrice(vendors: StoreInventory[]): StoreInventory[] {
    let productMap = new Map<string, { price: number; storeId: number }>();
    let storeUsage = new Map<number, boolean>(); // Track which stores are actually used

    // Step 1: Find the cheapest price for each product
    vendors.forEach((vendor) => {
        vendor.inventory.forEach((item) => {
            const existing = productMap.get(item.product.name);
            if (!existing || item.price < existing.price) {
                productMap.set(item.product.name, { price: item.price, storeId: vendor.store.id });
            }
        });
    });

    // Step 2: Assign each product to its cheapest vendor
    let updatedVendors = vendors.map((vendor) => {
        let filteredInventory = vendor.inventory.filter((item) => {
            return productMap.get(item.product.name)?.storeId === vendor.store.id;
        });

        if (filteredInventory.length > 0) {
            storeUsage.set(vendor.store.id, true); // Mark store as needed
        }

        return { ...vendor, inventory: filteredInventory };
    });

    // Step 3: Remove unnecessary stores (stores with no needed products)
    updatedVendors = updatedVendors.filter((vendor) => storeUsage.get(vendor.store.id) === true);

    return updatedVendors;
}
