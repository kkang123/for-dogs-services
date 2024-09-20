import { FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useRecoilState, useRecoilValue } from "recoil";
import { userState, isLoggedInState } from "@/recoil/userState";
import { cartState } from "@/recoil/cartState";

import { useLogout } from "@/hooks/useLogout";
import useAuth from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";

import mainlogo from "@/assets/main-logo.svg";
import basket from "@/assets/basket-buy-cart.svg";
import backspace from "@/assets/icon-back-arrow.svg";

interface ProductHeaderProps {
  showEditButton?: boolean;
  showDeleteButton?: boolean;
  showHomeButton?: boolean;
  showBackspaseButton?: boolean;
  showUploadButton?: boolean;
  showPageBackSpaceButton?: boolean;
  showProductManagement?: boolean;
  showProductCart?: boolean;
  showSellerProfileButton?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
  onBackspaceClick?: () => void;
  onSellerProfile?: () => void;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({
  showEditButton = false,
  showDeleteButton = false,
  showHomeButton = false,
  showUploadButton = false,
  showPageBackSpaceButton = false,
  showProductManagement = false,
  showProductCart = false,
  showSellerProfileButton = false,
  onDelete,
  onEdit,
  onSellerProfile,
}) => {
  const { logout } = useLogout();

  const navigate = useNavigate();

  const user = useRecoilValue(userState);
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const { isLoggedIn: authIsLoggedIn } = useAuth();

  const [cart, setCart] = useRecoilState(cartState);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, [setCart]);

  const uniqueProductCount = new Set(
    cart.map((item) => item.product.cartProductId)
  ).size;

  const handleLogout = (event: React.FormEvent) => {
    event.preventDefault();
    logout();
    navigate("/");
  };

  const Login = (event: FormEvent) => {
    event.preventDefault();
    navigate("/login");
  };

  const Home = (event: FormEvent) => {
    event.preventDefault();
    navigate("/");
  };

  const Upload = (event: FormEvent) => {
    event.preventDefault();
    navigate("/productupload");
  };
  const Management = (event: FormEvent) => {
    event.preventDefault();
    navigate("/productlist/${uid}");
  };

  const PageBackSpaceButton = (event: FormEvent) => {
    event.preventDefault();
    navigate(-1);
  };

  return (
    <>
      <div className="fixed px-5 py-5 top-0 left-0 right-0 flex  w-full justify-between shadow-lg  bg-white z-50 h-20">
        {showHomeButton && (
          <button className="" onClick={Home}>
            <img src={mainlogo} alt="main-logo" className="w-9  " />
          </button>
        )}
        {showPageBackSpaceButton && (
          <button className="" onClick={PageBackSpaceButton}>
            <img src={backspace} alt="" />
          </button>
        )}

        <div className="flex">
          {showProductManagement && (
            <Button variant="ghost" size="sm" onClick={Management}>
              판매 상품 관리
            </Button>
          )}
          {showUploadButton && (
            <Button variant="ghost" size="sm" onClick={Upload}>
              상품 등록
            </Button>
          )}
          {showEditButton && (
            <Button variant="ghost" size="sm" onClick={onEdit}>
              수정하기
            </Button>
          )}
          {showDeleteButton && (
            <Button variant="ghost" size="sm" onClick={onDelete}>
              삭제하기
            </Button>
          )}
          {showSellerProfileButton && (
            <Button variant="ghost" size="sm" onClick={onSellerProfile}>
              마이프로필
            </Button>
          )}

          {showProductCart && (
            <div>
              {user.userRole === "BUYER" && (
                <Link
                  to={isLoggedIn && user.userId ? `/cart/${user.userId}` : "#"}
                >
                  <button className="">
                    <div className="relative">
                      <img src={basket} alt="Basket" className="w-9 pb-3 " />
                      {uniqueProductCount > 0 && (
                        <span
                          className={`text-sm text-white absolute bottom-3.5 right-${
                            uniqueProductCount >= 10 ? "2.5" : "3.5"
                          }`}
                        >
                          {uniqueProductCount}
                        </span>
                      )}
                    </div>
                  </button>
                </Link>
              )}
            </div>
          )}

          <div className=" inline-block ml-2 mr-2">
            {authIsLoggedIn ? (
              <Button variant="outline" size="sm" onClick={handleLogout}>
                로그아웃
              </Button>
            ) : (
              <Button size="sm" onClick={Login}>
                로그인
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductHeader;
