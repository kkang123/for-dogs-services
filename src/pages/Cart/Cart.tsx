import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { basicAxios } from "@/api/axios";

import CartItem from "@/pages/Cart/CartItem";
import { CartItem as CartItemType } from "@/interface/cart";
import { CartProduct } from "@/interface/cartproduct";
import { useRecoilState } from "recoil";
import { cartState } from "@/recoil/cartState";
import SEOMetaTag from "@/components/SEOMetaTag";
import MainHeader from "@/components/Header/MainHeader";
import { Button } from "@/components/ui/button";

const Cart = () => {
  const [cart, setCart] = useRecoilState<CartItemType[]>(cartState);
  const [isEditing, setIsEditing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        if (user && user.userId) {
          setUserId(user.userId);
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchCartItemsData = async () => {
        try {
          const response = await basicAxios.get(`/carts?userId=${userId}`);
          if (response.status === 200) {
            const data = response.data;
            console.log("Fetched cart items data:", data);

            if (Array.isArray(data.result) && data.result.length > 0) {
              setCart(
                data.result.map((item: CartProduct) => ({
                  product: item,
                  quantity: item.cartProductQuantity,
                })) as CartItemType[]
              );
            }
          } else {
            throw new Error("Failed to fetch cart items");
          }
        } catch (error) {
          console.error("Error fetching cart items:", error);
        }
      };

      fetchCartItemsData();
    }
  }, [userId, setCart]);

  const updateQuantity = (
    productId: string | undefined,
    newQuantity: number
  ) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.cartProductId === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: string | undefined) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.cartProductId !== productId)
    );
  };

  const goToPayment = () => {
    navigate("/pay");
  };

  const saveChanges = async () => {
    console.log("Changes saved.");
    setIsEditing(false);
  };

  return (
    <>
      <header className="h-[78px]">
        <MainHeader />
        <SEOMetaTag
          title="For Dogs - Cart"
          description="장바구니 페이지입니다."
        />
      </header>
      <main className="mt-36">
        <div className="flex flex-col">
          {cart.length === 0 ? (
            <div className="mt-10 flex justify-center mb-10">
              <div className="flex flex-col">
                <p>장바구니가 비어있습니다</p>
                {isEditing && (
                  <Button
                    className="flex justify-center mt-5"
                    onClick={saveChanges}
                  >
                    완료
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4 items-center justify-items-center">
                {cart.map((item: CartItemType, index: number) => {
                  if (!item || !item.product || !item.product.cartProductId) {
                    console.error(`Invalid cart item at index ${index}:`, item);
                    return null;
                  }

                  return (
                    <div
                      key={`${item.product.cartProductId}-${index}`}
                      className="p-4 shadow border-2 rounded w-[230px] h-[380px]"
                    >
                      <CartItem
                        key={item.product.cartProductId}
                        item={item}
                        cartId={item.product.cartId} // cartId를 하위 컴포넌트로 전달
                        updateQuantity={isEditing ? updateQuantity : undefined}
                        removeFromCart={isEditing ? removeFromCart : undefined}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="mt-10 flex justify-center mb-10">
                {!isEditing ? (
                  <div className="w-full flex justify-evenly">
                    <Button onClick={() => setIsEditing(true)}>수정</Button>
                    <Button onClick={goToPayment}>결제</Button>
                  </div>
                ) : (
                  <Button onClick={saveChanges}>완료</Button>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default Cart;
