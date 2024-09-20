import { useState } from "react";
import Swal from "sweetalert2";

import { basicAxios } from "@/api/axios";

const useChangeOrderStatus = () => {
  const [isLoading, setIsLoading] = useState(false);

  const changeOrderStatus = async (orderId: number, newStatus: string) => {
    setIsLoading(true);
    try {
      await basicAxios.patch(`/orders/${orderId}/status`, {
        status: newStatus,
      });

      Swal.fire({
        icon: "success",
        title: "변경 완료",
        text: "주문 상태가 성공적으로 변경되었습니다.",
        confirmButtonText: "확인",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    changeOrderStatus,
    isLoading,
  };
};

export default useChangeOrderStatus;
