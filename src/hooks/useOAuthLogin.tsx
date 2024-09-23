import { basicAxios } from "@/api/axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await basicAxios.get("/login/oauth2/code/google"); // 기본적으로 구글 로그인 처리

        // 로그인 응답을 처리
        const { userId, accessToken } = response.data.result;

        // 토큰 및 사용자 정보를 저장
        localStorage.setItem("AccessToken", accessToken.value);
        localStorage.setItem(
          "user",
          JSON.stringify({ userId, isLoggedIn: true })
        );

        // 홈 페이지로 이동
        navigate("/");
      } catch (error) {
        // 카카오 로그인을 시도
        try {
          const response = await basicAxios.get("/login/oauth2/code/kakao");

          // 카카오 로그인 응답 처리
          const { userId, accessToken } = response.data.result;

          // 토큰 및 사용자 정보를 저장
          localStorage.setItem("AccessToken", accessToken.value);
          localStorage.setItem(
            "user",
            JSON.stringify({ userId, isLoggedIn: true })
          );

          // 홈 페이지로 이동
          navigate("/");
        } catch (kakaoError) {
          console.error("로그인 처리 중 오류 발생:", kakaoError);
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  return null; // 렌더링할 내용이 없으므로 null 반환
};

export default LoginCallback;
