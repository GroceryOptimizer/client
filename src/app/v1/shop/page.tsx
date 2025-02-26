'use client';

import { ReactNode, useEffect, useState } from 'react';
import MapComponent from "../../../components/ui/MapComponent/MapComponent";
import ShoppingRouteComponent from "../../../components/ui/ShoppingRouteComponent/ShoppingRouteComponent";
import RouteChoiceRadio from '~components/ui/RouteChoiceRadio/RouteChoiceRadio';
import axios from 'axios';
import { Coordinates, Product, StoreInventory } from '~/models/v1';
import { mapStoreInventory } from '~/utils/mappers';
import { getAllPermutations, getDistance } from '~/utils/helpers';
import { filterStoresByPrice, filterStoresByDistance, filterStoresByHybrid } from '~/utils/filters';
import { useResultStore } from '~/stores/optimizeStore';


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

async function sendCart(cart: { cart: Product[] }) {
    try {
        const res = await axios.post('http://localhost:7049/api/cart', cart, {
            headers: { 'Content-Type': 'application/json' },
        });
        return res.data;
    } catch (error: any) {
        console.error('Error sending cart:', error);
        if (error.response?.status === 400) {
            throw new Error("Some products were not found at any vendor.");
        } else {
            throw new Error(`Failed to send cart: ${error.response?.status} - ${error.message}`);
        }
    }
}

export default function V1ShopPage({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<Product[]>([]);
    const { add: addResult, clear: clearResults } = useResultStore();
    const [buttonPressed, setButtonPressed] = useState(false);
    const [storeInventories, setStoreInventories] = useState<StoreInventory[]>([]);
    const [userLocation] = useState<Coordinates>({ latitude: 65.58306895412348, longitude: 22.158208878223377 });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [priority, setPriority] = useState("cheapest");
    const [latestVendorVisit, setLatestVendorVisit] = useState<StoreInventory[]>([]);
    const [cartErrorMessage, setCartErrorMessage] = useState<string | null>();
    const [routeCosts, setRouteCosts] = useState({ cheapest: 0, shortest: 0, hybrid: 0 });

    useEffect(() => {
        if (latestVendorVisit.length > 0) {
            updateRoute(latestVendorVisit);
        }
    }, [priority]);

    const handleAddToCart = () => {
        const productInput = document.getElementById('input-product-name') as HTMLInputElement;
        if (!productInput) return;

        const newProduct: Product = { name: productInput.value };
        if (cart.some((p) => p.name.toLocaleLowerCase() === newProduct.name.toLocaleLowerCase())) {
            setCartErrorMessage(`"${newProduct.name}" is already in the cart.`);
            setTimeout(() => setCartErrorMessage(null), 3000);
            return;
        }
        setCart([...cart, newProduct]);
        productInput.value = '';
        setCartErrorMessage(null);
    };

    const handleSubmitCart = async () => {
        setErrorMessage(null);

        try {
            const shoppingCart = { cart };
            const vendorVisits = await sendCart(shoppingCart);

            const mappedStoreInventories = vendorVisits.map(mapStoreInventory);
            setLatestVendorVisit(mappedStoreInventories);
            updateRoute(mappedStoreInventories);

            setButtonPressed(true);
            setCart([]);
        } catch (error: any) {
            console.error("Error: ", error);
            setErrorMessage(error.message);
            setTimeout(() => setErrorMessage(null), 5000);
        }
    };

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

        let finalRoute: StoreInventory[] = [];
        if (priority === "cheapest") {
            finalRoute = optimizedCheapest;
        } else if (priority === "shortest") {
            finalRoute = optimizedShortest;
        } else if (priority === "hybrid") {
            finalRoute = optimizedHybrid;
        }
        const optimalRoute = findOptimalRoute(userLocation, finalRoute, getDistance);

        clearResults();
        finalRoute.forEach(addResult);
        setStoreInventories(optimalRoute);
    }

    const handleRemoveFromCart = (index: number) => {
        setCart(cart.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col gap-8 items-center justify-center h-screen">
            {!buttonPressed && <div className="bg-slate-100 rounded-lg shadow-md p-8">
                <h3 className='text-xl mb-4'>V1 Shopping Optimizer</h3>
                <div className="flex flex-row gap-4">
                    <input id="input-product-name"
                        className='px-2 border-1 border-gray-300 focus:outline-none focus:border-blue-500'
                        type="text"
                        placeholder="Product Name..."
                        onKeyDown={(e) => e.key === 'Enter' && handleAddToCart()} />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        onClick={() => handleAddToCart()}
                    >
                        Add
                    </button>
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-60"
                        onClick={() => handleSubmitCart()}
                    >
                        Send Cart
                    </button>
                </div>
            </div>}
            {buttonPressed && <div className="backButtonDiv">
                <button className='bg-red-500 text-white px-4 py2 rounded-md hover:bg-red-60' onClick={() => setButtonPressed(false)}>Back</button>
            </div>}
            {cartErrorMessage && (
                <div className='bg-yellow-100 border border-yellow-400 text-yellow-600 px-4 py-2 rounded-md mt-2'>{cartErrorMessage}</div>
            )}
            {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md mt-4">
                    {errorMessage}
                </div>
            )}
            <div className="radioDiv">
                {buttonPressed && <RouteChoiceRadio priority={priority} setPriority={setPriority} routeCosts={routeCosts} />}
            </div>
            <div className="grid grid-cols-4 gap-4 p-4">
                {cart.map((p, i) => (
                    <div
                        key={i}
                        className="flex flex-row justify-between items-center p-4 border-b border-gray-200 hover:bg-gray-50 gap-8"
                    >
                        <div className="text-center">{p.name}</div>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-60"
                            onClick={() => handleRemoveFromCart(i)}
                        >
                            X
                        </button>
                    </div>
                ))}
            </div>
            <div className='leaflet-container bg-white-500'>
                {buttonPressed && <MapComponent vendorVisits={storeInventories} userLocation={userLocation} />}
            </div>
            <div className="shoppingRouteDiv">
                {buttonPressed && <ShoppingRouteComponent route={storeInventories} />}
            </div>
        </div>
    );
}
