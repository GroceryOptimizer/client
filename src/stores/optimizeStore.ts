import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { Product, ResultStore } from '~/models/v1';

const useResultStore = create<ResultStore>()(
  persist(
    (set, get) => ({
      stores: [],

      add: (item) => {
        set((state) => {
          const newStores = [...state.stores, item];
          return { stores: newStores };
        });
      },

      update: (item) => {
        set((state) => {
          const storeIndex = state.stores.findIndex((si) => si.store.id === item.store.id);
          if (storeIndex !== -1) {
            const updatedStores = [...state.stores];
            updatedStores[storeIndex] = item;
            return { stores: updatedStores };
          } else {
            const newStores = [...state.stores, item];
            return { stores: newStores };
          }
        });
      },

      remove: (id) => {
        set((state) => ({
          stores: state.stores.filter((si) => si.store.id !== id),
        }));
      },

      clear: () => set({ stores: [] }),
    }),
    {
      name: 'result-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export { useResultStore };
