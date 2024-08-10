export interface CartProduct {
  cartId: string;
  cartProductId: string;
  cartProductName: string;
  cartProductPrice: number;
  cartProductQuantity: number;
  cartProductImages: string[];
  available: boolean;
}
