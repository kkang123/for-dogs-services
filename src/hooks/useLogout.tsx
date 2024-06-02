import { useEffect } from "react";
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
    localStorage.removeItem("RefreshTokenExpiration"); // 로컬 스토리지에서 리프레시 토큰 만료 시간 제거
    localStorage.removeItem("user");
    Cookies.remove("REFRESH_TOKEN"); // 쿠키에서 리프레시 토큰 제거
    setIsLoggedIn(false); // 로그인 상태 초기화
    setUser({ isLoggedIn: false, userId: "", role: "" }); // 사용자 상태 초기화
    navigate("/login"); // 로그인 페이지로 리디렉션
    console.log("로그아웃: AccessToken", localStorage.getItem("AccessToken"));
    console.log("로그아웃: RefreshToken", Cookies.get("REFRESH_TOKEN"));
  };

  // 토큰 만료 여부를 확인하고 만료되면 자동으로 로그아웃하는 함수
  const checkTokenExpiration = () => {
    const accessTokenExpiration = localStorage.getItem("AccessTokenExpiration");
    const refreshTokenExpiration = localStorage.getItem(
      "RefreshTokenExpiration"
    );

    console.log("AccessTokenExpiration:", accessTokenExpiration);
    console.log("RefreshTokenExpiration:", refreshTokenExpiration);

    const currentTime = Date.now(); // 현재 시간을 밀리초 단위로 변환

    // 리프레시 토큰 만료 확인
    if (
      refreshTokenExpiration &&
      parseInt(refreshTokenExpiration) < currentTime
    ) {
      console.log("리프레시 토큰이 만료되었습니다.");
      logout();
    } else if (
      accessTokenExpiration &&
      parseInt(accessTokenExpiration) < currentTime
    ) {
      // 액세스 토큰이 만료되었지만 리프레시 토큰이 아직 유효한 경우에 대한 처리
      console.log("액세스 토큰이 만료되었습니다.");
      // 여기에 액세스 토큰 갱신 로직을 추가할 수 있습니다.
    }
  };

  // 컴포넌트가 마운트될 때마다 토큰 만료 여부를 확인합니다.
  useEffect(() => {
    const intervalId = setInterval(() => {
      checkTokenExpiration();
    }, 1000 * 60); // 매 분마다 만료 여부 확인

    return () => clearInterval(intervalId); // 컴포넌트가 언마운트될 때 인터벌 정리
  }, []);

  return { logout };
};
