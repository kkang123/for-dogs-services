import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { useSetRecoilState } from "recoil";

import { basicAxios } from "@/api/axios";
import { userState, isLoggedInState } from "@/recoil/userState";

const useOAuth2 = (provider: string) => {
  const setUser = useSetRecoilState(userState);
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startOAuth2Flow = () => {
    const redirectUri = encodeURIComponent("https://www.fordogs.store/login");
    let oauth2Url = "";

    if (provider === "google") {
      oauth2Url = `https://api.fordogs.store/oauth2/authorization/google?redirect_uri=${redirectUri}`;
    } else if (provider === "kakao") {
      oauth2Url = `https://api.fordogs.store/oauth2/authorization/kakao?redirect_uri=${redirectUri}`;
    }

    if (oauth2Url) {
      window.location.href = oauth2Url;
    } else {
      setError("지원하지 않는 OAuth 제공자입니다.");
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const rawAuthCode = urlParams.get("code");

    // Replace spaces with + before URL decoding
    const authCode = rawAuthCode ? rawAuthCode.replace(/ /g, "+") : null;

    // Decode the authorization code, replacing %2B back to +
    const formattedAuthCode = authCode ? decodeURIComponent(authCode) : null;

    const getJwtWithCode = async (code: string) => {
      try {
        setLoading(true);
        console.log("Auth Code:", code);

        const response = await basicAxios.post("/users/login-with-code", {
          authCode: formattedAuthCode,
        });

        if (response.status === 201) {
          const { userId, accessToken } = response.data.result;

          const accessTokenExpiration = accessToken.expirationTime;

          localStorage.setItem("AccessToken", accessToken.value);
          localStorage.setItem("AccessTokenExpiration", accessTokenExpiration);

          const user = { isLoggedIn: true, userId, userRole: "BUYER" };
          localStorage.setItem("user", JSON.stringify(user));

          setUser(user);
          setIsLoggedIn(true);

          navigate("/");
        }
      } catch (err) {
        const error = err as AxiosError;
        console.error("요청 오류:", error);
        if (error.response) {
          console.error("서버 응답 데이터:", error.response.data);
        }
        setError("로그인에 실패했습니다. 다시 시도해주세요.");
      } finally {
        setLoading(false);
      }
    };

    if (formattedAuthCode) {
      getJwtWithCode(formattedAuthCode);
    }
  }, [navigate, provider]);

  return {
    startOAuth2Flow,
    loading,
    error,
  };
};

export default useOAuth2;
