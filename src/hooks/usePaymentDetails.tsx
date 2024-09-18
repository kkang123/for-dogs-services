import Swal from "sweetalert2";
import { basicAxios } from "@/api/axios";

const usePaymentDetails = () => {
  const fetchPaymentDetails = async (paymentId: string) => {
    try {
      const response = await basicAxios.get(`/payments/${paymentId}`);
      const { result } = response.data;

      Swal.fire({
        title: "결제 상세 내역",
        html: `
          <p><strong>결제 ID</strong> : ${result.paymentId}</p>
          <p><strong>주문 ID</strong> : ${result.orderId}</p>
          <p><strong>결제 방법</strong> : ${result.payMethod}</p>
          <p><strong>상태</strong>: ${result.status}</p>
          <p><strong>결제 금액</strong> : ${result.amount} ${
          result.currency
        }</p>
         <p><strong>결제 완료 시간</strong> : ${new Date(
           result.paidAt * 1000
         ).toLocaleString("ko-KR", {
           year: "numeric",
           month: "long",
           day: "numeric",
           hour: "numeric",
           minute: "numeric",
           second: "numeric",
           hour12: true,
         })}</p>

          ${
            result.failReason
              ? `<p><strong>실패 이유</strong>: ${result.failReason}</p>`
              : ""
          }
          ${
            result.cancellationDetails
              ? `<p><strong>취소 내역</strong>: ${result.cancellationDetails}</p>`
              : ""
          }
        `,
        icon: "info",
      });
    } catch (error) {
      console.error("Failed to fetch payment details:", error);
      Swal.fire({
        icon: "error",
        title: "에러",
        text: "결제 상세 내역을 불러오는데 실패했습니다.",
      });
    }
  };

  return { fetchPaymentDetails };
};

export default usePaymentDetails;
