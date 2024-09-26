import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { basicAxios } from "@/api/axios";

// JWT 저장 위치를 localStorage로 가정함
const useOAuth2 = (provider: string) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // OAuth2 인증 시작
  const startOAuth2Flow = () => {
    const redirectUri = encodeURIComponent("https://www.fordogs.store/login");
    let oauth2Url = "";

    if (provider === "google") {
      // Google OAuth2 인증 URL
      oauth2Url = `https://localhost/oauth2/authorization/google?redirect_uri=${redirectUri}`;
    } else if (provider === "kakao") {
      // Kakao OAuth2 인증 URL
      oauth2Url = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code`;
    }

    if (oauth2Url) {
      window.location.href = oauth2Url; // OAuth2 인증 URL로 리다이렉트
    } else {
      setError("지원하지 않는 OAuth 제공자입니다."); // 잘못된 provider일 경우 에러 처리
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code"); // 인증 코드 가져오기

    // 인증 코드로 JWT를 요청하는 함수
    const getJwtWithCode = async (code: string) => {
      try {
        setLoading(true);

        // POST 요청으로 서버에 인증 코드 전송 (API 스펙에 맞게 body 수정)
        const response = await basicAxios.post("/users/login-with-code", {
          authCode: code, // API 스펙에 맞게 key를 "authCode"로 수정
        });

        if (response.status === 200) {
          const { jwtToken } = response.data; // JWT 토큰을 서버에서 받음
          localStorage.setItem("jwt", jwtToken); // JWT 토큰을 localStorage에 저장
          navigate("/"); // 인증 완료 후 메인 페이지로 이동
        }
      } catch (err) {
        console.error(err); // 콘솔에 에러 출력
        setError("로그인에 실패했습니다. 다시 시도해주세요.");
      } finally {
        setLoading(false); // 로딩 상태 종료
      }
    };

    if (authCode) {
      getJwtWithCode(authCode); // 인증 코드가 있을 경우 JWT 요청
    }
  }, [navigate, provider]); // provider도 의존성에 추가

  return {
    startOAuth2Flow, // OAuth2 인증을 시작하는 함수 반환
    loading, // 로딩 상태 반환
    error, // 에러 메시지 반환
  };
};

export default useOAuth2;
