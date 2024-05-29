import { useSetRecoilState } from "recoil";
import {
  userState,
  accessTokenState,
  isLoggedInState,
} from "@/recoil/userState";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const setUser = useSetRecoilState(userState);
  const setAccessToken = useSetRecoilState(accessTokenState);
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("accessToken"); // 로컬 스토리지에서 액세스 토큰 제거
    localStorage.removeItem("user");
    Cookies.remove("refreshToken"); // 쿠키에서 리프레시 토큰 제거
    setAccessToken(""); // 리코일 상태 초기화
    setIsLoggedIn(false); // 로그인 상태 초기화
    setUser({ isLoggedIn: false, userId: "", role: "" }); // 사용자 상태 초기화
    navigate("/login"); // 로그인 페이지로 리디렉션
  };

  return { logout };
};
