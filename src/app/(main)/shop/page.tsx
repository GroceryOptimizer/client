'use client';

import { useEffect, type ReactElement, type ReactNode } from 'react';

import { Card, CardHeader, CardBody, CardFooter } from '@heroui/card';
import ProductGrid from '~/components/layout/ProductGrid';
import ProductCard from '~/components/ProductCard/ProductCard';

import useCartStore from '~/store/cartstore';

type Props = {
  children: ReactNode;
};
export default function ShopPage({ children }: Props): ReactElement {
  const addToCart = useCartStore((state) => state.add);
  const clearCart = useCartStore((state) => state.clear);
  const cart = useCartStore((state) => state.cart);

  useEffect(() => {
    console.log(cart);
  }, [cart]);

  return (
    <div className="flex p-6 gap-6">
      {/* Left Sidebar - Categories */}
      <div className="w-64 bg-white p-6 rounded-lg shadow-sm">
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
      <div className="flex-1">
        <button onClick={clearCart}>Clear Cart</button>
        <ProductGrid>
          <ProductCard>Product 1</ProductCard>
        </ProductGrid>
      </div>

      <div className="flex-1"></div>
    </div>
  );
}
