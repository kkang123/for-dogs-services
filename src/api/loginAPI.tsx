import axios from "axios";
import { basicAxios } from "./axios";
import { useSetRecoilState } from "recoil";
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

      const { accessToken } = response.data.result || {};

      const accessTokenExpiration = new Date(
        accessToken.expirationTime
      ).getTime();
      localStorage.setItem("AccessToken", accessToken.value);
      localStorage.setItem(
        "AccessTokenExpiration",
        accessTokenExpiration.toString()
      );

      const user = { isLoggedIn: true, userId, userRole };
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      setIsLoggedIn(true);

      navigate("/");
      console.log("Access Token:", accessToken);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverResponse = error.response;

        if (
          serverResponse &&
          (serverResponse.status === 400 || serverResponse.status === 404)
        ) {
          const errorData = serverResponse.data as ServerError;
          console.error("서버로부터 받은 오류 데이터:", errorData);

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
            title: "axios 오류 발생",
            text: "서버 연결 실패. 나중에 다시 시도해주세요.",
          });
          console.log("무슨 오류?", error);
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "클라이언트 오류 발생",
          text: "알 수 없는 오류가 발생했습니다. 나중에 다시 시도해주세요.",
        });
        console.log("Non-Axios error:", error);
      }
    }
  };

  return { login };
};
