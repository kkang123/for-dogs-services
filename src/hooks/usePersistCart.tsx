import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { cartState } from "@/recoil/cartState";

export default function usePersistCart() {
  const [cart, setCart] = useRecoilState(cartState);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, [setCart]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
}
