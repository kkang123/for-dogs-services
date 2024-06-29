import { useNavigate } from "react-router-dom";
import { basicAxios } from "@/api/axios";

const useDeleteUser = () => {
  const navigate = useNavigate();

  const deleteUser = async () => {
    try {
      const token = localStorage.getItem("AccessToken");
      if (!token) {
        throw new Error("토큰이 없습니다");
      }

      const response = await basicAxios.delete("/users/deactivate", {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
        },
      });

      if (response.status === 204) {
        navigate("/");
      }
    } catch (error) {
      console.error("사용자 탈퇴에 실패했습니다:", error);
    }
  };

  return deleteUser;
};

export default useDeleteUser;
