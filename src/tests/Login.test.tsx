import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import SignIn from "@/pages/Login/Login";
import { useLogin } from "@/hooks/useLogin";
import useOAuth2 from "@/hooks/useOAuth2";

// Mock hooks
jest.mock("@/hooks/useLogin");
jest.mock("@/hooks/useOAuth2");

const mockedUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUseNavigate,
}));

describe("SignIn Component", () => {
  const mockLogin = jest.fn();
  const mockGoogleLogin = jest.fn();
  const mockKakaoLogin = jest.fn();

  beforeEach(() => {
    (useLogin as jest.Mock).mockReturnValue({ login: mockLogin });
    (useOAuth2 as jest.Mock).mockImplementation((provider) => ({
      startOAuth2Flow: provider === "google" ? mockGoogleLogin : mockKakaoLogin,
      loading: false,
      error: null,
    }));
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
        <BrowserRouter>
          <SignIn />
        </BrowserRouter>
      </HelmetProvider>
    );

    fireEvent.change(screen.getByPlaceholderText("아이디를 입력해주세요."), {
      target: { value: "testUser" },
    });
    fireEvent.change(screen.getByPlaceholderText("비밀번호를 입력해주세요."), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByLabelText("로그인"));
    expect(mockLogin).toHaveBeenCalledWith({
      userId: "testUser",
      userPassword: "password123",
      userRole: "BUYER",
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

    fireEvent.click(screen.getByLabelText("Google 로그인")); // 구글 로그인 버튼을 찾아내줌
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

    // fireEvent.click(screen.getByRole("button", { name: "Kakao 로그인" }));
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
