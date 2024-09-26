import axios from "axios";
import Swal from "sweetalert2";

import { basicAxios } from "@/api/axios";

import { User } from "@/interface/user";

export const registerUser = async (userData: User) => {
  try {
    const response = await basicAxios.post("/users", userData);
    console.log("User registered successfully:", response.data);
    Swal.fire({
      title: "성공!",
      text: "회원가입이 완료되었습니다.",
      icon: "success",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "확인",
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverResponse = error.response;

      if (serverResponse && serverResponse.status === 400) {
        const errorData = serverResponse.data;
        console.log("Error data received from server:", errorData);

        if (
          errorData.error &&
          errorData.error.message === "이미 사용 중인 회원 ID입니다."
        ) {
          Swal.fire({
            icon: "error",
            title: "중복된 아이디",
            text: "중복된 아이디를 입력하셨습니다. 다른 아이디를 사용해주세요.",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "확인",
          });
        } else if (
          errorData.error &&
          errorData.error.message === "이름은 한글과 영문만 사용할 수 있습니다."
        ) {
          Swal.fire({
            icon: "error",
            title: "이름 오류",
            text: "이름은 한글과 영문만 사용할 수 있습니다.",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "확인",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "회원가입 오류",
            text: "회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "확인",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "서버 오류",
          text: "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "확인",
        });
      }
    } else {
      console.error("An unexpected error occurred:", error);
      Swal.fire({
        icon: "error",
        title: "알 수 없는 오류",
        text: "알 수 없는 오류가 발생했습니다.",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "확인",
      });
    }
    throw error;
  }
};
