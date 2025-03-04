'use client';

import type { ReactElement, ReactNode } from 'react';
import { Button, Card, CardHeader, CardBody, CardFooter } from '@heroui/react';

import { Product } from '~models';

type ProductCardProps = {
    children?: ReactNode;
    product: Product;
    addToCart: (item: Product) => void;
};

export function ProductCard({ children, product, addToCart }: ProductCardProps): ReactElement {
    return (
        <Card className="max-w-64 p-2">
            <CardHeader className="flex flex-col">
                <div className="aspect-w-1 aspect-h-1 ">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="object-contain w-full h-full"
                    />
                </div>

                <h2 className="text-l font-bold text-gray-900 mt-2">{product.name}</h2>
                <p className="text-sm text-center font-semibold text-gray-700">{product.brand}</p>
            </CardHeader>
            <CardBody className="px-4">
                <p className="text-sm text-gray-800">{product.description}</p>
            </CardBody>
            <CardFooter>
                <Button
                    color="secondary"
                    onPress={() => addToCart(product)}
                    className="w-full mx-4"
                >
                    Köp
                </Button>
            </CardFooter>
        </Card>
    );
}
