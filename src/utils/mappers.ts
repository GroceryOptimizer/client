import { mockProducts } from '~/data/mockProducts';
import {
    Coordinates,
    CoordinatesDTO,
    Product,
    ProductDTO,
    StockItem,
    StockItemDTO,
    Store,
    StoreInventory,
    StoreDTO,
    StoreVisitDTO,
} from '~models';

export function mapCoordinates(dto: CoordinatesDTO): Coordinates {
    return {
        latitude: dto.latitude,
        longitude: dto.longitude,
    };
}

export function mapProduct(dto: ProductDTO, products: Product[]): Product {
    return (
        products.find((p) => p.name.toLowerCase() === dto.name.toLowerCase()) ?? unknownProduct()
    );
}

export function mapStockItem(dto: StockItemDTO, products: Product[]): StockItem {
    return {
        product: mapProduct(dto.product, products),
        price: dto.price,
        quantity: 0,
    };
}

export function mapStore(dto: StoreDTO): Store {
    return {
        id: dto.id,
        name: dto.name,
        location: mapCoordinates(dto.location),
    };
}

export function mapStoreInventory(dto: StoreVisitDTO): StoreInventory {
    return {
        store: dto.store,
        inventory: dto.stockItems.map((x) => mapStockItem(x, mockProducts)),
    };
}

function unknownProduct(): Product {
    return { id: '', name: 'UNKOWN', brand: '', description: '', image: '', sku: '', category: '' };
}
