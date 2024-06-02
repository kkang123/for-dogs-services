import axios from "axios";
import { basicAxios } from "./axios";
import { useSetRecoilState } from "recoil";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

import { userState, isLoggedInState } from "@/recoil/userState";
import { Login, ServerError } from "@/interface/login";

import Swal, { SweetAlertIcon } from "sweetalert2";

export const useLogin = () => {
  const setUser = useSetRecoilState(userState);
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);

  const navigate = useNavigate();

  const login = async ({ userId, userPassword, userRole }: Login) => {
    try {
      const response = await basicAxios.post("/users/login", {
        userId,
        userPassword,
        userRole,
      });
      console.log("로그인 응답 데이터:", response.data);

      const { accessToken, refreshToken } = response.data.result;

      // 액세스 토큰과 리프레시 토큰의 만료 시간 저장
      const accessTokenExpiration = new Date(accessToken.expiration).getTime();
      const refreshTokenExpiration = new Date(
        refreshToken.expiration
      ).getTime();

      localStorage.setItem("AccessToken", accessToken.value); // 액세스 토큰을 로컬 스토리지에 저장
      localStorage.setItem(
        "AccessTokenExpiration",
        accessTokenExpiration.toString()
      );

      Cookies.set("REFRESH_TOKEN", refreshToken.value, {
        expires: new Date(refreshTokenExpiration),
      }); // 리프레시 토큰을 쿠키에 저장

      // 확인을 위한 console.log 추가
      console.log("액세스 토큰이 로컬 스토리지에 저장됨:", accessToken.value);
      console.log("리프레시 토큰이 쿠키에 저장됨:", refreshToken.value);

      localStorage.setItem(
        "user",
        JSON.stringify({ isLoggedIn: true, userId, userRole })
      );

      setUser({ isLoggedIn: true, userId, userRole }); // 사용자 상태 업데이트
      setIsLoggedIn(true);

      navigate("/");
      console.log("Access Token:", accessToken);
      console.log("Refresh Token:", refreshToken);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverResponse = error.response;

        if (
          serverResponse &&
          (serverResponse.status === 400 || serverResponse.status === 404)
        ) {
          const errorData = serverResponse.data as ServerError;
          console.error("Error data received from server:", errorData); // 응답 데이터 로깅

          const errorMessages: {
            [key: string]: {
              icon: SweetAlertIcon;
              title: string;
              text: string;
            };
          } = {
            "비밀번호가 일치하지 않습니다.": {
              icon: "error",
              title: "비밀번호 오류",
              text: "비밀번호가 일치하지 않습니다.",
            },
            "[password: 비밀번호를 입력해주세요.]": {
              icon: "error",
              title: "비밀번호 오류",
              text: "비밀번호를 입력해주세요.",
            },
            "아이디와 일치하는 회원을 찾을 수 없습니다.": {
              icon: "error",
              title: "회원정보 오류",
              text: "아이디와 일치하는 회원을 찾을 수 없습니다.",
            },
            "ID는 영문과 숫자만 사용할 수 있습니다.": {
              icon: "error",
              title: "아이디 오류",
              text: "ID는 영문과 숫자만 사용할 수 있습니다.",
            },
            "비활성화된 회원입니다. 로그인이 불가능합니다.": {
              icon: "error",
              title: "아이디 오류",
              text: "비활성화된 회원입니다. 로그인이 불가능합니다.",
            },
            "회원 역할이 일치하지 않습니다.": {
              icon: "error",
              title: "로그인 오류",
              text: "회원 역할을 확인해주세요.",
            },
          };

          if (errorData.error && errorMessages[errorData.error.message]) {
            Swal.fire(errorMessages[errorData.error.message]);
          } else {
            Swal.fire({
              icon: "error",
              title: "오류 발생",
              text: "알 수 없는 오류가 발생했습니다. 나중에 다시 시도해주세요.",
            });
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "오류 발생",
            text: "서버 연결 실패. 나중에 다시 시도해주세요.",
          });
          console.log("무슨 오류?", error);
        }
      } else {
        // axios 에러가 아닌 경우 처리
        Swal.fire({
          icon: "error",
          title: "오류 발생",
          text: "알 수 없는 오류가 발생했습니다. 나중에 다시 시도해주세요.",
        });
      }
    }
  };

  return { login };
};
