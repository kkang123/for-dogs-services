import axios from "axios";

export const BASE_URL = "http://43.203.202.152/";

// 기본 axios 인스턴스 생성
export const basicAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 엑세스 토큰으로 API 호출
export const fetchWithAccessToken = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken"); // 엑세스 토큰을 localStorage에서 가져옵니다.
    const response = await basicAxios.get("/some-protected-route", {
      headers: {
        Authorization: `Bearer ${accessToken}`, // 요청 헤더에 엑세스 토큰을 추가합니다.
      },
    });
    console.log(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("An axios error occurred:", error.response?.data);
      // 엑세스 토큰 만료 등의 에러 처리
      if (error.response?.status === 401) {
        // 엑세스 토큰이 만료되었거나 유효하지 않을 때
        await refreshTokenAndRetryRequest();
      }
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
};

// 리프레시 토큰으로 새 엑세스 토큰을 얻고 원래 요청을 재시도
const refreshTokenAndRetryRequest = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await basicAxios.post("/refresh-token", { refreshToken });
    const { accessToken } = response.data;
    localStorage.setItem("accessToken", accessToken); // 새 엑세스 토큰을 localStorage에 저장합니다.
    // 원래 요청을 재시도합니다.
    await fetchWithAccessToken();
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "An axios error occurred while refreshing token:",
        error.response?.data
      );
    } else {
      console.error(
        "An unexpected error occurred while refreshing token:",
        error
      );
    }
    // 여기에서 로그인 페이지로 리디렉션하거나 로그아웃 처리를 할 수 있습니다.
  }
};
