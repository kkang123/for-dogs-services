import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { basicAxios } from "@/api/axios";
import { CartItem as CartItemType } from "@/interface/cart";
import { Button } from "@/components/ui/button";

interface CartItemProps {
  item: CartItemType;
  cartId: string;
  updateQuantity?: (
    productId: string | undefined,
    newQuantity: number,
    cartId: string
  ) => void;
  removeFromCart?: (productId: string | undefined, cartId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  cartId,
  updateQuantity,
  removeFromCart,
}) => {
  const { product } = item;

  const [currentQuantity, setCurrentQuantity] = useState<number>(
    product.cartProductQuantity
  );

  useEffect(() => {
    setCurrentQuantity(product.cartProductQuantity);
  }, [product.cartProductQuantity]);

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 0) return;

    try {
      await basicAxios.patch(`/carts/${cartId}`, {
        productId: product.cartProductId,
        productQuantity: newQuantity,
      });
      if (updateQuantity) {
        updateQuantity(product.cartProductId, newQuantity, cartId);
      }
      setCurrentQuantity(newQuantity);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const handleRemoveFromCart = async () => {
    try {
      await basicAxios.delete(`/carts/${cartId}`);
      if (removeFromCart) {
        removeFromCart(product.cartProductId, cartId);
      }
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    }
  };

  return (
    <div className="w-48 h-48">
      <Link to={`/sellproduct/${product.cartProductId}`}>
        <img
          className="w-48 h-48"
          src={product.cartProductImages[0]}
          alt={product.cartProductName}
        />
        <div className="mt-2">
          <p className="overflow-hidden text-ellipsis whitespace-nowrap">
            상품 이름 : {product.cartProductName}
          </p>
          <p>상품 가격 : {product.cartProductPrice}</p>
          <p>수량 : {currentQuantity}</p>
        </div>
      </Link>
      {updateQuantity && removeFromCart && (
        <>
          <div className="flex justify-between">
            <Button
              size="sm"
              onClick={() => handleUpdateQuantity(currentQuantity + 1)}
            >
              갯수 증가
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (currentQuantity > 0) {
                  handleUpdateQuantity(currentQuantity - 1);
                }
              }}
            >
              갯수 감소
            </Button>
          </div>

          <div className="flex justify-center mt-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRemoveFromCart}
            >
              삭제
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartItem;
