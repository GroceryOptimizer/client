'use client';

import { ReactElement } from 'react';
import axios from 'axios';
import { Link, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useCartStore, useResultStore } from '~/stores';
import { mapStoreInventory } from '~/utils/mappers';
import { CartDropDown } from '~ui';

export default function TopNavbar(): ReactElement {
    const router = useRouter();
    const { cart, clear: clearCart } = useCartStore();
    const { add: addResult, clear: clearResult } = useResultStore();

    const sendCart = async () => {
        const postCart = { cart: cart.map((x) => ({ name: x.product.name })) };
        const res = await axios.post('http://localhost:7049/api/cart', postCart, {
            headers: { 'Content-Type': 'application/json' },
        });

        clearResult();
        res.data.map(mapStoreInventory).forEach(addResult);
        clearCart();

        router.push('/optimize');
    };

    return (
        <Navbar>
            <NavbarBrand>
                <p className="font-bold text-inherit">Grocer</p>
            </NavbarBrand>
            <NavbarContent>
                <NavbarItem>
                    <Link href="/shop">Handla</Link>
                </NavbarItem>
                <NavbarItem>
                    <Link href="/optimize">Karta</Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem>
                    <CartDropDown cart={cart} clearCart={clearCart} sendCart={sendCart} />
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
