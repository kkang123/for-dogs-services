export interface Product {
  productId?: string;
  productSeller?: string;
  productName: string;
  productPrice: number;
  productQuantity: number;
  productDescription: string;
  productImages: string[];
  productCategory:
    | "FOOD"
    | "CLOTHING"
    | "SNACK"
    | "TOY"
    | "ACCESSORY"
    | "SUPPLEMENT"
    | "NONE";
}
