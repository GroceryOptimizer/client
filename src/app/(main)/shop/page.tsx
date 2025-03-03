'use client';

import { type ReactElement, type ReactNode } from 'react';
import ProductGrid from '~/components/layout/ProductGrid';
import {
    ProductCard,
    ProductCardBody,
    ProductCardFooter,
    ProductCardHeader,
} from '~components/ui/products';
import { Product } from '~models';
import { useCartStore } from '~/stores';
import { mockProducts } from '~/data/mockProducts';
import { Button } from '@heroui/react';

type Props = {
    children: ReactNode;
};

export default function ShopPage({ children }: Props): ReactElement {
    const products = mockProducts;
    const { cart, add: addToCart, clear: clearCart } = useCartStore();

    const handleAddToCart = (item: Product) => {
        addToCart(item);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-6 p-6 max-w-7xl mx-auto">
            {/* Product Grid */}
            <div className="">
                <ProductGrid>
                    {products.map((x, i) => (
                        <ProductCard key={i}>
                            <ProductCardHeader className="flex flex-col">
                                <img src={x.image} alt={x.name} />
                                <h2>{x.name}</h2>
                            </ProductCardHeader>
                            <ProductCardBody>
                                <p>{x.description}</p>
                            </ProductCardBody>
                            <ProductCardFooter key={i}>
                                <Button color="secondary" onPress={() => handleAddToCart(x)}>
                                    Köp
                                </Button>
                            </ProductCardFooter>
                        </ProductCard>
                    ))}
                </ProductGrid>
            </div>
        </div>
    );
}
