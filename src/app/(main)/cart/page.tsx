'use client';

import { ReactElement } from 'react';
import { useCartStore } from '~/stores';

type Props = {};

export default function CartPage({}: Props): ReactElement {
    const cart = useCartStore((state) => state.cart);
    return (
        <div>
            <h1>Cart</h1>
            <ul>
                {cart.map((item, index) => (
                    <li key={index}>{item.product.name}</li>
                ))}
            </ul>
        </div>
    );
}
