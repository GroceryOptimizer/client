import { Coordinates, CoordinatesDTO, Product, ProductDTO, StockItem, StockItemDTO, Store, StoreInventory, VendorDTO, VendorVisitDTO } from '~/models/v1'

function mapCoordinates(coordinatesDTO: CoordinatesDTO): Coordinates {
    return {
        latitude: coordinatesDTO.latitude,
        longitude: coordinatesDTO.longitude,
    };
}

function mapProduct(productDTO: ProductDTO): Product {
    return {
        name: productDTO.name,
    };
}

function mapStockItem(stockItemDTO: StockItemDTO): StockItem {
    return {
        product: mapProduct(stockItemDTO.product),
        price: stockItemDTO.price,
    };
}

function mapStore(vendorDTO: VendorDTO): Store {
    return {
        id: vendorDTO.id,
        name: vendorDTO.name,
        location: mapCoordinates(vendorDTO.location),
    };
}

export function mapStoreInventory(vendorVisitDTO: VendorVisitDTO): StoreInventory {
    return {
        store: mapStore(vendorVisitDTO.store),
        inventory: vendorVisitDTO.stockItems.map(mapStockItem),
    };
}