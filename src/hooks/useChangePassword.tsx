import { useState, useCallback } from "react";
import { AxiosError } from "axios";
import Swal from "sweetalert2";

import { basicAxios } from "@/api/axios";

interface ChangePasswordProps {
  currentPassword: string;
  newPassword: string;
}

interface UseChangePasswordReturn {
  changePassword: (passwords: ChangePasswordProps) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

interface ErrorResponse {
  message: string;
}

const useChangePassword = (): UseChangePasswordReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const changePassword = useCallback(
    async ({ currentPassword, newPassword }: ChangePasswordProps) => {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const response = await basicAxios.patch(`/users/password-change`, {
          currentPassword,
          newPassword,
        });

        if (response.status !== 200) {
          const errorMessage =
            response.data.message || "비밀번호 변경에 실패했습니다.";
          setError(errorMessage);
          Swal.fire({
            icon: "error",
            title: "실패",
            text: errorMessage,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "확인",
          });
          return;
        }

        setSuccess(true);
        Swal.fire({
          icon: "success",
          title: "성공",
          text: "비밀번호가 성공적으로 변경되었습니다.",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "확인",
        });
      } catch (err: unknown) {
        const axiosError = err as AxiosError<ErrorResponse>;
        let errorMessage = "비밀번호 변경 중 오류가 발생했습니다.";

        if (axiosError.response) {
          if (axiosError.response.status === 401) {
            errorMessage = "기존 비밀번호가 일치하지 않습니다.";
          } else {
            errorMessage = axiosError.response.data.message || errorMessage;
          }
        }

        setError(errorMessage);
        Swal.fire({
          icon: "error",
          title: "실패",
          text: errorMessage,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "확인",
        });
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    changePassword,
    isLoading,
    error,
    success,
  };
};

export default useChangePassword;
