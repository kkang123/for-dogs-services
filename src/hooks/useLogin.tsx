import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import Swal, { SweetAlertIcon } from "sweetalert2";

import { basicAxios } from "@/api/axios";
import { userState, isLoggedInState } from "@/recoil/userState";

import { Login, ServerError } from "@/interface/login";

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

      const { accessToken, provider } = response.data.result || {};

      const accessTokenExpiration = accessToken.expirationTime;
      localStorage.setItem("AccessToken", accessToken.value);
      localStorage.setItem("AccessTokenExpiration", accessTokenExpiration);

      const user = { isLoggedIn: true, userId, userRole, provider };
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      setIsLoggedIn(true);

      navigate("/");
      console.log("Access Token:", accessToken);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverResponse = error.response;

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
          "일치하는 회원을 찾을 수 없습니다.": {
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
          "탈퇴한 회원은 이용할 수 없습니다.": {
            icon: "error",
            title: "로그인 오류",
            text: "탈퇴한 회원입니다.",
          },
        };

        if (serverResponse) {
          const errorData = serverResponse.data as ServerError;
          if (serverResponse.status === 401 || serverResponse.status === 403) {
            if (errorData.error && errorMessages[errorData.error.message]) {
              Swal.fire({
                ...errorMessages[errorData.error.message],
                confirmButtonColor: "#3085d6",
                confirmButtonText: "확인",
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "오류 발생",
                text: "인증되지 않은 접근입니다. 자격 증명을 확인해주세요.",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "확인",
              });
            }
          } else if (
            serverResponse.status === 400 ||
            serverResponse.status === 404
          ) {
            if (errorData.error && errorMessages[errorData.error.message]) {
              Swal.fire({
                ...errorMessages[errorData.error.message],
                confirmButtonColor: "#3085d6",
                confirmButtonText: "확인",
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "오류 발생",
                text: "알 수 없는 오류가 발생했습니다. 나중에 다시 시도해주세요.",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "확인",
              });
            }
          } else {
            Swal.fire({
              icon: "error",
              title: "axios 오류 발생",
              text: "서버 연결 실패. 나중에 다시 시도해주세요.",
              confirmButtonColor: "#3085d6",
              confirmButtonText: "확인",
            });
            console.log("무슨 오류?", error);
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "axios 오류 발생",
            text: "서버 연결 실패. 나중에 다시 시도해주세요.",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "확인",
          });
          console.log("무슨 오류?", error);
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "클라이언트 오류 발생",
          text: "알 수 없는 오류가 발생했습니다. 나중에 다시 시도해주세요.",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "확인",
        });
        console.log("Non-Axios error:", error);
      }
    }
  };

  return { login };
};
