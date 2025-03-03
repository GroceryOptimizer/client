import { Coordinates, StockItem } from '~models';

export interface Store {
    id: number;
    name: string;
    location: Coordinates;
}

export interface StoreInventory {
    store: Store;
    inventory: StockItem[];
}
