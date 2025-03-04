'use client';

import { useEffect, useState } from 'react';
import { Coordinates, StoreInventory } from '~models';
import { useRouteStore, useResultStore } from '~/stores';
import { filterStoresByDistance, filterStoresByHybrid, filterStoresByPrice } from '~/utils/filters';
import { getAllPermutations, getDistance } from '~/utils/helpers';
import { DynamicMap as Map, RouteChoiceRadio, ShoppingRoute } from '~ui';

export default function OptimizePage() {
    const { stores: results } = useResultStore();
    const { routes, add: addRoute, clear: clearRoutes } = useRouteStore();
    const [storeInventories, setStoreInventories] = useState<StoreInventory[]>([]);
    const [userLocation] = useState<Coordinates>({
        latitude: 65.58306895412348,
        longitude: 22.158208878223377,
    });
    const [priority, setPriority] = useState('cheapest');
    const [routeCosts, setRouteCosts] = useState({ cheapest: 0, shortest: 0, hybrid: 0 });
    const [costWeight, setCostWeight] = useState(0.5);
    const [distanceWeight, setDistanceWeight] = useState(0.5);

    function findOptimalRoute(
        start: Coordinates,
        vendors: StoreInventory[],
        getDistance: (a: Coordinates, b: Coordinates) => number
    ): StoreInventory[] {
        const allRoutes = getAllPermutations(vendors);
        let bestRoute: StoreInventory[] = [];
        let bestDistance = Infinity;

        allRoutes.forEach((route) => {
            let totalDistance = calculateTotalDistance(start, route, getDistance);
            if (totalDistance < bestDistance) {
                bestDistance = totalDistance;
                bestRoute = route;
            }
        });

        return bestRoute;
    }

    function calculateTotalDistance(
        start: Coordinates,
        route: StoreInventory[],
        getDistance: (a: Coordinates, b: Coordinates) => number
    ): number {
        let totalDistance = 0;
        let prevLocation = start;

        route.forEach((store) => {
            totalDistance += getDistance(prevLocation, store.store.location);
            prevLocation = store.store.location;
        });

        return totalDistance;
    }

    const calculateTotalCost = (storeInventories: StoreInventory[]): number => {
        return storeInventories.reduce((total, store) => {
            return total + store.inventory.reduce((sum, item) => sum + item.price, 0);
        }, 0);
    };

    const updateRoute = (storeInventories: StoreInventory[]) => {
        let optimizedCheapest = filterStoresByPrice([...storeInventories]);
        let optimizedShortest = filterStoresByDistance([...storeInventories], userLocation);
        let optimizedHybrid = filterStoresByHybrid(
            [...storeInventories],
            userLocation,
            costWeight,
            distanceWeight
        );

        setRouteCosts({
            cheapest: calculateTotalCost(optimizedCheapest),
            shortest: calculateTotalCost(optimizedShortest),
            hybrid: calculateTotalCost(optimizedHybrid),
        });

        clearRoutes();
        addRoute({
            name: 'Cheapest',
            stores: findOptimalRoute(userLocation, optimizedCheapest, getDistance),
        });
        addRoute({
            name: 'Shortest',
            stores: findOptimalRoute(userLocation, optimizedShortest, getDistance),
        });
        addRoute({
            name: 'Hybrid',
            stores: findOptimalRoute(userLocation, optimizedHybrid, getDistance),
        });
    };

    useEffect(() => {
        if (results.length > 0) {
            updateRoute(results);
        }
        setStoreInventories(
            routes.find((x) => x.name.toLowerCase() === priority.toLowerCase())?.stores ?? []
        );
    }, [priority, results, costWeight]);

    return (
        <>
            <div className="max-w-md p-8">
                <div className="bg-slate-100 rounded-lg shadow-md relative z-10 flex flex-col">
                    <RouteChoiceRadio
                        priority={priority}
                        setPriority={setPriority}
                        routeCosts={routeCosts}
                    />
                    <ShoppingRoute route={storeInventories} />
                </div>
            </div>
            <Map
                stores={storeInventories}
                userLocation={userLocation}
                className="absolute top-0 left-0 w-screen h-screen -z-0"
            />
        </>
    );
}
