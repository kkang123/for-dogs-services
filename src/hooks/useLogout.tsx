import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { userState, isLoggedInState } from "@/recoil/userState";
import Cookies from "js-cookie";

export const useLogout = () => {
  const setUser = useSetRecoilState(userState);
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("AccessToken"); // 로컬 스토리지에서 액세스 토큰 제거
    localStorage.removeItem("AccessTokenExpiration"); // 로컬 스토리지에서 액세스 토큰 만료 시간 제거
    localStorage.removeItem("user");
    Cookies.remove("REFRESH_TOKEN"); // 쿠키에서 리프레시 토큰 제거
    setIsLoggedIn(false); // 로그인 상태 초기화
    setUser({ isLoggedIn: false, userId: "", role: "" }); // 사용자 상태 초기화
    navigate("/login"); // 로그인 페이지로 리디렉션
  };

  return { logout };
};
