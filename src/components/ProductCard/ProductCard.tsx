'use client';

import { Card, CardHeader, CardBody, CardFooter } from '@heroui/card';
import type { ReactElement, ReactNode } from 'react';
import { Product } from '~/models';
import useCartStore from '~/store/cartstore';

type Props = {
  children: ReactNode;
};

export default function ProductCard({ children }: Props): ReactElement {
  const addToCart = useCartStore((state) => state.add);

  const addTest = (prod: Product) => {
    addToCart(prod);
    console.log(prod);
  };

  return (
    <Card>
      <CardHeader>
        <h2>Product Name</h2>
      </CardHeader>
      <CardBody>
        <p>Product description goes here.</p>
        {children}
      </CardBody>
      <CardFooter>
        <button onClick={() => addTest({ id: '1', name: 'Product Name' })}>Add to Cart</button>
      </CardFooter>
    </Card>
  );
}
