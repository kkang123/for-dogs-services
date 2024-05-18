import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser } from "@/api/signupApi";
import { User } from "@/interface/signup";

import SEOMetaTag from "@/components/SEOMetaTag";

import Swal from "sweetalert2";

export default function BuyerSignUp() {
  const [userData, setUserData] = useState<User>({
    userId: "",
    userName: "",
    emailId: "",
    emailDomain: "",
    password: "",
    role: "SELLER",
  });

  const [email, setEmail] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const navigate = useNavigate();

  function validateNoConsecutiveChars(value: string) {
    for (let i = 0; i < value.length - 2; i++) {
      const current = value.charCodeAt(i);
      const next = value.charCodeAt(i + 1);
      const nextNext = value.charCodeAt(i + 2);

      if (
        (current + 1 === next && next + 1 === nextNext) ||
        (current - 1 === next && next - 1 === nextNext)
      ) {
        return false;
      }
    } // 연속된 문자 없으면 true 반환
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const [emailId, emailDomain] = email.split("@");
    const emailPrefix = emailId;
    const specialCharPattern = /[ !@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g;
    const upperCasePattern = /[A-Z]/;
    const lowerCasePattern = /[a-z]/;
    const numberPattern = /[0-9]/;
    const spacePattern = /\s/; // 공백 검사를 위한 패턴 추가
    const easyPasswords = ["123", "abc", "password", "qwerty", "1111"];

    let isValid = true;

    if (userData.password !== passwordConfirm) {
      Swal.fire(
        "비밀번호 불일치",
        "비밀번호가 일치하지 않습니다. 다시 확인해주세요.",
        "error"
      );
      return;
    }

    if (userData.password.length <= 10) {
      setPasswordMessage("비밀번호는 최소 10자리 이상이어야 합니다.");
      isValid = false;
    } else if (userData.password.length >= 16) {
      setPasswordMessage("비밀번호는 최대 16자리 이하이어야 합니다.");
      isValid = false;
    } else if (userData.password === email) {
      setPasswordMessage("비밀번호에 이메일을 사용할 수 없습니다.");
      isValid = false;
    } else if (userData.password.includes(emailPrefix)) {
      setPasswordMessage("비밀번호에 아이디값을 사용할 수 없습니다.");
      isValid = false;
    } else if (userData.password.match(spacePattern)) {
      setPasswordMessage("비밀번호에는 공백을 포함할 수 없습니다.");
      isValid = false;
    } else {
      if (
        [
          specialCharPattern,
          upperCasePattern,
          lowerCasePattern,
          numberPattern,
        ].filter((pattern) => userData.password.match(pattern)).length < 3
      ) {
        setPasswordMessage(
          "비밀번호는 영어 대문자/소문자, 숫자, 특수문자 중 3종류 이상의 문자 조합이어야 합니다."
        );
        isValid = false;
      } else if (!validateNoConsecutiveChars(userData.password)) {
        setPasswordMessage(
          "비밀번호는 연속되는 3자리 문자가 포함되지 않도록 입력해주세요."
        );
        isValid = false;
      } else if (
        easyPasswords.some((easyPassword) =>
          userData.password.includes(easyPassword)
        )
      ) {
        setPasswordMessage(
          "비밀번호에는 쉬운 문자열(ex :123, abc, password 등)이 포함되지 않아야 합니다."
        );
        isValid = false;
      }
    }

    if (!isValid) {
      Swal.fire("비밀번호 조건을 지켜주세요.", passwordMessage, "error");
      return;
    }

    const submitData = {
      ...userData,
      emailId,
      emailDomain,
    };

    try {
      await registerUser(submitData);
      Swal.fire("성공", "회원가입 성공!", "success");
      navigate("/login");
    } catch (error) {
      console.error("회원가입 중 에러 발생:", error);
    }
  };

  return (
    <>
      <header>
        <SEOMetaTag
          title="For Dogs - SellerSignUp"
          description="판매자 회원가입 페이지입니다."
        />
      </header>
      <main className="flex flex-col items-center justify-center h-screen">
        <h2 className="mt-5 mb-2 text-3xl font-bold text-gray-700">
          판매자 회원가입
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
            이름
          </label>
          <input
            id="nickname"
            type="text"
            placeholder="이름을 입력해주세요."
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
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
