import { useCallback } from "react";
import Swal from "sweetalert2";

import { basicAxios } from "@/api/axios";

const useUpdateCart = () => {
  const updateCart = useCallback(
    async (cartId: string, productId: string, productQuantity: number) => {
      try {
        if (productQuantity > 0) {
          await basicAxios.patch(`/carts/${cartId}`, {
            productId,
            productQuantity,
          });
        } else {
          Swal.fire({
            icon: "warning",
            title: " 수량 오류",
            text: "수량은 1 이하로 내려갈 수 없습니다.",
            confirmButtonText: "확인",
          });
        }
      } catch (error) {
        console.error("Failed to update cart quantity:", error);
        throw error;
      }
    },
    []
  );

  return updateCart;
};

export default useUpdateCart;
