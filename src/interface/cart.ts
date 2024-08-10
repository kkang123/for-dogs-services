// import { Product } from "./product";

// export interface CartItem {
//   product: Product;
//   quantity: number;
// }

import { CartProduct } from "./cartproduct";

export interface CartItem {
  product: CartProduct;
  quantity: number;
}
