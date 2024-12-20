import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AxiosError } from "axios";
import Swal from "sweetalert2";

import { basicAxios } from "@/api/axios";
import SEOMetaTag from "@/components/SEOMetaTag";
import ProductHeader from "@/components/Header/ProductHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useUserProfile from "@/hooks/useUserProfile";
import useChangePassword from "@/hooks/useChangePassword";
import useDeleteUser from "@/hooks/useDeleteUser";
import usePaymentDetails from "@/hooks/usePaymentDetails";

import { Order } from "@/interface/order";

interface ErrorResponse {
  error: {
    message: string;
  };
}

function MyProfile() {
  const [selectedMenu, setSelectedMenu] = useState<string>("My Information");
  const { user, error: userProfileError } = useUserProfile();
  const [provider, setProvider] = useState<string | null>(null);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  const deleteUser = useDeleteUser();
  const { fetchPaymentDetails } = usePaymentDetails();
  const { changePassword, isLoading, error, success } = useChangePassword();

  // 로컬 스토리지에서 로그인 값 가져와서 상태로 관리
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setProvider(user.provider);
    }
  }, []);

  // 주문 내역 조회 api
  const fetchOrders = async () => {
    if (startDate && endDate) {
      try {
        const formattedStartDate = startDate.toISOString().split("T")[0];

        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        const formattedEndDate = endDate.toISOString().split("T")[0];

        const response = await basicAxios.get(
          `/orders/buyer?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
        );

        console.log("Fetched orders:", response.data.result);
        setOrderHistory(response.data.result);
      } catch (error) {
        console.error("Failed to fetch order history:", error);
      }
    }
  };

  // 주문 취소 api
  const cancelOrders = async (orderId: string) => {
    // 취소 사유
    const cancelReasons = [
      "단순변심으로 인한 환불입니다.",
      "사이즈가 오류로 인한 환불입니다.",
      "상품 불량으로 인한 환불입니다.",
      "오배송으로 인한 환불입니다.",
      "사이즈 불량으로 인한 환불입니다.",
    ];

    try {
      const { value: selectedReason } = await Swal.fire({
        title: "주문 취소 사유 선택",
        input: "select",
        inputOptions: cancelReasons,
        inputValidator: (value) => {
          if (!value) {
            return "취소 사유를 선택해주세요!";
          }
        },
        showCancelButton: true,
        confirmButtonText: "주문 취소",
        confirmButtonColor: "#3085d6",
        cancelButtonText: "취소",
        cancelButtonColor: "#5b656e",
      });

      if (selectedReason !== undefined) {
        const cancelRequestBody = {
          cancelReason: cancelReasons[selectedReason],
        };

        const response = await basicAxios.post(
          `/orders/${orderId}/cancel`,
          cancelRequestBody
        );

        if (response.status === 204) {
          Swal.fire({
            icon: "success",
            title: "주문 취소 완료",
            text: "주문이 성공적으로 취소되었습니다.",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "확인",
          });
          fetchOrders();
        } else {
          Swal.fire({
            icon: "error",
            title: "취소 실패",
            text: "주문을 취소하는 중 문제가 발생했습니다.",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "확인",
          });
        }
      }
    } catch (error: unknown) {
      console.error("Failed to cancel order:", error);

      const axiosError = error as AxiosError<ErrorResponse>;

      const errorMessage =
        axiosError.response?.data?.error?.message ||
        "주문을 취소할 수 없습니다.";

      Swal.fire({
        icon: "error",
        title: "취소 실패",
        text: errorMessage,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "확인",
      });
    }
  };

  // 비밀번호 수정
  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) {
      Swal.fire({
        icon: "warning",
        title: "입력 필요",
        text: "현재 비밀번호와 새 비밀번호를 모두 입력해주세요.",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "확인",
      });
      return;
    }

    await changePassword({ currentPassword, newPassword });
  };

  // 결제 상태
  const orderStatusMap: { [key: string]: string } = {
    AWAITING_PAYMENT: "결제 대기 중",
    PAID: "결제 완료",
    PAYMENT_FAILED: "결제 오류",
    CONFIRMED: "구매 확인",
    AWAITING_SHIPMENT: "배송 대기 중",
    SHIPPED: "배송 중",
    DELIVERED: "배송 완료",
    CANCELLED: "주문 취소",
  };

  // 결제 상세 내역
  const renderOrderHistory = () => {
    return (
      <div>
        <h2 className="text-4xl pb-4">구매 내역</h2>

        <div className="flex space-x-4 pb-4">
          <div className="border border-gray-300 rounded-lg p-2 shadow-lg">
            <label>시작 날짜: </label>
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
            />
          </div>
          <div className="border border-gray-300 rounded-lg p-2 shadow-lg">
            <label>종료 날짜: </label>
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => setEndDate(date)}
              dateFormat="yyyy-MM-dd"
            />
          </div>
          <Button onClick={fetchOrders}>구매 내역 조회</Button>
        </div>

        {orderHistory.length === 0 ? (
          <p>구매 내역이 없습니다.</p>
        ) : (
          orderHistory.map((order) => {
            const showCancelButton = !(
              order.orderStatus === "CANCELLED" ||
              order.orderStatus === "AWAITING_PAYMENT"
            );

            return (
              <div key={order.orderId} className="border p-4 mb-4">
                <p>
                  <strong>주문 날짜</strong> :{" "}
                  {new Date(order.orderDate).toLocaleString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    hour12: true,
                  })}
                </p>

                <p>
                  <strong>주문 번호</strong> : {order.orderId}
                </p>
                <p>
                  <strong>주문 상태</strong> :{" "}
                  {orderStatusMap[order.orderStatus]}
                </p>
                <p>
                  <strong>결제 내역</strong> :{" "}
                  <button
                    className="text-blue-500 underline"
                    onClick={() => {
                      if (order.paymentId) {
                        fetchPaymentDetails(order.paymentId);
                      }
                    }}
                  >
                    {order.paymentId}
                  </button>
                </p>
                <div className="ml-4">
                  <h4>주문 상품 목록:</h4>
                  {order.orderItems.map((item, index) => (
                    <div key={item.orderItemId} className="mb-2">
                      <p>
                        <strong>{index + 1}. 상품명</strong> :{" "}
                        {item.orderProductName}
                      </p>
                      <p>
                        <strong>수량</strong> : {item.orderProductQuantity}
                      </p>
                      <p>
                        <strong>가격</strong> : {item.orderProductUnitPrice} 원
                      </p>
                    </div>
                  ))}
                  <p className="mt-4 text-2xl">
                    <strong>총 금액</strong> : {order.orderTotalPrice} 원
                  </p>
                  {showCancelButton && (
                    <Button
                      className="mt-4"
                      onClick={() => cancelOrders(order.orderId)}
                    >
                      주문 취소
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "My Information":
        return (
          <div>
            <h1 className="text-4xl pb-4">나의 정보</h1>
            <Card className="m-10 border rounded-lg shadow-lg w-[500px] ">
              <CardContent>
                {user ? (
                  <div className="space-y-4 m-4 p-4 ">
                    <p>
                      <strong>성함</strong> : {user.userName}
                    </p>

                    {provider === "LOCAL" && (
                      <p>
                        <strong>생년월일</strong> : {user.userBirthDate}
                      </p>
                    )}

                    {provider === "GOOGLE" && (
                      <p>
                        <strong>로그인 유형</strong> : GOOGLE
                      </p>
                    )}
                    {provider === "KAKAO" && (
                      <p>
                        <strong>로그인 유형</strong> : KAKAO
                      </p>
                    )}

                    <p>
                      <strong>아이디</strong> : {user.userId}
                    </p>
                    <p>
                      <strong>이메일</strong> : {user.userEmail}
                    </p>
                    <p>
                      <strong>권한</strong> : {user.userRole}
                    </p>
                  </div>
                ) : userProfileError ? (
                  <p>{userProfileError}</p>
                ) : (
                  <p>회원 정보를 불러오고 있는 중입니다.</p>
                )}
              </CardContent>
            </Card>
          </div>
        );
      case "Purchase History":
        return renderOrderHistory();
      case "Change Password":
        return (
          <div>
            <h2 className="text-4xl">비밀번호 수정</h2>
            <input
              type="password"
              placeholder="현재 비밀번호"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="border p-2 mt-2"
            />
            <input
              type="password"
              placeholder="새 비밀번호"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border p-2 m-2"
            />
            <Button onClick={handlePasswordChange} disabled={isLoading}>
              비밀번호 변경하기
            </Button>
            {error && <p className="text-red-500">{error}</p>}
            {success && (
              <p className="text-green-500">비밀번호가 변경되었습니다.</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <header className="h-20">
        <ProductHeader showHomeButton={true} showProductCart={true} />
        <SEOMetaTag
          title="For Dogs - MyProfile"
          description="구매자 프로필 페이지입니다."
        />
      </header>

      <main className="flex mt-10">
        <nav className="fixed top-44 left-2 w-64 h-[calc(100vh-14rem)] p-1 z-10">
          <ul className="space-y-3">
            <li>
              <Button
                size={"lg"}
                onClick={() => setSelectedMenu("My Information")}
              >
                나의 정보
              </Button>
            </li>
            <li>
              <Button
                size={"lg"}
                onClick={() => setSelectedMenu("Purchase History")}
              >
                구매 내역
              </Button>
            </li>
            {provider === "LOCAL" && (
              <li>
                <Button
                  size={"lg"}
                  onClick={() => setSelectedMenu("Change Password")}
                >
                  비밀번호 변경
                </Button>
              </li>
            )}
            <li>
              <Button size={"lg"} className="lx" onClick={deleteUser}>
                탈퇴하기
              </Button>
            </li>
          </ul>
        </nav>
        <div className="flex-grow ml-64 p-4 overflow-x-auto">
          {renderContent()}
        </div>
      </main>
    </>
  );
}

export default MyProfile;
