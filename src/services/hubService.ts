import { CartItem, ShoppingCartDTO } from "~models";


export async function postCart(cart: CartItem[]) {

    const shoppingCart: ShoppingCartDTO = {
        cart: cart.map(x => ({
            name: x.product.name
        }))
    }
}