export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Product {
  name: string;
}

export interface Store {
  id: number;
  name: string;
  location: Coordinates;
}

export interface StockItem {
  product: Product;
  price: number;
}

export interface StoreInventory {
  store: Store;
  inventory: StockItem[];
}

export interface ResultStore {
  stores: StoreInventory[];
  add: (store: StoreInventory) => void;
  update: (store: StoreInventory) => void;
  remove: (id: number) => void;
  clear: () => void;
}

export interface CoordinatesDTO {
  latitude: number;
  longitude: number;
}

export interface ProductDTO {
  name: string;
}

export interface StockItemDTO {
  product: ProductDTO;
  price: number;
}

export interface VendorDTO {
  id: number;
  name: string;
  location: CoordinatesDTO;
}

export interface VendorVisitDTO {
  vendorId: number;
  vendor: VendorDTO;
  stockItems: StockItemDTO[];
}
