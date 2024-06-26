import { basicAxios } from "@/api/axios";
import { useSetRecoilState } from "recoil";
import { userState, isLoggedInState } from "@/recoil/userState";

export const useLogout = () => {
  const setUser = useSetRecoilState(userState);
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);

  const logout = async () => {
    localStorage.removeItem("AccessToken");
    localStorage.removeItem("AccessTokenExpiration");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser({ isLoggedIn: false, userId: "", role: "" });

    // try {
    //   const response = await basicAxios.post("/users/logout", {
    //     withCredentials: true,
    //   });
    //   console.log("로그아웃 성공 : ", response.data);
    // } catch (error) {
    //   console.error("로그아웃 실패 : ", error);
    // }
  };

  return { logout };
};
