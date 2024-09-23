import Swal from "sweetalert2";

import { basicAxios } from "@/api/axios";

const usePaymentDetails = () => {
  const fetchPaymentDetails = async (paymentId: string) => {
    try {
      const response = await basicAxios.get(`/payments/${paymentId}`);
      const { result } = response.data;

      const cancellationHtml = result.cancellationDetails
        ? `
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <p><strong>취소 ID</strong>: ${
              result.cancellationDetails.cancellationId
            }</p>
            <p><strong>취소 금액</strong>: ${
              result.cancellationDetails.cancellationAmount
            } ${result.currency}</p>
            <p><strong>취소 이유</strong>: ${
              result.cancellationDetails.cancellationReason
            }</p>
            <p><strong>취소 시간</strong>: ${new Date(
              result.cancellationDetails.cancellationAt * 1000
            ).toLocaleString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
              hour12: true,
            })}</p>
            <p><a href="${
              result.cancellationDetails.cancellationReceiptUrl
            }" target="_blank" class=" text-blue-500 hover:underline">취소 영수증 보기</a></p>
          </div>
        `
        : "";

      Swal.fire({
        title: "결제 상세 내역",
        html: `
          <div class="${result.status === "cancelled" ? "text-gray-500" : ""}">
            <p><strong>결제 ID</strong> : ${result.paymentId}</p>
            <p><strong>주문 ID</strong> : ${result.orderId}</p>
            <p><strong>결제 방법</strong> : ${result.payMethod}</p>
            ${
              result.status !== "cancelled"
                ? `<p><strong>결제 금액</strong> : ${result.amount} ${result.currency}</p>`
                : ""
            }
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
            ${cancellationHtml}
          </div>
        `,
        icon: "info",
        customClass: {
          popup: "rounded-lg shadow-lg border border-gray-300",
        },
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
