"use client"

import { useEffect, useState } from "react";
import { StoreInventory } from "~/models/v1";
import { OptimizedRoute, useRouteStore } from "~/stores";
import { useResultStore } from "~/stores/resultStore";
import { filterStoresByDistance, filterStoresByHybrid, filterStoresByPrice } from "~/utils/filters";
import { getAllPermutations, getDistance } from "~/utils/helpers";
import MapComponent from "~components/ui/MapComponent/MapComponent";
import RouteChoiceRadio from "~components/ui/RouteChoiceRadio/RouteChoiceRadio";
import ShoppingRouteComponent from "~components/ui/ShoppingRouteComponent/ShoppingRouteComponent";
import { Coordinates } from "~models";

export default function OptimizePage() {
  const { stores: results } = useResultStore();
  const { routes, add: addRoute, clear: clearRoutes } = useRouteStore();
  const [storeInventories, setStoreInventories] = useState<StoreInventory[]>([]);
  const [userLocation] = useState<Coordinates>({ latitude: 65.58306895412348, longitude: 22.158208878223377 });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [priority, setPriority] = useState("cheapest");
  const [routeCosts, setRouteCosts] = useState({ cheapest: 0, shortest: 0, hybrid: 0 });

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
      return total + store.inventory.reduce((sum, item) => sum + item.price, 0)
    }, 0);
  };

  const updateRoute = (storeInventories: StoreInventory[]) => {
    let optimizedCheapest = filterStoresByPrice([...storeInventories]);
    let optimizedShortest = filterStoresByDistance([...storeInventories], userLocation);
    let optimizedHybrid = filterStoresByHybrid([...storeInventories], userLocation);

    setRouteCosts({
      cheapest: calculateTotalCost(optimizedCheapest),
      shortest: calculateTotalCost(optimizedShortest),
      hybrid: calculateTotalCost(optimizedHybrid)
    });

    clearRoutes();
    addRoute({ name: "Cheapest", stores: findOptimalRoute(userLocation, optimizedCheapest, getDistance) })
    addRoute({ name: "Shortest", stores: findOptimalRoute(userLocation, optimizedShortest, getDistance) })
    addRoute({ name: "Hybrid", stores: findOptimalRoute(userLocation, optimizedHybrid, getDistance) })
  }

  useEffect(() => {
    if (results.length > 0) {
      updateRoute(results);
    }
    setStoreInventories(routes.find((x) => x.name.toLowerCase() === priority.toLowerCase())?.stores ?? []);
  }, [priority, results]);

  useEffect(() => {
    console.log("OptimizePage effect triggered")
    console.log(results);
  }, [results])

  return (
    <div>
      <div className="radioDiv">
        <RouteChoiceRadio priority={priority} setPriority={setPriority} routeCosts={routeCosts} />
      </div>
      <div className='leaflet-container bg-white-500'>
        <MapComponent vendorVisits={storeInventories} userLocation={userLocation} />
      </div>
      <div className="shoppingRouteDiv">
        <ShoppingRouteComponent route={storeInventories} />
      </div>
    </div>
  );
}
