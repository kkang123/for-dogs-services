import { useEffect, useCallback } from "react";
import { useRecoilState } from "recoil";
import { userState, isLoggedInState } from "@/recoil/userState";
import { useLogout } from "@/hooks/useLogout";
import { basicAxios } from "@/api/axios";
import axios from "axios";

const useAuth = () => {
  const [user] = useRecoilState(userState);
  const [isLoggedIn] = useRecoilState(isLoggedInState);
  const { logout } = useLogout();

  const refreshAccessToken = useCallback(async () => {
    try {
      console.log("Starting token refresh...");
      const response = await basicAxios.post("/users/refresh");
      console.log("Refresh response:", response);

      const { accessToken } = response.data.result;
      const { value, expiration } = accessToken;

      console.log("Access Token: ", { value, expiration });
      localStorage.setItem("AccessToken", value);
      localStorage.setItem(
        "AccessTokenExpiration",
        new Date(expiration).getTime().toString()
      );

      return value;
    } catch (error) {
      console.error("액세스 토큰 갱신 실패:", error);

      if (axios.isAxiosError(error)) {
        const response = error.response;
        console.log("Axios 오류 응답:", response);

        if (response?.status === 401) {
          console.log("Unauthorized 오류 응답:", response.data);
        }
      }

      return null;
    }
  }, []);

  const checkAndRefreshToken = useCallback(async () => {
    const accessToken = localStorage.getItem("AccessToken");
    const accessTokenExpiration = localStorage.getItem("AccessTokenExpiration");

    if (accessToken && accessTokenExpiration) {
      const now = new Date().getTime();
      const expirationTime = Number(accessTokenExpiration);

      if (now >= expirationTime) {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          localStorage.setItem("AccessToken", newAccessToken);

          basicAxios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
        } else {
          logout();
        }
      } else {
        basicAxios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
      }
    } else {
      logout();
    }
  }, [refreshAccessToken, logout]);

  useEffect(() => {
    checkAndRefreshToken();
  }, [checkAndRefreshToken]);

  return { user, isLoggedIn, checkAndRefreshToken };
};

export default useAuth;
