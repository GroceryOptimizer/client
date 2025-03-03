'use client';

import { Link, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ReactElement } from 'react';
import { useCartStore, useResultStore } from '~/stores';
import { mapStoreInventory } from '~/utils/mappers';
import CartDropDown from '../cart/CartDropDown';

export default function TopNavbar(): ReactElement {
    const router = useRouter();
    const cart = useCartStore((state) => state.cart);
    const { add: addResult, clear: clearResult, stores: results } = useResultStore();

    const clearCart = () => {
        console.log('Clearing cart');
        useCartStore.setState({ cart: [] });
    };

    const sendCart = async () => {
        const postCart = { cart: cart.map((x) => ({ name: x.product.name })) };
        const res = await axios.post('http://localhost:7049/api/cart', postCart, {
            headers: { 'Content-Type': 'application/json' },
        });
        console.log(res.data);

        clearResult();
        res.data.map(mapStoreInventory).forEach(addResult);

        router.push('/optimize');
        return res.data;
    };

    const removeFromCart = (name: string) => {};

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
                    <CartDropDown cart={cart} clear={clearCart} send={sendCart} />
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
