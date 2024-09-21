import { CartProduct } from "./cartproduct";

export interface CartItem {
  product: CartProduct;
  quantity: number;
}
