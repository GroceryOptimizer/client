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

export interface VendorDTO {
  id: number;
  name: string;
  coordinatesId: number;
  coordinates: CoordinatesDTO;
}

export interface VendorVisitDTO {
  vendorId: number;
  vendor: VendorDTO;
  stockItems: StockItemDTO[];
}
