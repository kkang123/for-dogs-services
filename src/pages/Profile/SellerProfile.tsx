import { useState } from "react";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";

import { basicAxios } from "@/api/axios";
import SEOMetaTag from "@/components/SEOMetaTag";
import ProductHeader from "@/components/Header/ProductHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useUserProfile from "@/hooks/useUserProfile";
import useDeleteUser from "@/hooks/useDeleteUser";
import useChangePassword from "@/hooks/useChangePassword";
import useChangeOrderStatus from "@/hooks/useOrderStateChange";

import { Order } from "@/interface/order";

function SellerProfile() {
  const [selectedMenu, setSelectedMenu] = useState<string>("My Information");
  const { user, error: userProfileError } = useUserProfile();
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  const deleteUser = useDeleteUser();

  const { changePassword, isLoading, error, success } = useChangePassword();
  const { changeOrderStatus, isLoading: isChangingOrderStatus } =
    useChangeOrderStatus();

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

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const translatedStatus = orderStatusMap[newStatus];

    const result = await Swal.fire({
      title: "상태 변경 확인",
      text: `상태를 "${translatedStatus}"로 변경하시겠습니까?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#767d83",
      confirmButtonText: "예",
      cancelButtonText: "아니오",
    });

    if (result.isConfirmed) {
      await changeOrderStatus(orderId, { orderStatus: newStatus });
      setOrderHistory((prevHistory) =>
        prevHistory.map((o) =>
          o.orderId === orderId ? { ...o, orderStatus: newStatus } : o
        )
      );
    }
  };

  // 판매 내역 api
  const fetchOrders = async () => {
    if (startDate && endDate) {
      try {
        const formattedStartDate = startDate.toISOString().split("T")[0];

        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        const formattedEndDate = endDate.toISOString().split("T")[0];

        const response = await basicAxios.get(
          `/orders/seller?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
        );

        console.log("Fetched orders:", response.data.result);
        setOrderHistory(response.data.result);
      } catch (error) {
        console.error("Failed to fetch order history:", error);
      }
    }
  };

  // 판매 내역 조회
  const renderOrderHistory = () => {
    return (
      <div>
        <h2 className="text-4xl pb-4">판매 내역</h2>

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
          <p>판매 내역이 없습니다.</p>
        ) : (
          orderHistory.map((order) => {
            const statusOptions = [
              { value: "CONFIRMED", label: "구매 확인" },
              { value: "AWAITING_SHIPMENT", label: "배송 대기 중" },
              { value: "SHIPPED", label: "배송 중" },
              { value: "DELIVERED", label: "배송 완료" },
            ].filter((option) => option.value !== order.orderStatus);

            return (
              <div key={order.orderId} className="border p-4 mb-4">
                <p className="mb-4">
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
                  <strong>구매자 아이디</strong> : {order.buyerAccount}
                </p>
                <p>
                  <strong>주문 번호</strong> : {order.orderId}
                </p>
                <p>
                  <strong>주문 상태</strong> :{" "}
                  {orderStatusMap[order.orderStatus]}
                </p>

                <div className="my-4">
                  <label>
                    <strong>주문 상태 변경: </strong>
                  </label>
                  <Select
                    value={order.orderStatus || ""}
                    onValueChange={(newStatus) =>
                      handleStatusChange(order.orderId, newStatus)
                    }
                    disabled={isChangingOrderStatus}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue>
                        {order.orderStatus
                          ? orderStatusMap[order.orderStatus]
                          : "상태 선택"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="my-4">
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
                    <p>
                      <strong>생년월일</strong> : {user.userBirthDate}
                    </p>
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
        <ProductHeader showHomeButton={true} showProductManagement={true} />
        <SEOMetaTag
          title="For Dogs - MyProfile"
          description="판매자 프로필 페이지입니다."
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
                판매 내역
              </Button>
            </li>
            <li>
              <Button
                size={"lg"}
                onClick={() => setSelectedMenu("Change Password")}
              >
                비밀번호 변경
              </Button>
            </li>
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

      <footer></footer>
    </>
  );
}

export default SellerProfile;
