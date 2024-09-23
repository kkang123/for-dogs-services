import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { basicAxios } from "@/api/axios";

function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    const provider = urlParams.get("provider"); // 'google' 또는 'kakao'

    if (code && provider) {
      const url =
        provider === "google"
          ? "https://api.fordogs.store/oauth/callback/google"
          : "https://api.fordogs.store/oauth/callback/kakao"; // 카카오 처리 엔드포인트

      basicAxios
        .post(url, { code, state })
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          navigate("/");
        })
        .catch((error) => {
          console.error(`${provider} OAuth 로그인 실패`, error);
        });
    }
  }, [navigate]);

  return <div>로그인 처리 중...</div>;
}

export default OAuthCallback;
