import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { cartState } from "@/recoil/cartState";

// 장바구니 상태를 localStorage에 저장하고 불러오는 훅
export default function usePersistCart() {
  const [cart, setCart] = useRecoilState(cartState);

  // 애플리케이션이 로드될 때 localStorage에서 장바구니 상태를 불러옵니다.
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, [setCart]);

  // 장바구니 상태가 변경될 때마다 이를 localStorage에 저장합니다.
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
}
