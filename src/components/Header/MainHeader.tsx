import { FormEvent, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";
import { useRecoilState } from "recoil";
import { cartState } from "@/recoil/cartState";

import { auth } from "@/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";

import { Button } from "@/components/ui/button";

import mainlogo from "@/assets/main-logo.svg";
import mainother from "@/assets/mainother.svg";
import basket from "@/assets/basket-buy-cart.svg";

function MainHeader() {
  const { isSeller } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);
  const navigate = useNavigate();

  const [cart, setCart] = useRecoilState(cartState);
  const resetCart = () => setCart([]);

  const [isOpen, setIsOpen] = useState(false); // 드롭다운 메뉴 상태

  // 드롭다운 메뉴 토글 함수
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // localStorage에서 장바구니 정보를 호출
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, [setCart]);

  const uniqueProductCount = new Set(cart.map((item) => item.product.id)).size;

  // 로그인 상태 확인
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoading(false);
      if (user) {
        setIsLoggedIn(true);
        setUid(user.uid);
      } else {
        setIsLoggedIn(false);
        setUid(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const logOut = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await signOut(auth);
      resetCart();
      console.log("Successfully logged out");
    } catch (error) {
      console.error("Error during log out", error);
    }
  };

  const Login = (event: FormEvent) => {
    event.preventDefault();
    navigate("/login");
  };

  const Home = (event: FormEvent) => {
    event.preventDefault();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="fixed px-5 py-5 top-0 left-0 right-0 flex  w-full justify-between shadow-lg  bg-white z-40 h-20">
        <img src={mainlogo} alt="main-logo" className="w-9 h-9 pb-3 " />
        <div className="flex">
          {!isSeller && uid && (
            <Link to={`/myprofile/${uid}`}>
              <Button variant={"ghost"} size="sm">
                마이프로필
              </Button>
            </Link>
          )}
          {isSeller && (
            <Link to={`/productlist/${uid}`}>
              <Button size="sm">판매자 센터</Button>
            </Link>
          )}

          {!isSeller && (
            <Link to={isLoggedIn && uid ? `/cart/${uid}` : "#"}>
              <button className="">
                <div className="relative">
                  <img src={basket} alt="Basket" className="w-9" />
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
          <div className=" inline-block ml-2 mr-2">
            <Button variant="outline" size="sm" onClick={logOut}>
              로그아웃
            </Button>
          </div>
        </div>
      </div>
    );
  }

  console.log(`isLoggedIn: ${isLoggedIn}, uid: ${uid}`);

  return (
    <>
      <div className="fixed px-5 py-5 top-0 left-0 right-0 flex  w-full justify-between shadow-lg  bg-white z-40 h-20">
        <button className="" onClick={Home}>
          <img src={mainlogo} alt="main-logo" className="w-9 h-9" />
        </button>

        <div className="hidden sm:flex">
          {!isSeller && uid && (
            <Link to={`/myprofile/${uid}`}>
              <Button variant={"ghost"} size="sm">
                마이프로필
              </Button>
            </Link>
          )}

          {isSeller && ( // isSeller가 true일 때만 '판매자 센터' 버튼을 표시합니다.
            <Link to={`/productlist/${uid}`}>
              <Button size="sm">판매자 센터</Button>
            </Link>
          )}

          {/* isSeller가 false일 때만 장바구니 표시 */}
          {!isSeller && (
            <Link to={isLoggedIn && uid ? `/cart/${uid}` : "#"}>
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
          <div className=" inline-block ml-2 mr-2">
            {isLoggedIn ? (
              <Button variant="outline" size="sm" onClick={logOut}>
                로그아웃
              </Button>
            ) : (
              <Button size="sm" onClick={Login}>
                로그인
              </Button>
            )}
          </div>
        </div>

        {/* sm 이하 크기에서 표시될 버튼 */}
        <button className="sm:hidden" onClick={toggleDropdown}>
          <img src={mainother} alt="menu" className="w-10 h-10" />{" "}
          {/* 메뉴 아이콘 이미지 경로 */}
        </button>

        {/* 드롭다운 메뉴 */}
        {isOpen && (
          <div className="absolute right-5 top-20 bg-white shadow-lg rounded-md z-50 sm:hidden">
            {!isSeller && uid && (
              <Link to={`/myprofile/${uid}`} onClick={() => setIsOpen(false)}>
                <div className="px-4 py-2 hover:bg-gray-100">마이프로필</div>
              </Link>
            )}

            {isSeller && (
              <Link to={`/productlist/${uid}`} onClick={() => setIsOpen(false)}>
                <div className="px-4 py-2 hover:bg-gray-100">판매자 센터</div>
              </Link>
            )}

            {!isSeller && (
              <Link
                to={isLoggedIn && uid ? `/cart/${uid}` : "#"}
                onClick={() => setIsOpen(false)}
              >
                <div className="px-4 py-2 hover:bg-gray-100">장바구니</div>
              </Link>
            )}

            <div
              className="px-4 py-2 hover:bg-gray-100"
              onClick={isLoggedIn ? logOut : Login}
            >
              {isLoggedIn ? "로그아웃" : "로그인"}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default MainHeader;
