import axios from "axios";
import { basicAxios } from "@/api/axios";
import { FindId } from "@/interface/userFindId";
import Swal from "sweetalert2";

export const UserFindId = async (userData: FindId) => {
  try {
    const response = await basicAxios.post("/users/find-id", userData);
    const userId = response.data.result.userId;

    Swal.fire("성공", `회원님의 아이디는 ${userId}입니다.`, "success");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverResponse = error.response;

      if (serverResponse) {
        if (serverResponse.status === 404) {
          Swal.fire(
            "사용자 정보 오류",
            "일치하는 회원을 찾을 수 없습니다. 입력하신 정보를 다시 확인해주세요.",
            "error"
          );
        } else if (serverResponse.status === 400) {
          Swal.fire(
            "입력 오류",
            "입력하신 정보에 오류가 있습니다. 다시 확인해 주세요.",
            "error"
          );
        } else {
          Swal.fire(
            "서버 오류",
            "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
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
      console.error("예상치 못한 오류 발생:", error);
      Swal.fire("알 수 없는 오류", "알 수 없는 오류가 발생했습니다.", "error");
    }
    throw error;
  }
};
