'use client';

import { useState, type ReactElement, type ReactNode } from 'react';
import { ProductGrid } from '~ui';
import { Input } from '@heroui/react';
import { Search as SearchIcon } from 'lucide-react';
import { Product } from '~models';
import { useCartStore } from '~/stores';
import { mockProducts } from '~/data/mockProducts';

type Props = {
    children?: ReactNode;
};

export default function ShopPage({ children }: Props): ReactElement {
    const products = mockProducts;
    const { cart, add: addToCart, clear: clearCart } = useCartStore();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'name' | 'brand'>('name');

    const handleAddToCart = (item: Product) => {
        addToCart(item);
    };

    const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sorted = sortOrder
        ? [...filtered].sort((a, b) => {
              switch (sortOrder) {
                  case 'name':
                      return a.name.localeCompare(b.name);
                  case 'brand':
                      return a.brand.localeCompare(b.brand);
                  default:
                      return 0;
              }
          })
        : filtered;

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="container mb-6 px-8">
                <Input
                    variant="bordered"
                    isClearable
                    description=""
                    placeholder="Sök efter produkter"
                    type="text"
                    onClear={() => setSearchQuery('')}
                    className="max-w-96"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    color="default"
                    startContent={<SearchIcon strokeWidth={1} />}
                />
            </div>
            <div className="">
                <ProductGrid products={sorted} addToCart={handleAddToCart} />
            </div>
        </div>
    );
}
