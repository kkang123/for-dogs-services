// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import { basicAxios } from "@/api/axios";

// // JWT 저장 위치를 localStorage로 가정함
// const useOAuth2 = (provider: string) => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // OAuth2 인증 시작
//   const startOAuth2Flow = () => {
//     const redirectUri = encodeURIComponent("https://www.fordogs.store/login");
//     let oauth2Url = "";

//     if (provider === "google") {
//       // 수정된 Google OAuth2 인증 URL
//       oauth2Url = `https://api.fordogs.store/oauth2/authorization/google?redirect_uri=${redirectUri}`;
//     } else if (provider === "kakao") {
//       // Kakao OAuth2 인증 URL
//       oauth2Url = `https://api.fordogs.store/oauth/authorize/kakao?redirect_uri=${redirectUri}`;
//     }

//     if (oauth2Url) {
//       window.location.href = oauth2Url; // OAuth2 인증 URL로 리다이렉트
//     } else {
//       setError("지원하지 않는 OAuth 제공자입니다."); // 잘못된 provider일 경우 에러 처리
//     }
//   };

//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const authCode = urlParams.get("code"); // 인증 코드 가져오기

//     // 인증 코드로 JWT를 요청하는 함수
//     const getJwtWithCode = async (code: string) => {
//       try {
//         setLoading(true);

//         console.log("Auth Code:", code);

//         const response = await basicAxios.post("/users/login-with-code", {
//           authCode: code,
//         });

//         if (response.status === 200) {
//           const { jwtToken } = response.data; // JWT 토큰을 서버에서 받음
//           localStorage.setItem("jwt", jwtToken); // JWT 토큰을 localStorage에 저장
//           navigate("/"); // 인증 완료 후 메인 페이지로 이동
//         }
//       } catch (err) {
//         console.error(err); // 콘솔에 에러 출력
//         setError("로그인에 실패했습니다. 다시 시도해주세요.");
//       } finally {
//         setLoading(false); // 로딩 상태 종료
//       }
//     };

//     if (authCode) {
//       getJwtWithCode(authCode); // 인증 코드가 있을 경우 JWT 요청
//     }
//   }, [navigate, provider]); // provider도 의존성에 추가

//   return {
//     startOAuth2Flow, // OAuth2 인증을 시작하는 함수 반환
//     loading, // 로딩 상태 반환
//     error, // 에러 메시지 반환
//   };
// };

// export default useOAuth2;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

import { basicAxios } from "@/api/axios";

const useOAuth2 = (provider: string) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startOAuth2Flow = () => {
    const redirectUri = encodeURIComponent("https://www.fordogs.store/login");
    let oauth2Url = "";

    if (provider === "google") {
      oauth2Url = `https://api.fordogs.store/oauth2/authorization/google?redirect_uri=${redirectUri}`;
    } else if (provider === "kakao") {
      oauth2Url = `https://api.fordogs.store/oauth/authorize/kakao?redirect_uri=${redirectUri}`;
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

    const authCode = rawAuthCode
      ? decodeURIComponent(rawAuthCode).replace(/\s/g, "")
      : null;

    const getJwtWithCode = async (code: string) => {
      try {
        setLoading(true);
        console.log("Auth Code:", code);

        // 공백이 제거된 인증 코드를 서버로 전송
        const response = await basicAxios.post("/users/login-with-code", {
          authCode: code,
        });

        if (response.status === 201) {
          const { userId, accessToken, expirationTime } = response.data.result;

          console.log("서버 응답 데이터:", response.data);
          console.log("사용자 ID:", userId);
          console.log("액세스 토큰:", accessToken.value);
          console.log("토큰 만료 시간:", expirationTime);

          localStorage.setItem("accessToken", accessToken.value);
          localStorage.setItem("userId", userId);
          localStorage.setItem("expirationTime", expirationTime);

          console.log(
            "로컬스토리지에 저장된 액세스 토큰:",
            localStorage.getItem("accessToken")
          );
          console.log(
            "로컬스토리지에 저장된 사용자 ID:",
            localStorage.getItem("userId")
          );
          console.log(
            "로컬스토리지에 저장된 만료 시간:",
            localStorage.getItem("expirationTime")
          );

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

    if (authCode) {
      getJwtWithCode(authCode);
    }
  }, [navigate, provider]);

  return {
    startOAuth2Flow,
    loading,
    error,
  };
};

export default useOAuth2;
