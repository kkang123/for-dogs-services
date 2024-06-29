import axios from "axios";
import { basicAxios } from "./axios";
import { User } from "@/interface/user";
import Swal from "sweetalert2";

export const registerUser = async (userData: User) => {
  try {
    const response = await basicAxios.post("/users/signup", userData);
    console.log("User registered successfully:", response.data);
    Swal.fire("성공!", "회원가입이 완료되었습니다.", "success");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverResponse = error.response;

      if (serverResponse && serverResponse.status === 400) {
        const errorData = serverResponse.data;
        console.log("Error data received from server:", errorData); // 응답 데이터 로깅

        if (
          errorData.error &&
          errorData.error.message === "이미 사용 중인 회원 ID입니다."
        ) {
          Swal.fire(
            "중복된 아이디",
            "중복된 아이디를 입력하셨습니다. 다른 아이디를 사용해주세요.",
            "error"
          );
        } else if (
          errorData.error &&
          errorData.error.message === "이름은 한글과 영문만 사용할 수 있습니다."
        ) {
          Swal.fire(
            "이름 오류",
            "이름은 한글과 영문만 사용할 수 있습니다.",
            "error"
          );
        } else {
          Swal.fire(
            "회원가입 오류",
            "회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.",
            "error"
          );
        }
      } else {
        Swal.fire(
          "서버 오류",
          "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
          "error"
        );
      }
    } else {
      console.error("An unexpected error occurred:", error);
      Swal.fire("알 수 없는 오류", "알 수 없는 오류가 발생했습니다.", "error");
    }
    throw error; // 에러를 다시 throw 해서 호출한 곳에서 처리할 수 있게 합니다.
  }
};
