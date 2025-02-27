'use client';

import { useEffect, useState, type ReactElement, type ReactNode } from 'react';
import ProductGrid from '~/components/layout/ProductGrid';
import { ProductCard, ProductCardBody, ProductCardFooter, ProductCardHeader } from '~components/ui/products';
import { useCartStore } from '~/stores';

import { mockProducts } from '~/data/mockProducts';
import { Product } from '~models';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@heroui/react';
import MapComponent from "../../../components/ui/MapComponent/MapComponent";
import ShoppingRouteComponent from "../../../components/ui/ShoppingRouteComponent/ShoppingRouteComponent";
import RouteChoiceRadio from '~components/ui/RouteChoiceRadio/RouteChoiceRadio';
import axios from 'axios';
import { Coordinates, StoreInventory } from '~/models/v1';
import { mapStoreInventory } from '~/utils/mappers';
import { getAllPermutations, getDistance } from '~/utils/helpers';
import { filterStoresByPrice, filterStoresByDistance, filterStoresByHybrid } from '~/utils/filters';
import { useResultStore } from '~/stores/resultStore';

type Props = {
  children: ReactNode;
};

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

export default function ShopPage({ children }: Props): ReactElement {

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

  const products = mockProducts;
  const addToCart = useCartStore((state) => state.add);
  const clearCart = useCartStore((state) => state.clear);
  const cart = useCartStore((state) => state.cart);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const toggleCategory = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };

  const handleAddToCart = (item: Product) => {
    addToCart(item);
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

  useEffect(() => {
    console.log(cart);
  }, [cart]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-6 p-6 max-w-7xl mx-auto">
      {/* Left Sidebar - Categories */}
      <button
        onClick={toggleCategory}
        className='md:hidden p-2 rounded-lg'
      >
        Categories
      </button>
      <div className={`${isCategoryOpen ? "block" : "hidden"} md:block w-64 bg-white p-6 rounded-lg shadow-sm`}>
        <h4 className="mb-4">Categories</h4>
        <ul className="space-y-2">
          <li>
            <a href="#" className="text-gray-700 hover:text-blue-500">
              Electronics
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-700 hover:text-blue-500">
              Clothing
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-700 hover:text-blue-500">
              Home & Garden
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-700 hover:text-blue-500">
              Sports
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-700 hover:text-blue-500">
              Accessories
            </a>
          </li>
        </ul>
      </div>



      {/* Product Grid */}
      <div className="">
        <ProductGrid>
          {products.map((x, i) => (
            <ProductCard key={i}>
              <ProductCardHeader className='flex flex-col'>
                <img src={x.image} alt={x.name} />
                <h2>{x.name}</h2>
              </ProductCardHeader>
              <ProductCardBody>
                <p>{x.description}</p>
              </ProductCardBody>
              <ProductCardFooter key={i}>
                <button className="bg-green-300 border border-green-500 px-4 py-1 rounded-md" onClick={() => handleAddToCart(x)} >Add to card</button>
              </ProductCardFooter>
            </ProductCard>
          ))}
        </ProductGrid>
      </div>

      <div className="flex-1"></div>
    </div>
  );
}
