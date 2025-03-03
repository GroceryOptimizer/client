'use client';

import type { ReactElement, ReactNode } from 'react';
import { Product } from '~models';
import { ProductCard } from '~ui';

type Props = {
    children?: ReactNode;
    products: Product[];
    addToCart: (item: Product) => void;
};

export default function ProductGrid({ children, products, addToCart }: Props): ReactElement {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((x, i) => (
                <ProductCard key={i} product={x} addToCart={addToCart} />
            ))}
        </div>
    );
}
