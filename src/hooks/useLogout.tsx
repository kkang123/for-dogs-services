import { useRecoilValue, useSetRecoilState } from "recoil";

import { basicAxios } from "@/api/axios";
import { userState, isLoggedInState } from "@/recoil/userState";

export const useLogout = () => {
  const setUser = useSetRecoilState(userState);
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);
  const isLoggedIn = useRecoilValue(isLoggedInState);

  const clearUserState = () => {
    localStorage.removeItem("AccessToken");
    localStorage.removeItem("AccessTokenExpiration");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    setIsLoggedIn(false);
    setUser({ isLoggedIn: false, userId: "", role: "" });
  };

  const logout = async () => {
    if (!isLoggedIn) {
      clearUserState();
      return;
    }

    try {
      await basicAxios.post("/users/logout", {}, { withCredentials: true });
      console.log("로그아웃 성공");

      clearUserState();
    } catch (error) {
      console.error("로그아웃 실패 : ", error);
    }
  };

  return { logout };
};
