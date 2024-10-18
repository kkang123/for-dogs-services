import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { RecoilRoot } from "recoil";

import SignIn from "@/pages/Login/Login";
import Home from "@/pages/home/home";
import { useLogin } from "@/hooks/useLogin";
import useOAuth2 from "@/hooks/useOAuth2";

// Mock hooks
vi.mock("@/hooks/useLogin");
vi.mock("@/hooks/useOAuth2");

// 스파이 함수 생성
const mockGoogleLogin = vi.fn();
const mockKakaoLogin = vi.fn();

const mockedUseNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual: typeof import("react-router-dom") = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockedUseNavigate,
    MemoryRouter: actual.MemoryRouter,
  };
});

describe("SignIn Component", () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    // useLogin Mock
    vi.mocked(useLogin).mockReturnValue({
      login: mockLogin,
    });

    // useOAuth2 모의 함수 설정
    (useOAuth2 as jest.Mock).mockImplementation((provider: string) => {
      return {
        startOAuth2Flow:
          provider === "kakao" ? mockKakaoLogin : mockGoogleLogin,
        loading: false,
        error: null,
      };
    });
  });

  it("비로그인 시 Link가 올바르게 렌더링되고 클릭 시 '/'로 이동해야 한다", () => {
    render(
      <HelmetProvider>
        <RecoilRoot>
          <MemoryRouter initialEntries={["/signin"]}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<SignIn />} />
            </Routes>
          </MemoryRouter>
        </RecoilRoot>
      </HelmetProvider>
    );

    fireEvent.click(screen.getByLabelText("메인페이지 이동"));
    expect(screen.getByText("For Dogs")).toBeInTheDocument();
  });

  it("세션 만료 시 경고창을 표시해야 합니다.", () => {
    window.history.pushState({}, "", "/login?sessionExpired=true");
    render(
      <HelmetProvider>
        <BrowserRouter>
          <SignIn />
        </BrowserRouter>
      </HelmetProvider>
    );
    expect(
      screen.getByText("로그인 시간이 만료되었습니다. 다시 로그인해주세요.")
    ).toBeInTheDocument();
  });

  it("구매자 탭 전환이 정상적으로 작동해야 합니다.", () => {
    render(
      <HelmetProvider>
        <BrowserRouter>
          <SignIn />
        </BrowserRouter>
      </HelmetProvider>
    );

    const buyerTab = screen.getByLabelText("구매자 탭");
    fireEvent.click(buyerTab);
    expect(buyerTab).toHaveAttribute("aria-selected", "true");
  });

  it("판매자 탭 전환이 정상적으로 작동해야 합니다.", () => {
    render(
      <HelmetProvider>
        <BrowserRouter>
          <SignIn />
        </BrowserRouter>
      </HelmetProvider>
    );

    const sellerTab = screen.getByLabelText("판매자 탭");
    fireEvent.click(sellerTab);
    expect(sellerTab).toHaveAttribute("aria-selected", "true");
  });

  it("비밀번호 표시/숨기기 기능이 작동해야 합니다.", () => {
    render(
      <HelmetProvider>
        <BrowserRouter>
          <SignIn />
        </BrowserRouter>
      </HelmetProvider>
    );

    const toggleButton = screen.getByLabelText("비밀번호 표시 여부 버튼");
    fireEvent.click(toggleButton);
    expect(toggleButton.textContent).toBe("비밀번호 숨기기");
  });

  it("로그인 버튼 클릭 시 login 함수가 호출되어야 합니다.", async () => {
    render(
      <HelmetProvider>
        <RecoilRoot>
          <BrowserRouter>
            <SignIn />
          </BrowserRouter>
        </RecoilRoot>
      </HelmetProvider>
    );

    fireEvent.change(screen.getByPlaceholderText("아이디를 입력해주세요."), {
      target: { value: "testUser" },
    });
    fireEvent.change(screen.getByPlaceholderText("비밀번호를 입력해주세요."), {
      target: { value: "test001!!@@" },
    });

    fireEvent.click(screen.getByLabelText("로그인"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        userId: "testUser",
        userPassword: "test001!!@@",
        userRole: "BUYER",
      });
    });
  });

  it("회원가입 버튼 클릭 시 페이지가 이동해야 합니다.", () => {
    render(
      <HelmetProvider>
        <BrowserRouter>
          <SignIn />
        </BrowserRouter>
      </HelmetProvider>
    );

    fireEvent.click(screen.getByLabelText("회원가입"));
    expect(mockedUseNavigate).toHaveBeenCalledWith("/buyersignup");
  });

  it("Google 로그인 버튼이 클릭되면 OAuth2 flow가 시작됩니다.", () => {
    render(
      <HelmetProvider>
        <BrowserRouter>
          <SignIn />
        </BrowserRouter>
      </HelmetProvider>
    );

    fireEvent.click(screen.getByLabelText("Google 로그인"));
    expect(mockGoogleLogin).toHaveBeenCalled();
  });

  it("Kakao 로그인 버튼이 클릭되면 OAuth2 flow가 시작됩니다.", () => {
    render(
      <HelmetProvider>
        <BrowserRouter>
          <SignIn />
        </BrowserRouter>
      </HelmetProvider>
    );

    fireEvent.click(screen.getByLabelText("Kakao 로그인"));
    expect(mockKakaoLogin).toHaveBeenCalled();
  });

  it("아이디 찾기 버튼을 클릭하면 이동합니다.", () => {
    render(
      <HelmetProvider>
        <BrowserRouter>
          <SignIn />
        </BrowserRouter>
      </HelmetProvider>
    );

    fireEvent.click(screen.getByText("아이디 찾기"));
    expect(mockedUseNavigate).toHaveBeenCalledWith("/findID");
  });

  it("비밀번호 찾기 버튼을 클릭하면 이동합니다.", () => {
    render(
      <HelmetProvider>
        <BrowserRouter>
          <SignIn />
        </BrowserRouter>
      </HelmetProvider>
    );

    fireEvent.click(screen.getByText("비밀번호 찾기"));
    expect(mockedUseNavigate).toHaveBeenCalledWith("/findPassword");
  });
});
