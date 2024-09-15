import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";

import { basicAxios } from "@/api/axios";
import SEOMetaTag from "@/components/SEOMetaTag";
import ProductHeader from "@/components/Header/ProductHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useChangePassword from "@/hooks/useChangePassword";
import useDeleteUser from "@/hooks/useDeleteUser";

import { Order } from "@/interface/order";
import { UserDetails } from "@/interface/userDetail";

function MyProfile() {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [selectedMenu, setSelectedMenu] = useState<string>("My Information");

  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const { userId } = useParams<{ userId: string }>();
  const deleteUser = useDeleteUser();
  const { changePassword, isLoading, error, success } = useChangePassword();

  const hasFetchedProfile = useRef(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (hasFetchedProfile.current) return;
      try {
        const response = await basicAxios.get("/users/profile");
        setUser(response.data.result);
        hasFetchedProfile.current = true;
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, [userId]);

  const fetchOrders = async () => {
    if (startDate && endDate) {
      try {
        const formattedStartDate = startDate.toISOString().split("T")[0];
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

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) {
      Swal.fire({
        icon: "warning",
        title: "입력 필요",
        text: "현재 비밀번호와 새 비밀번호를 모두 입력해주세요.",
      });
      return;
    }

    await changePassword({ currentPassword, newPassword });
  };

  const fetchPaymentDetails = async (paymentId: string) => {
    try {
      const response = await basicAxios.get(`/payments/${paymentId}`);
      const { result } = response.data;

      Swal.fire({
        title: "결제 상세 내역",
        html: `
          <p><strong>결제 ID</strong>: ${result.paymentId}</p>
          <p><strong>주문 ID</strong>: ${result.orderId}</p>
          <p><strong>결제 방법</strong>: ${result.payMethod}</p>
          <p><strong>상태</strong>: ${result.status}</p>
          <p><strong>결제 금액</strong>: ${result.amount} ${result.currency}</p>
          <p><strong>결제 완료 시간</strong>: ${new Date(
            result.paidAt * 1000
          ).toLocaleString()}</p>
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
          orderHistory.map((order) => (
            <div key={order.orderId} className="border p-4 mb-4">
              <p>
                <strong>주문 번호</strong>: {order.orderId}
              </p>
              <p>
                <strong>주문 상태</strong>: {order.orderStatus}
              </p>
              <p>
                <strong>결제 내역</strong> :{" "}
                <button
                  className="text-blue-500 underline"
                  onClick={() => fetchPaymentDetails(order.paymentId)}
                >
                  {order.paymentId}
                </button>
              </p>
              <div className="ml-4">
                <h4>주문 상품 목록:</h4>
                {order.orderItems.map((item, index) => (
                  <div key={item.orderItemId} className="mb-2">
                    <p>
                      <strong>{index + 1}. 상품명</strong>:{" "}
                      {item.orderProductName}
                    </p>
                    <p>
                      <strong>수량</strong>: {item.orderProductQuantity}
                    </p>
                    <p>
                      <strong>가격</strong>: {item.orderProductUnitPrice} 원
                    </p>
                  </div>
                ))}
                <p className="mt-4 text-2xl">
                  <strong>총 금액</strong>: {order.orderTotalPrice} 원
                </p>
              </div>
            </div>
          ))
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
                      <strong>성함</strong>: {user.userName}
                    </p>
                    <p>
                      <strong>생년월일</strong>: {user.userBirthDate}
                    </p>
                    <p>
                      <strong>아이디</strong>: {user.userId}
                    </p>
                    <p>
                      <strong>이메일</strong>: {user.userEmail}
                    </p>
                    <p>
                      <strong>권한</strong>: {user.userRole}
                    </p>
                  </div>
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
        <ProductHeader showBackspaseButton={true} showProductCart={true} />
        <SEOMetaTag
          title="For Dogs - MyProfile"
          description="구매자 프로필 페이지입니다."
        />
      </header>

      <main className="flex more-element mt-10">
        <nav className="fixed top-56 left-10 right-10 w-64 p-4 h-full ">
          <ul className="space-y-4">
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
        <div className="flex-grow p-4 ml-64">{renderContent()}</div>
      </main>
    </>
  );
}

export default MyProfile;
