import { useState } from "react";
import Swal from "sweetalert2";
import { AxiosError } from "axios";

import { basicAxios } from "@/api/axios";

interface ErrorResponse {
  message: string;
}

const useChangeOrderStatus = () => {
  const [isLoading, setIsLoading] = useState(false);

  const changeOrderStatus = async (
    orderId: string,
    data: { orderStatus: string }
  ) => {
    setIsLoading(true);
    try {
      await basicAxios.patch(`/orders/${orderId}/status`, data);

      Swal.fire({
        icon: "success",
        title: "변경 완료",
        text: "주문 상태가 성공적으로 변경되었습니다.",
        confirmButtonText: "확인",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      Swal.fire({
        icon: "error",
        title: "변경 실패",
        text:
          axiosError.response?.data?.message ||
          "알 수 없는 오류가 발생했습니다.",
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
