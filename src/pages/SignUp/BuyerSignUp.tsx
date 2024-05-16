import React, { useState } from "react";
import { registerUser } from "@/api/signupApi";
import { User } from "@/interface/signup";

export default function BuyerSignUp() {
  const [userData, setUserData] = useState<User>({
    userId: "",
    userName: "",
    email: "",
    emailId: "",
    emailDomain: "",
    password: "",
    role: "BUYER",
  });

  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const [emailId, emailDomain] = userData.email.split("@");
    const submitData = {
      ...userData,
      emailId,
      emailDomain,
    };

    // 비밀번호와 비밀번호 확인이 일치하는지 검사
    if (userData.password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다. 다시 확인해주세요.");
      return; // 일치하지 않으면 함수 종료
    }

    try {
      await registerUser(submitData);
      alert("회원가입 성공!");
      // 성공 후 로그인 페이지나 메인 페이지로 리디렉션
    } catch (error) {
      console.error(error); // 콘솔에 오류 로그 출력
      alert("회원가입 실패. 다시 시도해주세요.");
    }
  };

  return (
    <>
      <header></header>
      <main className="flex flex-col items-center justify-center h-screen">
        <h2 className="mt-5 mb-2 text-3xl font-bold text-gray-700">
          구매자 회원가입
        </h2>
        <form
          className="p-5 bg-white rounded shadow-lg w-1/2"
          onSubmit={handleSubmit}
          noValidate
        >
          <label
            className="block mb-2 text-sm font-bold text-gray-700 text-left"
            htmlFor="nickname"
          >
            닉네임
          </label>
          <input
            id="nickname"
            type="text"
            placeholder="닉네임을 입력해주세요."
            value={userData.userName}
            onChange={(e) =>
              setUserData({ ...userData, userName: e.target.value })
            }
            className="w-full px-3 py-2 mb-4 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          />

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
            value={userData.userId}
            onChange={(e) =>
              setUserData({ ...userData, userId: e.target.value })
            }
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
            value={userData.emailId}
            onChange={(e) =>
              setUserData({ ...userData, emailId: e.target.value })
            }
            className="w-full px-3 py-2 mb-4 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          />

          <label
            className="block mb-2 text-sm font-bold text-gray-700 text-left"
            htmlFor="userPassword"
          >
            비밀번호
          </label>
          <input
            id="userPassword"
            type="password"
            placeholder="비밀번호를 입력해주세요."
            value={userData.password}
            onChange={(e) =>
              setUserData({ ...userData, password: e.target.value })
            }
            className="w-full px-3 py-2 mb-4 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          />

          <label
            className="block mb-2 text-sm font-bold text-gray-700 text-left"
            htmlFor="passwordConfirm"
          >
            비밀번호 확인
          </label>
          <input
            id="passwordConfirm"
            type="password"
            name="passwordConfirm"
            // value={passwordConfirm}
            // onChange={onChange}
            className="w-full px-3 py-2 mb-4 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            placeholder="비밀번호를 다시 입력해주세요."
          />

          <div className="flex justify-center">
            <button
              className="w-[100px] px-4 py-2 mt-5 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline "
              type="submit"
            >
              회원가입
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
