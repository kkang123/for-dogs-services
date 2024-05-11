import { atom } from "recoil";
import { CartItem } from "@/interface/cart";

export const cartState = atom<CartItem[]>({
  key: "cartState", // 고유한 key 값
  default: [], // 기본값
});
