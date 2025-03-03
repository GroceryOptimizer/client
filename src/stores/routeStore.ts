import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { StoreInventory } from '~/models/v1';

export interface OptimizedRoute {
  name: string;
  stores: StoreInventory[];
}

export interface RouteStore {
  routes: OptimizedRoute[];
  add: (route: OptimizedRoute) => void;
  clear: () => void;
}

const useRouteStore = create<RouteStore>()(
  persist(
    (set, get) => ({
      routes: [],

      add: (item) => {
        set((state) => ({
          routes: [...state.routes, item],
        }));
      },

      clear: () => set({ routes: [] }),
    }),
    {
      name: 'route-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export { useRouteStore };
