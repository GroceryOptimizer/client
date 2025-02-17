'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { map } from 'leaflet';

async function sendCart(cart: { cart: { name: string; }[] }) {
    const res = await fetch('http://localhost:7049/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cart),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to send cart: ${res.status} - ${errorText || 'No details'}`);
    }

    return await res.json();
}

export default function V1ShopPage({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<string[]>([]);
    const qClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: sendCart,
        onSuccess: (data) => qClient.setQueryData(['cart'], data),
        onError: (error) => console.error('Error sending cart:', error),
    });

    const handleAddToCart = () => {
        const product = document.getElementById('input-product-name') as HTMLInputElement;
        if (!product) return;

        setCart([...cart, product.value]);
        product.value = '';
    };

    const handleRemoveFromCart = (index: number) => {
        setCart(cart.filter((_, i) => i !== index));
    };

    const handleSubmitCart = () => {

        const shoppingCart = { cart: cart.map((product) => ({ name: product })), };
        // console.log("cart", cart);
        console.log("shoppingCart", shoppingCart);

        mutate(shoppingCart);
        setCart([]);
    };

    useEffect(() => {
        console.log(cart);
    }, [cart]);

    return (
        <div className="flex flex-col gap-8 items-center justify-center h-screen">
            <div className="bg-slate-100 rounded-lg shadow-md p-8">
                <h3 className='text-xl mb-4'>V1 Shop</h3>
                <div className="flex flex-row gap-4">
                    <input id="input-product-name" className='px-2 border-1 border-gray-300 focus:outline-none focus:border-blue-500' type="text" placeholder="Product Name..."></input>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        onClick={() => handleAddToCart()}
                    >
                        Add
                    </button>
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-60"
                        onClick={() => handleSubmitCart()}
                    >
                        Send Cart
                    </button>
                </div>
            </div>
            <div className="">
                {cart.map((p, i) => (
                    <div
                        key={i}
                        className="flex flex-row justify-between items-center p-4 border-b border-gray-200 hover:bg-gray-50 gap-8"
                    >
                        <div className="text-center">{p}</div>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-60"
                            onClick={() => handleRemoveFromCart(i)}
                        >
                            X
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
