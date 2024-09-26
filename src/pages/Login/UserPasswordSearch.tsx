import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { useRequestPasswordReset } from "@/hooks/useRequestPasswordReset";
import { useVerifyAuthCode } from "@/hooks/useVerifyAuthCode";

export default function PasswordReset() {
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);

  const navigate = useNavigate();
  const {
    loading: loadingReset,
    error: errorReset,
    requestPasswordReset,
  } = useRequestPasswordReset();
  const {
    loading: loadingVerify,
    error: errorVerify,
    response: responseVerify,
    verifyAuthCode,
  } = useVerifyAuthCode();

  const handleRequestReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const [userEmailId, userEmailDomain] = email.split("@");

    try {
      await requestPasswordReset({ userId, userEmailId, userEmailDomain });
      setShowVerification(true);
    } catch (error) {
      console.error("Error during password reset request:", error);
    }
  };

  const handleVerifyAuthCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await verifyAuthCode({ authCode });
      if (responseVerify?.result.temporaryPassword) {
        Swal.fire({
          icon: "success",
          title: "임시 비밀번호가 발급되었습니다!",
          text: `임시 비밀번호 : ${responseVerify.result.temporaryPassword}`,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "로그인 페이지로 이동",
        }).then(() => {
          navigate("/login");
        });
      }
    } catch (error) {
      console.error("Error during auth code verification:", error);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <div>
        <h1 className="flex justify-center mb-10 text-3xl font-bold text-gray-700">
          비밀번호 초기화
        </h1>

        {!showVerification ? (
          <form
            className="p-5 bg-white rounded shadow-lg"
            onSubmit={handleRequestReset}
            noValidate
          >
            <label
              className="block mb-2 text-sm font-bold text-gray-700 text-left"
              htmlFor="userId"
            >
              아이디
            </label>
            <input
              id="userId"
              type="text"
              placeholder="아이디를 입력해주세요."
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-3 py-2 mb-4 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            />

            <label
              className="block mb-2 text-sm font-bold text-gray-700 text-left"
              htmlFor="userEmail"
            >
              이메일
            </label>
            <input
              id="userEmail"
              type="email"
              placeholder="이메일을 입력해주세요."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mb-4 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            />

            {errorReset && <p className="text-red-500">{errorReset}</p>}
            <div className="flex justify-center">
              <button
                type="submit"
                className={`w-[100px] px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline ${
                  loadingReset ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loadingReset}
              >
                요청
              </button>
            </div>
          </form>
        ) : (
          <form
            className="p-5 bg-white rounded shadow-lg"
            onSubmit={handleVerifyAuthCode}
            noValidate
          >
            <label
              className="block mb-2 text-sm font-bold text-gray-700 text-left"
              htmlFor="authCode"
            >
              인증 코드
            </label>
            <input
              id="authCode"
              type="text"
              placeholder="이메일로 받은 인증 코드를 입력해주세요."
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              className="w-full px-3 py-2 mb-4 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            />

            {errorVerify && <p className="text-red-500">{errorVerify}</p>}
            <div className="flex justify-center">
              <button
                type="submit"
                className={`w-[100px] px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline ${
                  loadingVerify ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loadingVerify}
              >
                확인
              </button>
            </div>
          </form>
        )}
        <p className="mt-4">인증 코드를 3분 이내로 입력해 주세요!</p>
      </div>
    </main>
  );
}
