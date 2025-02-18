import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import type { Product, CartItem, CartStore } from '~models';

const useCartStore = create<CartStore>()(
  persist((set, get) => ({
    cart: [],

    add: (prod) => {
      set((state) => {
        const existing = state.cart.find((x) => x.product.id === prod.id);
        if (existing) {
          return {
            cart: state.cart.map((x) =>
              x.product.id === prod.id ? { ...x, quantity: x.quantity + 1 } : x)
          }
        }
        return { cart: [...state.cart, { product: prod, quantity: 1 }] }
      })
    },
    update: (prod, quant) => {
      set((state) => ({
        cart: state.cart.map((x) => x.product.id === prod.id ? { ...x, quantity: quant } : x)
      }))

    },

    remove: (prod) => {
      set((state) => ({
        cart: state.cart.filter((x) => x.product.id !== prod.id)
      }))

    },

    clear: () => set({ cart: [] }),
  }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage)
    })
);

export { useCartStore };
