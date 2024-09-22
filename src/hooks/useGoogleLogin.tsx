import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { basicAxios } from "@/api/axios";
import Swal from "sweetalert2";

interface GoogleLoginResponse {
  accessToken: string;
  refreshToken: string;
}

const useGoogleLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);

      // 백엔드의 Google OAuth 로그인 엔드포인트 호출
      const response = await basicAxios.get<GoogleLoginResponse>(
        "login/oauth2/authorization/google",
        { withCredentials: true } // 쿠키를 사용한다면 추가
      );

      // 백엔드로부터 받은 토큰 처리
      const { accessToken, refreshToken } = response.data;

      // 토큰 저장 로직
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // 로그인 성공 시 페이지 이동
      Swal.fire({
        icon: "success",
        title: "Google 로그인 성공",
        text: "로그인이 완료되었습니다.",
      });

      navigate("/"); // 로그인 후 메인 페이지로 이동
    } catch (error) {
      setError("Google 로그인에 실패했습니다.");

      // 오류 처리
      Swal.fire({
        icon: "error",
        title: "로그인 오류",
        text: "Google 로그인에 실패했습니다. 다시 시도해주세요.",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    signInWithGoogle,
    loading,
    error,
  };
};

export default useGoogleLogin;
