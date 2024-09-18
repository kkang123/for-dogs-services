import { useCallback } from "react";
import { basicAxios } from "@/api/axios";

const useRemoveCart = () => {
  const removeFromCart = useCallback(async (cartId: string) => {
    try {
      await basicAxios.delete(`/carts/${cartId}`);
    } catch (error) {
      console.error("장바구니에서 항목을 제거하는 데 실패했습니다.:", error);
    }
  }, []);

  return removeFromCart;
};

export default useRemoveCart;
