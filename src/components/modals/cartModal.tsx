import { useRecoilValue } from "recoil";

import { cartState } from "@/recoil/cartState";

interface CartModalProps {
  isOpen: boolean;
  toggleModal: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, toggleModal }) => {
  const cart = useRecoilValue(cartState);

  if (!isOpen) return null;

  // 총 가격
  const total = cart.reduce((sum, cartItem) => {
    const price = cartItem.product.cartProductPrice || 0;
    return sum + price * cartItem.quantity;
  }, 0);

  return (
    <div
      onClick={toggleModal}
      className="z-50 fixed right-0 top-0 bottom-0 flex justify-end "
    >
      <div
        className={`flex flex-col items-center transform transition-transform duration-1000 ease-in-out ${
          isOpen ? "" : ""
        } shadow-2xl p-2 inline-block bg-white h-full overflow-auto`}
        style={{
          width: "400px",
          transform: isOpen ? "translateX(0)" : "translateX(400px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {cart.map((cartItem) => (
          <div
            key={cartItem.product.cartProductId}
            className="bg-white border-b-2 w-full flex flex-col items-center mt-4"
          >
            <img
              className="w-48 h-48"
              src={cartItem.product.cartProductImages[0]}
              alt={cartItem.product.cartProductName}
            />

            <h2>상품 이름 : {cartItem.product.cartProductName}</h2>
            <p>개당 가격 : {cartItem.product.cartProductPrice}</p>
            <p>수량 : {cartItem.quantity}</p>
          </div>
        ))}
        <p className="mt-2">총 가격: {total}원</p>
      </div>
    </div>
  );
};

export default CartModal;
