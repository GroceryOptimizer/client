'use client';

import { useEffect, useState, type ReactElement, type ReactNode } from 'react';
import ProductGrid from '~/components/layout/ProductGrid';
import { ProductCard, ProductCardBody, ProductCardFooter, ProductCardHeader } from '~components/ui/products';
import { useCartStore } from '~/stores';

import { mockProducts } from '~/data/mockProducts';
import { Product } from '~models';

type Props = {
  children: ReactNode;
};

export default function ShopPage({ children }: Props): ReactElement {
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
              <ProductCardHeader>
                <h2>{x.name}</h2>
              </ProductCardHeader>
              <ProductCardBody>
                <p>{x.value} {x.unit}</p>
                <p>Price: ${x.price}</p>

              </ProductCardBody>
              <ProductCardFooter key={i}>
                <button onClick={() => handleAddToCart(x)} >Add to card</button>
              </ProductCardFooter>
            </ProductCard>
          ))}
        </ProductGrid>
      </div>

      <div className="flex-1"></div>
    </div>
  );
}
