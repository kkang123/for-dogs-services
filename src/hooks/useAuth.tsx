import { basicAxios } from "@/api/axios";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { userState, isLoggedInState } from "@/recoil/userState";

const useAuth = () => {
  const [user, setUser] = useRecoilState(userState);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem("AccessToken");
      const accessTokenExpiration = localStorage.getItem(
        "AccessTokenExpiration"
      );

      if (
        accessToken &&
        accessTokenExpiration &&
        new Date().getTime() < Number(accessTokenExpiration)
      ) {
        setIsLoggedIn(true);
      } else {
        try {
          const response = await basicAxios.post("/users/refresh");
          const { accessToken } = response.data;
          const newExpiration = new Date(accessToken.expiration).getTime();
          localStorage.setItem("AccessToken", accessToken.value);
          localStorage.setItem(
            "AccessTokenExpiration",
            newExpiration.toString()
          );
          setIsLoggedIn(true);
        } catch (error) {
          setIsLoggedIn(false);
          setUser({ isLoggedIn: false, userId: "", userRole: "" });
          localStorage.removeItem("user");
          localStorage.removeItem("AccessToken");
          localStorage.removeItem("AccessTokenExpiration");
        }
      }
    };

    checkAuth();
  }, [setIsLoggedIn, setUser]);

  return { user, isLoggedIn };
};

export default useAuth;
