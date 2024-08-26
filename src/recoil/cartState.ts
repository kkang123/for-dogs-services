import { atom } from "recoil";
import { CartItem as CartItemType } from "@/interface/cart";

const loadCartFromLocalStorage = (): CartItemType[] => {
  const storedCart = localStorage.getItem("cart");
  if (storedCart) {
    try {
      return JSON.parse(storedCart) as CartItemType[];
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      return [];
    }
  }
  return [];
};

const saveCartToLocalStorage = (cart: CartItemType[]) => {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (error) {
    console.error("Failed to save cart to localStorage", error);
  }
};

export const cartState = atom<CartItemType[]>({
  key: "cartState",
  default: loadCartFromLocalStorage(),
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet((newCart) => {
        saveCartToLocalStorage(newCart);
      });
    },
  ],
});
