import type { Product } from '~models';

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface CartStore {
    cart: CartItem[];
    add: (product: Product) => void;
    remove: (product: Product) => void;
    update: (product: Product, quantity: number) => void;
    clear: () => void;
}
