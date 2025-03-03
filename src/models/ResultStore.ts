import { StoreInventory } from '~models';

export interface ResultStore {
    stores: StoreInventory[];
    add: (store: StoreInventory) => void;
    update: (store: StoreInventory) => void;
    remove: (id: number) => void;
    clear: () => void;
}
