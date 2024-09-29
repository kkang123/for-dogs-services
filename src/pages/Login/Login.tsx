import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import SEOMetaTag from "@/components/SEOMetaTag";
import { useLogin } from "@/hooks/useLogin";
import useOAuth2 from "@/hooks/useOAuth2";

export default function SignIn() {
  const [userId, setUserId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [tab, setTab] = useState<"BUYER" | "SELLER">("BUYER");
  const location = useLocation();

  const { login } = useLogin();

  const [passwordShown, setPasswordShown] = useState<boolean>(false);

  const {
    startOAuth2Flow: startGoogleLogin,
    loading: googleLoading,
    error: googleError,
  } = useOAuth2("google");
  const {
    startOAuth2Flow: startKakaoLogin,
    loading: kakaoLoading,
    error: kakaoError,
  } = useOAuth2("kakao");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login({ userId, userPassword: password, userRole: tab });
    } catch (error) {
      console.log(error);
    }
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "userId") {
      setUserId(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const buyersignUp = (event: FormEvent) => {
    event.preventDefault();
    navigate("/buyersignup");
  };
  const sellersignUp = (event: FormEvent) => {
    event.preventDefault();
    navigate("/sellersignup");
  };

  const findId = (event: FormEvent) => {
    event.preventDefault();
    navigate("/findID");
  };

  const findPw = (event: FormEvent) => {
    event.preventDefault();
    navigate("/findPassword");
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sessionExpired = queryParams.get("sessionExpired");

    if (sessionExpired) {
      Swal.fire({
        icon: "warning",
        title: "세션 만료",
        text: "로그인 시간이 만료되었습니다. 다시 로그인해주세요.",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "확인",
      });
    }
  }, [location]);

  return (
    <>
      <header>
        <SEOMetaTag
          title="For Dogs - Login"
          description="로그인 페이지입니다."
        />
      </header>

      <main className="flex flex-col items-center justify-center h-screen some-element">
        <h2 className="mt-56 mb-0 text-3xl font-bold text-gray-700">Login</h2>

        <div className="m-auto mt-10">
          <div
            role="tablist"
            className="w-full"
            aria-label="구매자/판매자 로그인"
          >
            <button
              type="button"
              role="tab"
              className={`w-1/2 px-4 py-2 rounded-tl-lg ${
                tab === "BUYER"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
              aria-selected={tab === "BUYER"}
              onClick={() => setTab("BUYER")}
            >
              구매자
            </button>
            <button
              type="button"
              role="tab"
              className={`w-1/2 px-4 py-2 rounded-tr-lg ${
                tab === "SELLER"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
              aria-selected={tab === "SELLER"}
              onClick={() => setTab("SELLER")}
            >
              판매자
            </button>
          </div>

          {tab === "BUYER" ? (
            <form
              className="p-5 bg-white rounded-b-lg shadow-lg w-full noValidate"
              onSubmit={handleSubmit}
            >
              <div className="mb-4">
                <label
                  className="block mb-2 text-sm font-bold text-gray-700 text-left"
                  htmlFor="userId"
                >
                  아이디
                </label>
                <input
                  id="userId"
                  className="w-full px-3 py-2  text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  type="text"
                  value={userId}
                  name="userId"
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="아이디를 입력해주세요."
                ></input>
              </div>
              <div className="mb-6">
                <label
                  className="block mb-2 text-sm font-bold text-gray-700 text-left"
                  htmlFor="password"
                >
                  비밀번호
                </label>
                <div className="relative">
                  <input
                    className="w-full px-3 py-2 pr-32 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    aria-hidden={!passwordShown}
                    id="password"
                    type={passwordShown ? "text" : "password"}
                    value={password}
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력해주세요."
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-4 py-2 text-xs leading-tight text-gray-700 bg-transparent border-none cursor-pointer focus:outline-none"
                    onClick={togglePasswordVisibility}
                  >
                    {passwordShown ? "비밀번호 숨기기" : "비밀번호 표시하기"}
                  </button>
                </div>
              </div>

              <div className="w-full flex flex-nowrap justify-center gap-10 ">
                <button
                  className="w-[100px] px-4 py-2 mt-5 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  로그인
                </button>
                <button
                  className=" w-[100px] px-4 py-2 mt-5 font-bold text-gray-700 bg-gray-300 rounded hover:bg-gray-500 focus:outline-none focus:shadow-outline"
                  onClick={buyersignUp}
                  type="button"
                >
                  회원가입
                </button>
              </div>
            </form>
          ) : (
            <form
              className="p-5 bg-white rounded-b-lg shadow-lg w-full"
              onSubmit={handleSubmit}
            >
              <div className="mb-4">
                <label
                  className="block mb-2 text-sm font-bold text-gray-700 text-left"
                  htmlFor="userId"
                >
                  아이디
                </label>
                <input
                  id="userId"
                  className="w-full px-3 py-2  text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  type="text"
                  value={userId}
                  name="userId"
                  onChange={onChange}
                  placeholder="아이디를 입력해주세요."
                ></input>
              </div>
              <div className="mb-6">
                <label
                  className="block mb-2 text-sm font-bold text-gray-700 text-left"
                  htmlFor="password"
                >
                  비밀번호
                </label>
                <div className="relative">
                  <input
                    className="w-full px-3 py-2 pr-32 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    aria-hidden={!passwordShown}
                    id="password"
                    type={passwordShown ? "text" : "password"}
                    value={password}
                    name="password"
                    onChange={onChange}
                    placeholder="비밀번호를 입력해주세요."
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-4 py-2 text-xs leading-tight text-gray-700 bg-transparent border-none cursor-pointer focus:outline-none"
                    onClick={togglePasswordVisibility}
                  >
                    {passwordShown ? "비밀번호 숨기기" : "비밀번호 표시하기"}
                  </button>
                </div>
              </div>

              <div className="w-full flex flex-nowrap justify-center gap-10 ">
                <button
                  className="w-[100px] px-4 py-2 mt-5 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  로그인
                </button>
                <button
                  className=" w-[100px] px-4 py-2 mt-5 font-bold text-gray-700 bg-gray-300 rounded hover:bg-gray-500 focus:outline-none focus:shadow-outline"
                  onClick={sellersignUp}
                  type="button"
                >
                  회원가입
                </button>
              </div>
            </form>
          )}

          {tab === "BUYER" && (
            <>
              {/* 구글 로그인 */}
              <div>
                <button
                  onClick={startGoogleLogin}
                  className="mt-6 p-2 w-full flex justify-center border-2 border-blue-300 rounded-lg hover:bg-blue-300"
                  aria-label="Google로 로그인"
                  disabled={googleLoading}
                >
                  {googleLoading
                    ? "Google 계정으로 로그인 중..."
                    : "Google 로그인"}
                </button>
                {googleError && <p style={{ color: "red" }}>{googleError}</p>}
              </div>

              {/* 카카오 로그인 */}
              <div>
                <button
                  onClick={startKakaoLogin}
                  className="mt-2 p-2 w-full flex justify-center border-2 border-yellow-300 rounded-lg hover:bg-yellow-300"
                  aria-label="Kakao로 로그인"
                  disabled={kakaoLoading}
                >
                  {kakaoLoading
                    ? "KaKao 계정으로 로그인 중..."
                    : "Kakao 로그인"}
                </button>
                {kakaoError && <p style={{ color: "red" }}>{kakaoError}</p>}
              </div>
            </>
          )}

          <div className="flex items-center justify-around mt-4">
            <button
              className="relative text-base hover:scale-110 transform transition-transform duration-150 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:bg-transparent after:h-1 after:w-full after:scale-x-0 hover:after:scale-x-100 after:transition-all after:duration-200  after:border-b after:border-gray-800"
              onClick={findId}
            >
              아이디 찾기
            </button>

            <div className="relative after:content-[''] after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:bg-gray-300 after:h-6 after:w-[0.5px]"></div>

            <button
              className="relative text-base hover:scale-110 transform transition-transform duration-150 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:bg-transparent after:h-1 after:w-full after:scale-x-0 hover:after:scale-x-100 after:transition-all after:duration-200  after:border-b after:border-gray-800"
              onClick={findPw}
            >
              비밀번호 찾기
            </button>
          </div>

          <p className="mt-4 text-sm text-center">
            - 로그인과 회원가입 시 권한에 맞는 역할을 선택해주세요.
          </p>
        </div>
      </main>
    </>
  );
}
