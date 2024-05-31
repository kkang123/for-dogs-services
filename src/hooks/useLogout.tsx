import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import {
  userState,
  accessTokenState,
  isLoggedInState,
} from "@/recoil/userState";
import Cookies from "js-cookie";

export const useLogout = () => {
  const setUser = useSetRecoilState(userState);
  const setAccessToken = useSetRecoilState(accessTokenState);
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("AccessToken"); // 로컬 스토리지에서 액세스 토큰 제거
    localStorage.removeItem("user");
    Cookies.remove("REFRESH_TOKEN"); // 쿠키에서 리프레시 토큰 제거
    setAccessToken(""); // 리코일 상태 초기화
    setIsLoggedIn(false); // 로그인 상태 초기화
    setUser({ isLoggedIn: false, userId: "", role: "" }); // 사용자 상태 초기화
    navigate("/login"); // 로그인 페이지로 리디렉션
    console.log("로그아웃 accessToken"), localStorage.removeItem("AccessToken");
    console.log("로그아웃 refreshToken", Cookies.remove("REFRESH_TOKEN"));
  };

  // 토큰 만료 여부를 확인하고 만료되면 자동으로 로그아웃하는 함수
  const checkTokenExpiration = () => {
    const accessToken = localStorage.getItem("AccessToken");
    const refreshToken = Cookies.get("REFRESH_TOKEN");

    console.log("AccessToken:", accessToken);
    console.log("REFRESH_TOKEN:", refreshToken);

    if (refreshToken) {
      // 리프레시 토큰이 있으면 만료 시간을 확인하여 로그아웃 처리
      const currentTime = Math.floor(Date.now() / 1000); // 현재 시간을 초 단위로 변환
      if (accessToken && parseInt(accessToken) < currentTime) {
        logout();
      }
    } else if (!refreshToken && accessToken) {
      // 리프레시 토큰은 없고 액세스 토큰은 있는 경우에는 액세스 토큰 만료 후 자동 로그아웃은 진행하지 않습니다.
      logout();
      console.log(
        "리프레시 토큰이 만료되었습니다.. 액세스 토큰을 만료 후 로그아웃하겠습니다."
      );
    }
  };

  // 컴포넌트가 마운트될 때마다 토큰 만료 여부를 확인합니다.
  useEffect(() => {
    checkTokenExpiration();
  }, []);

  return { logout };
};
