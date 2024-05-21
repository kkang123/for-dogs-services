import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

export const BASE_URL = "http://52.78.79.44/";

// 기본 axios 인스턴스 생성
export const basicAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 엑세스 토큰으로 API 호출
export const fetchWithAccessToken = async (
  endpoint: string,
  options: AxiosRequestConfig = {}
) => {
  try {
    const accessToken = localStorage.getItem("accessToken"); // 엑세스 토큰을 localStorage에서 가져옵니다.
    const response = await basicAxios.request({
      ...options,
      url: endpoint,
      headers: {
        Authorization: `Bearer ${accessToken}`, // 요청 헤더에 엑세스 토큰을 추가합니다.
        ...options.headers,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("An axios error occurred:", error.response?.data);
      // 엑세스 토큰 만료 등의 에러 처리
      if (error.response?.status === 401) {
        // 엑세스 토큰이 만료되었거나 유효하지 않을 때
        await refreshTokenAndRetryRequest(endpoint, options);
      }
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
};

// 리프레시 토큰으로 새 엑세스 토큰을 얻고 원래 요청을 재시도
const refreshTokenAndRetryRequest = async (
  endpoint: string,
  options: AxiosRequestConfig
) => {
  try {
    const refreshToken = Cookies.get("refreshToken");
    const response = await basicAxios.post("/users/refresh-token", {
      refreshToken,
    });
    const { accessToken } = response.data;
    localStorage.setItem("accessToken", accessToken); // 새 엑세스 토큰을 localStorage에 저장합니다.
    console.log("엑세스 토큰 재발급:", accessToken);
    return await fetchWithAccessToken(endpoint, options); // 원래 요청을 재시도합니다.
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
    logout();
  }
};

// 로그아웃 처리 함수
const logout = () => {
  localStorage.removeItem("accessToken");
  Cookies.remove("refreshToken");
  // 로그아웃 후 리디렉션 등 추가적인 작업을 처리할 수 있습니다.
};
