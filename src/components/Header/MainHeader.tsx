import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useRecoilState, useRecoilValue } from "recoil";
import { userState, isLoggedInState } from "@/recoil/userState";
import { cartState } from "@/recoil/cartState";

import { useLogout } from "@/hooks/useLogout";
import useAuth from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";

import mainlogo from "@/assets/main-logo.svg";
import mainother from "@/assets/mainother.svg";
import basket from "@/assets/basket-buy-cart.svg";

function MainHeader() {
  const user = useRecoilValue(userState);
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const { isLoggedIn: authIsLoggedIn } = useAuth();
  const { logout } = useLogout();
  const [cart, setCart] = useRecoilState(cartState);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

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

  useEffect(() => {
    console.log("authIsLoggedIn:", authIsLoggedIn);
  }, [authIsLoggedIn]);

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    navigate("/login");
  };

  const handleHome = (event: React.FormEvent) => {
    event.preventDefault();
    navigate("/");
  };

  return (
    <>
      <div className="fixed px-5 py-5 top-0 left-0 right-0 flex w-full justify-between shadow-lg bg-white z-40 h-20">
        <button onClick={handleHome}>
          <img src={mainlogo} alt="main-logo" className="w-9 h-9" />
        </button>

        <div className="hidden sm:flex">
          {user.userRole !== "SELLER" && user.userId && (
            <Link to={`/myprofile/${user.userId}`}>
              <Button variant={"ghost"} size="sm">
                마이프로필
              </Button>
            </Link>
          )}

          {user.userRole === "SELLER" && (
            <Link to={`/sellerprofile/${user.userId}`}>
              <Button size="sm">판매자 센터</Button>
            </Link>
          )}

          {user.userRole !== "SELLER" && (
            <Link to={isLoggedIn && user.userId ? `/cart/${user.userId}` : "#"}>
              <button>
                <div className="relative">
                  <img src={basket} alt="Basket" className="w-9 pb-3" />
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
          <div className="inline-block ml-2 mr-2">
            {authIsLoggedIn ? (
              <Button variant="outline" size="sm" onClick={handleLogout}>
                로그아웃
              </Button>
            ) : (
              <Button size="sm" onClick={handleLogin}>
                로그인
              </Button>
            )}
          </div>
        </div>

        <button className="sm:hidden" onClick={toggleDropdown}>
          <img src={mainother} alt="menu" className="w-10 h-10" />
        </button>

        {isOpen && (
          <div className="absolute right-5 top-20 bg-white shadow-lg rounded-md z-50 sm:hidden">
            {user.userRole !== "SELLER" && user.userId && (
              <Link
                to={`/myprofile/${user.userId}`}
                onClick={() => setIsOpen(false)}
              >
                <div className="px-4 py-2 hover:bg-gray-100">마이프로필</div>
              </Link>
            )}

            {user.userRole === "SELLER" && (
              <Link
                to={`/productlist/${user.userId}`}
                onClick={() => setIsOpen(false)}
              >
                <div className="px-4 py-2 hover:bg-gray-100">판매자 센터</div>
              </Link>
            )}

            {user.userRole !== "SELLER" && (
              <Link
                to={isLoggedIn && user.userId ? `/cart/${user.userId}` : "#"}
                onClick={() => setIsOpen(false)}
              >
                <div className="px-4 py-2 hover:bg-gray-100">장바구니</div>
              </Link>
            )}

            <div
              className="px-4 py-2 hover:bg-gray-100"
              onClick={authIsLoggedIn ? handleLogout : handleLogin}
            >
              {authIsLoggedIn ? "로그아웃" : "로그인"}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default MainHeader;
