import { useCallback } from "react";
import { basicAxios } from "@/api/axios";

const useRemoveCart = () => {
  const removeFromCart = useCallback(async (cartId: string) => {
    try {
      await basicAxios.delete(`/carts/${cartId}`);
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    }
  }, []);

  return removeFromCart;
};

export default useRemoveCart;
