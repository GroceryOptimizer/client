export interface CoordinatesDTO {
    id: number;
    longitude: number;
    latitude: number;
}

export interface ProductDTO {
    name: string;
}

export interface ShoppingCartDTO {
    cart: ProductDTO[];
}

export interface StockItemDTO {
    product: ProductDTO;
    price: number;
}

export interface StoreDTO {
    id: number;
    name: string;
    location: CoordinatesDTO;
}

export interface StoreVisitDTO {
    storeId: number;
    store: StoreDTO;
    stockItems: StockItemDTO[];
}
