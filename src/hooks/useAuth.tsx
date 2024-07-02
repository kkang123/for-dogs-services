import { useEffect, useCallback, useRef } from "react";
import { useRecoilState } from "recoil";
import { userState, isLoggedInState } from "@/recoil/userState";
import { useLogout } from "@/hooks/useLogout";
import { basicAxios } from "@/api/axios";
import axios, { AxiosError } from "axios";

const useAuth = () => {
  const [user] = useRecoilState(userState);
  const [isLoggedIn] = useRecoilState(isLoggedInState);
  const { logout } = useLogout();

  const refreshAccessToken = useCallback(async () => {
    try {
      console.log("토큰 갱신을 시작합니다...");
      const response = await basicAxios.post("/users/refresh");
      console.log("갱신 응답:", response);

      const { accessToken } = response.data.result;
      const { value, expirationTime } = accessToken;

      console.log("액세스 토큰: ", { value, expirationTime });
      localStorage.setItem("AccessToken", value);
      localStorage.setItem(
        "AccessTokenExpiration",
        new Date(expirationTime).getTime().toString()
      );

      return value;
    } catch (error) {
      console.error("액세스 토큰 갱신 실패:", error);

      if (axios.isAxiosError(error)) {
        const response = (error as AxiosError).response;
        console.log("Axios 오류 응답:", response);

        if (response?.status === 401) {
          console.log("Unauthorized 오류 응답:", response.data);
        }
      }

      return null;
    }
  }, []);

  const refreshTimeout = useRef<NodeJS.Timeout | null>(null);

  const checkAndRefreshToken = useCallback(async () => {
    const accessToken = localStorage.getItem("AccessToken");
    const accessTokenExpiration = localStorage.getItem("AccessTokenExpiration");

    if (accessToken && accessTokenExpiration) {
      const now = new Date().getTime();
      const expirationTime = Number(accessTokenExpiration);

      // 액세스 토큰 만료 1분 전에 갱신 요청
      const timeToRefresh = expirationTime - now - 60 * 1000;

      if (timeToRefresh <= 0) {
        // 만료 시간이 지났거나 너무 가까워서 갱신이 필요한 경우
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
        // 갱신이 필요하지 않은 경우, 남은 시간에 맞춰 다음 갱신 스케줄링
        refreshTimeout.current = setTimeout(refreshAccessToken, timeToRefresh);
      }
    } else {
      logout();
    }
  }, [refreshAccessToken, logout]);

  useEffect(() => {
    checkAndRefreshToken();

    return () => {
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
      }
    };
  }, [checkAndRefreshToken]);

  return { user, isLoggedIn, checkAndRefreshToken };
};

export default useAuth;
