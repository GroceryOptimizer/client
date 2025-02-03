import type { Product } from "./Product"

export type CartItem = {
  product: Product
  quantity: number
}

export interface CartStore {
  cart: CartItem[];
  add: (product: Product) => void;
  remove: (product: Product) => void;
  update: (product: Product, quantity: number) => void;
  clear: () => void;
}
