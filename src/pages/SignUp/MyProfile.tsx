import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { basicAxios } from "@/api/axios";

// import { Button } from "@/components/ui/button";

// import { Order } from "@/interface/order";
import { User } from "@/interface/user";

import SEOMetaTag from "@/components/SEOMetaTag";
import ProductHeader from "@/components/Header/ProductHeader";

function MyProfile() {
  const [user, setUser] = useState<User | null>(null);

  const { userId } = useParams<{ userId: string }>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await basicAxios.get(
          `/users/details?userId=${userId}`
        );
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, [userId]);

  return (
    <>
      <header className="h-20">
        <ProductHeader showBackspaseButton={true} showProductCart={true} />
        <SEOMetaTag
          title="For Dogs - MyProfile"
          description="구매자 프로필 페이지입니다."
        />
      </header>
      <main className="mt-16 ">
        <h1 className="text-4xl">안녕하세요. {user?.userName}님</h1>
        <hr />
        <h2 className="text-3xl p-2 mt-4">구매 내역</h2>
        {/* <div className="flex-col ">
          {Object.entries(groupedOrders).map(([groupid, orders]) => {
            const totalAmount = orders.reduce(
              (sum, order) =>
                sum + (order.status === "주문 취소" ? 0 : order.amount),
              0
            );
            return (
              <div
                key={groupid}
                className="flex gap-2 justify-around m-2 p-2 border-2 rounded"
              >
                <div className="flex items-center ">
                  구매 날짜 : {orders[0].timestamp.toDate().toLocaleString()}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  {orders.map((order) => (
                    <div key={order.id} className=" p-2">
                      <div>주문 번호 : {order.id}</div>
                      <div>상품 이름 : {order.item.product.productName}</div>
                      <div>상품 갯수 : {order.item.quantity}</div>
                      <div>
                        판매자 :
                        {users.find(
                          (user) => user.uid === order.item.product.sellerId
                        )?.nickname || "알 수 없음"}
                      </div>
                      <div>상품 가격: {order.item.product.productPrice}</div>
                      <div>주문 상태 : {order.status}</div>
                      <div>전체 가격 : {order.amount}</div>
                      {order.status === "결제 완료" && (
                        <Button size="sm" onClick={() => cancelOrder(order.id)}>
                          주문 취소
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex items-center">
                  총 결제 가격 : {totalAmount}원
                </div>
              </div>
            );
          })}
        </div> */}
      </main>
      <footer></footer>
    </>
  );
}

export default MyProfile;
