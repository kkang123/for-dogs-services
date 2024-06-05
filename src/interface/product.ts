import { Timestamp, FieldValue } from "firebase/firestore";

export interface Product {
  id: number;
  sellerId: string;
  productName: string;
  productPrice: number | null;
  productQuantity: number | null;
  productDescription: string;
  productCategory: string;
  productImage: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp | FieldValue;
}

// export interface Product {
//   description: string; // 상품 설명
//   productName: string; // 상품명
//   productPrice: number; // 상품 가격
//   productQuantity: number; // 상품 수량
//   productDescription: string; // 상품 설명
//   productImages: string[]; // 상품 이미지 배열
//   productCategory:
//     | "FOOD"
//     | "CLOTHING"
//     | "SNACK"
//     | "TOY"
//     | "ACCESSORY"
//     | "SUPPLEMENT"
//     | "NONE"; // 상품 카테고리
// }
