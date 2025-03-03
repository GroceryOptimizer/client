import { Product } from '~models';

export interface StockItem {
    product: Product;
    price: number;
    quantity: number;
}
