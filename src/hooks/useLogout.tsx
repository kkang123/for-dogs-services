import { useSetRecoilState } from "recoil";
import { userState, isLoggedInState } from "@/recoil/userState";

export const useLogout = () => {
  const setUser = useSetRecoilState(userState);
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);

  const logout = () => {
    localStorage.removeItem("AccessToken");
    localStorage.removeItem("AccessTokenExpiration");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser({ isLoggedIn: false, userId: "", role: "" });
  };

  return { logout };
};
