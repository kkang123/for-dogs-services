import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import { UserFindId } from "@/hooks/useFindId";

import { FindId } from "@/interface/userFindId";

export default function FindID() {
  const [userData, setUserData] = useState<FindId>({
    userName: "",
    userBirthDate: "",
    userEmailId: "",
    userEmailDomain: "",
  });
  const [email, setEmail] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const [emailId, emailDomain] = email.split("@");

    const submitData = {
      ...userData,
      userBirthDate: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
      emailId,
      userEmailId: emailId,
      userEmailDomain: emailDomain,
    };

    try {
      await UserFindId(submitData);
      navigate("/login");
    } catch (error) {
      console.error("회원가입 중 에러 발생:", error);
    }
  };

  return (
    <>
      <header></header>

      <main className="flex flex-col items-center justify-center h-screen some-element">
        <div>
          <h1 className="flex justify-center mb-10 text-3xl font-bold text-gray-700">
            아이디 찾기
          </h1>
          <form
            className="p-5 bg-white rounded shadow-lg"
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

            <div className="flex justify-center">
              <button
                type="submit"
                className="w-[100px] px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline"
              >
                완료
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
