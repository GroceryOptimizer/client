'use client';

import { Card, CardHeader, CardBody, CardFooter } from '@heroui/card';
import type { ReactElement, ReactNode } from 'react';
import { useCartStore } from '~/stores';
import { Product } from '~models';

type ProductCardProps = {
    children?: ReactNode;
    item?: Product;
};

export function ProductCard({ children }: ProductCardProps): ReactElement {
    const addToCart = useCartStore((state) => state.add);

    return <Card>{children}</Card>;
}

export function ProductCardHeader({
    className,
    children,
}: {
    className?: string;
    children: ReactNode;
}): ReactElement {
    return <CardHeader className={className}>{children}</CardHeader>;
}

export function ProductCardBody({ children }: { children: ReactNode }): ReactElement {
    return <CardBody>{children}</CardBody>;
}

export function ProductCardFooter({ children }: { children: ReactNode }): ReactElement {
    return <CardFooter>{children}</CardFooter>;
}
