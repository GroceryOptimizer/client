'use client';

import { ReactNode, useEffect, useState } from 'react';
import MapComponent from "../../../components/ui/MapComponent/MapComponent";
import ShoppingRouteComponent from "../../../components/ui/ShoppingRouteComponent/ShoppingRouteComponent";
import axios from 'axios';
import { Coordinates, CoordinatesDTO, Product, ProductDTO, StockItem, StockItemDTO, Store, StoreInventory, VendorDTO, VendorVisitDTO } from '~/models/v1'
import { useResultStore } from '~/stores/optimizeStore';

function mapCoordinates(coordinatesDTO: CoordinatesDTO): Coordinates {
    return {
        latitude: coordinatesDTO.latitude,
        longitude: coordinatesDTO.longitude,
    };
}

function mapProduct(productDTO: ProductDTO): Product {
    return {
        name: productDTO.name,
    };
}

function mapStockItem(stockItemDTO: StockItemDTO): StockItem {
    return {
        product: mapProduct(stockItemDTO.product),
        price: stockItemDTO.price,
    };
}

function mapStore(vendorDTO: VendorDTO): Store {
    return {
        id: vendorDTO.id,
        name: vendorDTO.name,
        location: mapCoordinates(vendorDTO.location),
    };
}

function mapStoreInventory(vendorVisitDTO: VendorVisitDTO): StoreInventory {
    return {
        store: mapStore(vendorVisitDTO.vendor),
        inventory: vendorVisitDTO.stockItems.map(mapStockItem),
    };
}

function filterVendors(vendors: StoreInventory[]): StoreInventory[] {
    // Step 1: Track the cheapest vendor for each product
    let productMap = new Map<string, { price: number; vendorId: number }>();

    vendors.forEach((vendor) => {
        vendor.inventory.forEach((item) => {
            const existing = productMap.get(item.product.name);
            if (!existing || item.price < existing.price) {
                productMap.set(item.product.name, { price: item.price, vendorId: vendor.store.id });
            }
        });
    });

    // Step 2: Determine which vendors are still needed
    let validVendors = new Map<number, StoreInventory>();

    vendors.forEach((vendor) => {
        let isNeeded = vendor.inventory.some(item => productMap.get(item.product.name)?.vendorId === vendor.store.id);
        if (isNeeded) {
            validVendors.set(vendor.store.id, vendor);
        }
    });

    return Array.from(validVendors.values());
}

// Step 1 for brute-force'ing the optimal route
function getAllPermutations<T>(arr: T[]): T[][] {
    if (arr.length <= 1) return [arr];

    let permutations: T[][] = [];
    arr.forEach((item, index) => {
        let remaining = arr.slice(0, index).concat(arr.slice(index + 1));
        let subPermutations = getAllPermutations(remaining);
        subPermutations.forEach((perm) => permutations.push([item, ...perm]));
    });

    return permutations;
}

function findOptimalRoute(
    start: Coordinates,
    vendors: StoreInventory[],
    getDistance: (a: Coordinates, b: Coordinates) => number
): StoreInventory[] {

    const allRoutes = getAllPermutations(vendors);
    let bestRoute: StoreInventory[] = [];
    let bestDistance = Infinity;

    // Step 2 for brute-force'ing the optimal route
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

// Placeholder distance function (straight-line distance)
function getDistance(a: Coordinates, b: Coordinates): number {
    return Math.sqrt(Math.pow(a.latitude - b.latitude, 2) + Math.pow(a.longitude - b.longitude, 2));
}

async function sendCart(cart: { cart: Product[] }) {
    try {
        const res = await axios.post('http://localhost:7049/api/cart', cart, {
            headers: { 'Content-Type': 'application/json' },
        });
        return res.data;
    } catch (error: any) {
        console.error('Error sending cart:', error);
        throw new Error(`Failed to send cart: ${error.response?.status} - ${error.message}`);
    }
}

export default function V1ShopPage({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<Product[]>([]);
    const { add: addResult, clear: clearResults } = useResultStore();
    const [buttonPressed, setButtonPressed] = useState(false);
    const [storeInventories, setStoreInventories] = useState<StoreInventory[]>([]);
    const [userLocation] = useState<Coordinates>({ latitude: 65.58306895412348, longitude: 22.158208878223377 });


    const handleAddToCart = () => {
        const productInput = document.getElementById('input-product-name') as HTMLInputElement;
        if (!productInput) return;

        const newProduct: Product = { name: productInput.value };
        setCart([...cart, newProduct]);
        productInput.value = '';
    };

    const handleSubmitCart = async () => {
        const shoppingCart = { cart };
        const vendorVisits = await sendCart(shoppingCart);
        let storeInventories: StoreInventory[] = vendorVisits.map(mapStoreInventory);

        storeInventories = filterVendors(storeInventories)
        const optimalRoute = findOptimalRoute(userLocation, storeInventories, getDistance)

        clearResults();
        storeInventories.forEach(addResult);
        setStoreInventories(optimalRoute);
        setButtonPressed(true);
        setCart([]);
    };

    const handleRemoveFromCart = (index: number) => {
        setCart(cart.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col gap-8 items-center justify-center h-screen">
            <div className="bg-slate-100 rounded-lg shadow-md p-8">
                <h3 className='text-xl mb-4'>V1 Shop</h3>
                <div className="flex flex-row gap-4">
                    <input id="input-product-name" className='px-2 border-1 border-gray-300 focus:outline-none focus:border-blue-500' type="text" placeholder="Product Name..."></input>
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
            </div>
            <div className="">
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
                {buttonPressed && <ShoppingRouteComponent route={storeInventories} /> }
            </div>
        </div>
    );
}
