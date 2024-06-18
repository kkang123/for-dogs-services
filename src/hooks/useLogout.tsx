import { useSetRecoilState } from "recoil";
import { userState, isLoggedInState } from "@/recoil/userState";

export const useLogout = () => {
  const setUser = useSetRecoilState(userState);
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);

  const logout = () => {
    localStorage.removeItem("AccessToken"); // 로컬 스토리지에서 액세스 토큰 제거
    localStorage.removeItem("AccessTokenExpiration"); // 로컬 스토리지에서 액세스 토큰 만료 시간 제거
    localStorage.removeItem("user");
    setIsLoggedIn(false); // 로그인 상태 초기화
    setUser({ isLoggedIn: false, userId: "", role: "" }); // 사용자 상태 초기화
  };

  return { logout };
};
