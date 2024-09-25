import { useState } from "react";
import { AxiosError } from "axios";

import { basicAxios } from "@/api/axios";

interface VerifyAuthCodeData {
  authCode: string;
}

interface VerifyAuthCodeResponse {
  ok: boolean;
  path: string;
  timeStamp: string;
  result: {
    temporaryPassword: string;
  };
}

export function useVerifyAuthCode() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<VerifyAuthCodeResponse | null>(null);

  const verifyAuthCode = async (data: VerifyAuthCodeData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await basicAxios.post<VerifyAuthCodeResponse>(
        "/users/password-reset/verify",
        data
      );
      setResponse(res.data);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(
          err.response?.data.error.message || "인증 코드 확인 중 오류 발생."
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, response, verifyAuthCode };
}
