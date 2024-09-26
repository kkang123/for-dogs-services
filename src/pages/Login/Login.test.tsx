// import { render, screen, fireEvent } from "@testing-library/react";
// import { BrowserRouter } from "react-router-dom"; // Router 관련 기능 사용
// import SignIn from "./Login"; // SignIn 컴포넌트 경로에 맞게 수정
// import { useLogin } from "@/hooks/useLogin"; // useLogin 훅을 가져옵니다.
// import { HelmetProvider } from "react-helmet-async";

// // useLogin 훅을 Mocking합니다.
// jest.mock("@/hooks/useLogin");

// describe("SignIn Component", () => {
//   const mockLogin = jest.fn();

//   beforeEach(() => {
//     (useLogin as jest.Mock).mockReturnValue({ login: mockLogin });
//     render(
//       <BrowserRouter>
//         <SignIn />
//       </BrowserRouter>
//     );
//   });

//   test("renders login form", () => {
//     expect(screen.getByText(/로그인/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/아이디/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/비밀번호/i)).toBeInTheDocument();
//     expect(screen.getByRole("button", { name: /로그인/i })).toBeInTheDocument();
//   });

//   test("updates userId and password on input change", () => {
//     const userIdInput = screen.getByLabelText(/아이디/i);
//     const passwordInput = screen.getByLabelText(/비밀번호/i);

//     fireEvent.change(userIdInput, { target: { value: "testUser" } });
//     fireEvent.change(passwordInput, { target: { value: "testPass" } });

//     expect(userIdInput).toHaveValue("testUser");
//     expect(passwordInput).toHaveValue("testPass");
//   });

//   test("calls login function with userId and password on form submit", async () => {
//     const userIdInput = screen.getByLabelText(/아이디/i);
//     const passwordInput = screen.getByLabelText(/비밀번호/i);
//     const loginButton = screen.getByRole("button", { name: /로그인/i });

//     fireEvent.change(userIdInput, { target: { value: "testUser" } });
//     fireEvent.change(passwordInput, { target: { value: "testPass" } });

//     fireEvent.click(loginButton);

//     expect(mockLogin).toHaveBeenCalledWith({
//       userId: "testUser",
//       userPassword: "testPass",
//       userRole: "BUYER", // 기본적으로 BUYER 탭이 선택되므로 이 값을 사용
//     });
//   });

//   test("shows password when toggle button is clicked", () => {
//     const passwordInput = screen.getByLabelText(/비밀번호/i);
//     const toggleButton = screen.getByRole("button", {
//       name: /비밀번호 표시하기/i,
//     });

//     fireEvent.click(toggleButton);

//     expect(passwordInput).toHaveAttribute("type", "text");
//     expect(toggleButton).toHaveTextContent("비밀번호 숨기기");
//   });

//   test("navigates to sign up page on 회원가입 button click", () => {
//     const buyersignUpButton = screen.getByRole("button", { name: /회원가입/i });

//     fireEvent.click(buyersignUpButton);

//     expect(window.location.href).toContain("/buyersignup");
//   });

//   // 추가 테스트: 아이디 찾기, 비밀번호 찾기 등...
//   test("navigates to find ID page on 아이디 찾기 button click", () => {
//     const findIdButton = screen.getByRole("button", { name: /아이디 찾기/i });

//     fireEvent.click(findIdButton);

//     expect(window.location.href).toContain("/findID");
//   });

//   test("navigates to find password page on 비밀번호 찾기 button click", () => {
//     const findPwButton = screen.getByRole("button", { name: /비밀번호 찾기/i });

//     fireEvent.click(findPwButton);

//     expect(window.location.href).toContain("/findPassword");
//   });
// });

// test("navigates to find password page on 비밀번호 찾기 button click", () => {
//   render(
//     <HelmetProvider>
//       <SignIn />
//     </HelmetProvider>
//   );
// });

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import SignIn from "./Login";
import { useLogin } from "@/hooks/useLogin";
import Swal from "sweetalert2";
import { HelmetProvider } from "react-helmet-async";

// 모의 함수를 정의합니다.
jest.mock("@/hooks/useLogin");
jest.mock("sweetalert2");

const mockLogin = jest.fn();
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("SignIn component", () => {
  beforeEach(() => {
    (useLogin as jest.Mock).mockReturnValue({ login: mockLogin });
  });

  test("renders the form with initial values", () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <SignIn />
        </MemoryRouter>
      </HelmetProvider>
    );

    // BUYER 탭이 기본값인지 확인
    expect(screen.getByText("BUYER")).toBeInTheDocument();
    // userId와 password 입력 필드가 있는지 확인
    expect(screen.getByPlaceholderText("User ID")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  test("handles form submission", async () => {
    render(
      <HelmetProvider>
        {" "}
        <MemoryRouter>
          <SignIn />
        </MemoryRouter>
      </HelmetProvider>
    );

    const userIdInput = screen.getByPlaceholderText("User ID");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByText("Sign In");

    // userId와 password 입력
    fireEvent.change(userIdInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(mockLogin).toHaveBeenCalledWith({
        userId: "testuser",
        userPassword: "password123",
        userRole: "BUYER",
      })
    );
  });

  test("toggles password visibility", () => {
    render(
      <HelmetProvider>
        {" "}
        {/* 추가된 부분 */}
        <MemoryRouter>
          <SignIn />
        </MemoryRouter>
      </HelmetProvider>
    );

    const passwordInput = screen.getByPlaceholderText("Password");
    const toggleButton = screen.getByText("Show Password");

    // 초기 상태는 비밀번호가 가려진 상태여야 함
    expect(passwordInput).toHaveAttribute("type", "password");

    // 버튼 클릭으로 비밀번호 보이기
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");

    // 다시 클릭하면 비밀번호 숨기기
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("navigates to sign up pages", () => {
    render(
      <HelmetProvider>
        {" "}
        {/* 추가된 부분 */}
        <MemoryRouter>
          <SignIn />
        </MemoryRouter>
      </HelmetProvider>
    );

    const buyerSignUpButton = screen.getByText("Buyer Sign Up");
    const sellerSignUpButton = screen.getByText("Seller Sign Up");

    // Buyer Sign Up 버튼 클릭
    fireEvent.click(buyerSignUpButton);
    expect(mockNavigate).toHaveBeenCalledWith("/buyersignup");

    // Seller Sign Up 버튼 클릭
    fireEvent.click(sellerSignUpButton);
    expect(mockNavigate).toHaveBeenCalledWith("/sellersignup");
  });

  test("shows session expired alert", () => {
    (Swal.fire as jest.Mock).mockResolvedValue({});

    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={["/signin?sessionExpired=true"]}>
          <Routes>
            <Route path="/signin" element={<SignIn />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );

    expect(Swal.fire).toHaveBeenCalledWith({
      title: "세션 만료",
      text: "로그인 시간이 만료되었습니다. 다시 로그인해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
  });
});
