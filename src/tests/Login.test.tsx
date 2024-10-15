import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import SignIn from "@/pages/Login/Login"; // 경로는 프로젝트 구조에 따라 조정하세요.
import { useLogin } from "@/hooks/useLogin";
import useOAuth2 from "@/hooks/useOAuth2";

// 테스트 목업 설정
jest.mock("@/hooks/useLogin");
jest.mock("@/hooks/useOAuth2");

const mockLogin = jest.fn();
(useLogin as jest.Mock).mockReturnValue({ login: mockLogin });
(useOAuth2 as jest.Mock).mockReturnValue({
  startOAuth2Flow: jest.fn(),
  loading: false,
  error: null,
});

describe("SignIn Component", () => {
  // 이 부분은 렌더링 테스트입니다.
  it("구매자/판매자 탭과 로그인 폼을 올바르게 렌더링해야 합니다.", () => {
    render(
      <HelmetProvider>
        <BrowserRouter>
          <SignIn />
        </BrowserRouter>
      </HelmetProvider>
    );

    expect(screen.getByText("구매자")).toBeInTheDocument();
    expect(screen.getByText("판매자")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("아이디를 입력해주세요.")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("비밀번호를 입력해주세요.")
    ).toBeInTheDocument();
  });

  // 이 부분은 상호작용 테스트입니다.
  it("구매자와 판매자 탭 전환이 제대로 작동해야 합니다.", () => {
    render(
      <HelmetProvider>
        <BrowserRouter>
          <SignIn />
        </BrowserRouter>
      </HelmetProvider>
    );

    const buyerTab = screen.getByText("구매자");
    const sellerTab = screen.getByText("판매자");

    fireEvent.click(sellerTab);
    expect(sellerTab).toHaveClass("bg-blue-500 text-white");
    expect(buyerTab).toHaveClass("bg-gray-300 text-gray-700");
  });

  // 이 부분은 폼 제출 및 로직 테스트입니다.
  it("로그인 버튼 클릭 시 login 함수가 호출되어야 합니다.", async () => {
    render(
      <HelmetProvider>
        <BrowserRouter>
          <SignIn />
        </BrowserRouter>
      </HelmetProvider>
    );

    const userIdInput = screen.getByPlaceholderText("아이디를 입력해주세요.");
    const passwordInput =
      screen.getByPlaceholderText("비밀번호를 입력해주세요.");
    const loginButton = screen.getByRole("button", { name: "로그인" });

    fireEvent.change(userIdInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        userId: "testuser",
        userPassword: "password",
        userRole: "BUYER",
      });
    });
  });

  // 이 부분은 경계 케이스 및 에러 처리 테스트입니다.
  it("세션 만료 시 경고창을 표시해야 합니다.", () => {
    const originalLocation = window.location;

    // window.location 객체를 재정의합니다.
    Object.defineProperty(window, "location", {
      value: { search: "?sessionExpired=true" },
      writable: true,
    });

    render(
      <HelmetProvider>
        <BrowserRouter>
          <SignIn />
        </BrowserRouter>
      </HelmetProvider>
    );

    expect(screen.getByText("세션 만료")).toBeInTheDocument();
    expect(
      screen.getByText("로그인 시간이 만료되었습니다. 다시 로그인해주세요.")
    ).toBeInTheDocument();

    // 테스트가 끝난 후 원래 location 객체로 복구합니다.
    Object.defineProperty(window, "location", {
      value: originalLocation,
    });
  });
});
