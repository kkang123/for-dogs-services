import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { userState, isLoggedInState } from "@/recoil/userState";
import Cookies from "js-cookie";

export const useLogout = () => {
  const setUser = useSetRecoilState(userState);
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);

  const logout = () => {
    localStorage.removeItem("AccessToken"); // 로컬 스토리지에서 액세스 토큰 제거
    localStorage.removeItem("AccessTokenExpiration"); // 로컬 스토리지에서 액세스 토큰 만료 시간 제거
    localStorage.removeItem("user");
    Cookies.remove("REFRESH_TOKEN"); // 쿠키에서 리프레시 토큰 제거
    setIsLoggedIn(false); // 로그인 상태 초기화
    setUser({ isLoggedIn: false, userId: "", role: "" }); // 사용자 상태 초기화
  };

  useEffect(() => {
    // 리프레시 토큰 쿠키를 읽는 함수
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
    };

    // 새로고침 시 쿠키 상태를 확인하고 로컬 스토리지 데이터를 삭제하는 함수
    const checkAndDeleteLocalStorage = () => {
      const refreshToken = getCookie("REFRESH_TOKEN"); // 'REFRESH_TOKEN'은 리프레시 토큰의 쿠키 이름
      if (!refreshToken) {
        // 리프레시 토큰이 없으면 로컬 스토리지 데이터를 삭제하고 로그아웃 처리
        localStorage.removeItem("AccessToken");
        localStorage.removeItem("AccessTokenExpiration");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setUser({ isLoggedIn: false, userId: "", role: "" });
      }
    };

    checkAndDeleteLocalStorage();
  }, [setIsLoggedIn, setUser]);

  return { logout };
};
