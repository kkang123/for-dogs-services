import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { basicAxios } from "@/api/axios";
import { useLogout } from "@/hooks/useLogout";

const useDeleteUser = () => {
  const navigate = useNavigate();
  const { logout } = useLogout();

  const deleteUser = async () => {
    const result = await Swal.fire({
      title: "정말 탈퇴하시겠습니까?",
      html: "탈퇴 시 계정은 삭제되며 복구할 수 없습니다.<br> <p style='color:#ff6b6b;'>(탈퇴 시 로그아웃이 진행됩니다.)</p>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "네, 삭제합니다!",
      cancelButtonText: "아니요, 유지합니다",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("AccessToken");
        if (!token) {
          throw new Error("토큰이 없습니다.");
        }

        const response = await basicAxios.delete("/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
        });

        if (response.status === 204) {
          navigate("/");
          logout();
        }
      } catch (error) {
        console.error("사용자 탈퇴에 실패했습니다:", error);
      }
    }
  };

  return deleteUser;
};

export default useDeleteUser;
