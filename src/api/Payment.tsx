import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { basicAxios } from "./axios";
import useRemoveCart from "@/hooks/useRemoveCart";
import { isLoggedInState, userState } from "@/recoil/userState";
import { useRecoilState, useRecoilValue } from "recoil";
import { cartState } from "@/recoil/cartState";
import SEOMetaTag from "@/components/SEOMetaTag";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/interface/cart";

interface PaymentData {
  pg: string;
  pay_method: string;
  merchant_uid: string;
  amount: number;
  name: string;
  buyer_name: string;
  buyer_tel: string;
  buyer_email: string;
  buyer_addr: string;
  buyer_postcode: string;
}

interface PaymentResponse {
  success: boolean;
  imp_uid?: string;
  merchant_uid?: string;
  error_msg?: string;
}

interface DaumPostcodeData {
  address: string;
  zonecode: string;
}

interface IMP {
  init: (key: string) => void;
  request_pay: (
    data: PaymentData,
    callback: (response: PaymentResponse) => void
  ) => void;
}

interface DaumPostcode {
  open: () => void;
}

interface Daum {
  postcode: {
    load: (callback: () => void) => void;
  };
  Postcode: new (options: {
    oncomplete: (data: DaumPostcodeData) => void;
  }) => DaumPostcode;
}

declare global {
  interface Window {
    IMP: IMP;
    daum: Daum;
  }
}

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const user = useRecoilValue(userState);

  const [cart, setCart] = useRecoilState<CartItem[]>(cartState);
  const removeFromCart = useRemoveCart();

  const resetCart = useCallback(() => {
    setCart([]);
  }, [setCart]);

  const [buyerInfo, setBuyerInfo] = useState({
    name: user.userId || "",
    tel: "",
    email: "",
    addr: "",
    postcode: "",
  });

  useEffect(() => {
    setBuyerInfo((prev) => ({ ...prev, name: user.userId || "" }));
  }, [user.userId]);

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://cdn.iamport.kr/v1/iamport.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const openPostcode = useCallback(() => {
    window.daum.postcode.load(function () {
      new window.daum.Postcode({
        oncomplete: function (data: DaumPostcodeData) {
          setBuyerInfo((prev) => ({
            ...prev,
            addr: data.address,
            postcode: data.zonecode,
          }));
        },
      }).open();
    });
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setBuyerInfo({
        ...buyerInfo,
        [e.target.name]: e.target.value,
      });
    },
    [buyerInfo]
  );

  // 주문 등록 API 호출 후, orderId를 결제에 사용
  const createOrder = useCallback(async () => {
    try {
      const orderData = {
        orderItems: cart.map((item) => ({
          orderProductId: item.product.cartProductId,
          orderQuantity: item.quantity,
          orderUnitPrice: item.product.cartProductPrice,
        })),
      };

      console.log("Order request body:", orderData);

      const response = await basicAxios.post("/orders", orderData);

      if (!response.data.ok) {
        const errorMessage = response.data.error.message;
        if (errorMessage === "상품 재고가 부족합니다.") {
          Swal.fire("재고 부족", "선택한 상품의 재고가 부족합니다.", "error");
          return null;
        }
      }

      return response.data.result.orderId;
    } catch (error) {
      console.error("주문 등록 중 오류 발생:", error);
      Swal.fire("주문 등록 실패", "다시 시도해주세요.", "error");
      throw error;
    }
  }, [cart]);

  // 결제 등록 API 호출 함수
  const registerPayment = useCallback(
    async (impUid: string, merchantUid: string) => {
      try {
        console.log("Registering payment with:", { impUid, merchantUid });
        const response = await basicAxios.post("/payments", {
          impUid: impUid,
          merchantUid: merchantUid,
        });
        return response.data;
      } catch (error) {
        console.error("결제 등록 중 오류 발생:", error);
        Swal.fire(
          "결제 등록 실패",
          "결제 정보를 저장하는데 실패했습니다.",
          "error"
        );
        throw error;
      }
    },
    []
  );

  // 결제 처리 로직
  const onClickPayment = useCallback(async () => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: "warning",
        title: "로그인이 필요합니다.",
        text: "결제를 진행하려면 먼저 로그인하세요.",
      });
      return;
    }

    try {
      const orderId = await createOrder();
      if (!orderId) return;

      const { IMP } = window;
      IMP?.init(import.meta.env.VITE_APP_IMP_KEY);

      const amount = cart.reduce(
        (total, item) => total + item.product.cartProductPrice * item.quantity,
        0
      );

      const name = cart.map((item) => item.product.cartProductName).join(", ");

      const data = {
        pg: "nice",
        pay_method: "card",
        merchant_uid: orderId, // 주문 등록 API에서 받은 orderId를 merchant_uid로 사용
        amount,
        name,
        buyer_name: buyerInfo.name,
        buyer_tel: buyerInfo.tel,
        buyer_email: buyerInfo.email,
        buyer_addr: buyerInfo.addr,
        buyer_postcode: buyerInfo.postcode,
      };

      IMP?.request_pay(data, async (response: PaymentResponse) => {
        console.log("Payment response:", response);
        if (response.success) {
          try {
            // 결제 등록 API 호출
            await registerPayment(response.imp_uid!, response.merchant_uid!);

            await Promise.all(
              cart.map(async (item) => {
                await removeFromCart(item.product.cartId); // cartId로 삭제 호출
              })
            );

            Swal.fire("결제 성공", "주문이 완료되었습니다.", "success").then(
              () => {
                resetCart();
                console.log("장바구니 초기화", resetCart);
                navigate("/");
              }
            );
          } catch (error) {
            console.error("결제 정보 저장 실패:", error);
          }
        } else {
          Swal.fire("결제 실패", `오류 메시지: ${response.error_msg}`, "error");
        }
      });
    } catch (error) {
      console.error("결제 진행 중 오류 발생:", error);
    }
  }, [
    buyerInfo,
    cart,
    createOrder,
    registerPayment,
    navigate,
    isLoggedIn,
    resetCart,
    removeFromCart,
  ]);

  return (
    <>
      <header>
        <SEOMetaTag
          title="For Dogs - Pay"
          description="결제 진행 페이지입니다."
        />
      </header>
      <main>
        <div className="flex justify-center mt-20">
          <div className="flex flex-col gap-2 w-1/2">
            <div>{buyerInfo.name}</div>
            <input
              type="tel"
              name="tel"
              value={buyerInfo.tel}
              onChange={handleChange}
              placeholder="전화번호"
            />
            <input
              type="email"
              name="email"
              value={buyerInfo.email}
              onChange={handleChange}
              placeholder="이메일"
            />

            <button
              className="hover:bg-gray-200"
              type="button"
              onClick={openPostcode}
            >
              주소 검색
            </button>

            <input
              type="text"
              name="addr"
              value={buyerInfo.addr}
              onChange={handleChange}
              placeholder="주소"
            />

            <input
              type="text"
              name="postcode"
              value={buyerInfo.postcode}
              onChange={handleChange}
              placeholder="우편번호"
            />
            <Button size="sm" onClick={onClickPayment}>
              결제하기
            </Button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Payment;
