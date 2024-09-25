import { useState } from "react";
import { AxiosError } from "axios";

import { basicAxios } from "@/api/axios";

interface PasswordResetData {
  userId: string;
  userEmailId: string;
  userEmailDomain: string;
}

interface PasswordResetResponse {
  ok: boolean;
  path: string;
  timeStamp: string;
}

export function useRequestPasswordReset() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<PasswordResetResponse | null>(null);

  const requestPasswordReset = async (data: PasswordResetData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await basicAxios.post<PasswordResetResponse>(
        "/users/password-reset",
        data
      );
      setResponse(res.data);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.message || "비밀번호 초기화 요청 중 오류가 발생했습니다.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, response, requestPasswordReset };
}
