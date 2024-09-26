import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { format } from "date-fns";
import Swal from "sweetalert2";

import SEOMetaTag from "@/components/SEOMetaTag";
import { registerUser } from "@/hooks/useSignUp";
import { Calendar } from "@/components/ui/calendar";

import { User } from "@/interface/user";

export default function BuyerSignUp() {
  const [userData, setUserData] = useState<User>({
    userId: "",
    userName: "",
    userBirthDate: "",
    userEmailId: "",
    userEmailDomain: "",
    userPassword: "",
    userRole: "BUYER",
  });

  const [email, setEmail] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [showPasswordRules, setShowPasswordRules] = useState(false);

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
    }
    return true;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const [emailId, emailDomain] = email.split("@");
    const emailPrefix = emailId;
    const specialCharPattern = /[ !@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g;
    const upperCasePattern = /[A-Z]/;
    const lowerCasePattern = /[a-z]/;
    const numberPattern = /[0-9]/;
    const spacePattern = /\s/;
    const easyPasswords = ["123", "abc", "password", "qwerty", "1111"];

    let isValid = true;

    if (userData.userPassword !== passwordConfirm) {
      Swal.fire({
        icon: "error",
        title: "비밀번호 불일치",
        text: "비밀번호가 일치하지 않습니다. 다시 확인해주세요.",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "확인",
      });
      return;
    }

    if (userData.userPassword.length <= 10) {
      setPasswordMessage("비밀번호는 최소 10자리 이상이어야 합니다.");
      isValid = false;
    } else if (userData.userPassword.length >= 16) {
      setPasswordMessage("비밀번호는 최대 16자리 이하이어야 합니다.");
      isValid = false;
    } else if (userData.userPassword.includes(emailPrefix)) {
      setPasswordMessage("비밀번호에 이메일을 사용할 수 없습니다.");
      isValid = false;
    } else if (userData.userPassword.includes(userData.userId)) {
      setPasswordMessage("비밀번호에 아이디값을 사용할 수 없습니다.");
      isValid = false;
    } else if (userData.userPassword.match(spacePattern)) {
      setPasswordMessage("비밀번호에는 공백을 포함할 수 없습니다.");
      isValid = false;
    } else {
      if (
        [
          specialCharPattern,
          upperCasePattern,
          lowerCasePattern,
          numberPattern,
        ].filter((pattern) => userData.userPassword.match(pattern)).length < 3
      ) {
        setPasswordMessage(
          "비밀번호는 영어 대문자/소문자, 숫자, 특수문자 중 3종류 이상의 문자 조합이어야 합니다."
        );
        isValid = false;
      } else if (!validateNoConsecutiveChars(userData.userPassword)) {
        setPasswordMessage(
          "비밀번호는 연속되는 3자리 문자가 포함되지 않도록 입력해주세요."
        );
        isValid = false;
      } else if (
        easyPasswords.some((easyPassword) =>
          userData.userPassword.includes(easyPassword)
        )
      ) {
        setPasswordMessage(
          "비밀번호에는 쉬운 문자열(ex :123, abc, password 등)이 포함되지 않아야 합니다."
        );
        isValid = false;
      }
    }

    if (!isValid) {
      setShowPasswordRules(true);
      Swal.fire({
        icon: "error",
        title: "비밀번호 조건을 지켜주세요.",
        text: passwordMessage,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "확인",
      });
      return;
    }

    const submitData = {
      ...userData,
      userBirthDate: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
      emailId,
      userEmailId: emailId,
      userEmailDomain: emailDomain,
    };

    try {
      await registerUser(submitData);
      Swal.fire({
        icon: "success",
        title: "성공",
        text: "회원가입 성공!",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "확인",
      });
      navigate("/login");
    } catch (error) {
      console.error("회원가입 중 에러 발생:", error);

      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.error?.message ||
          "회원가입 중 오류가 발생했습니다.";
        Swal.fire({
          icon: "error",
          title: "에러",
          text: errorMessage,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "확인",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "에러",
          text: "알 수 없는 오류가 발생했습니다.",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "확인",
        });
      }
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
      <main className="flex flex-col items-center justify-center overflow-y-auto min-h-screen some-element">
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
            htmlFor="birthDate"
          >
            생년월일
          </label>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => setSelectedDate(date)}
            className="rounded-md border mb-4"
            captionLayout="dropdown-buttons"
            fromYear={1940}
            toYear={2030}
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
            value={userData.userPassword}
            onChange={(e) =>
              setUserData({ ...userData, userPassword: e.target.value })
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

          {showPasswordRules && (
            <div className="mb-4 text-red-500">
              <p>비밀번호 조건:</p>
              <ul className="list-none pl-4">
                {[
                  "최소 10자 이상, 최대 16자 이하",
                  "연속된 3자리 이상의 문자(ex: 123, abc)나 쉬운 문자열(예: 123, abc, password 등)을 포함할 수 없습니다.",
                  "이메일 주소 또는 아이디 사용 금지",
                  "공백 포함 금지",
                  "영어 대문자/소문자, 숫자, 특수문자 중 3종류 이상 조합",
                ].map((rule, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">-</span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          )}

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
