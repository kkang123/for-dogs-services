import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

export const BASE_URL = "https://api.fordogs.store/";

export const basicAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const checkAccessTokenExpiration = () => {
  const accessTokenExpiration = localStorage.getItem("AccessTokenExpiration");
  if (
    accessTokenExpiration &&
    new Date().getTime() >= Number(accessTokenExpiration)
  ) {
    return true;
  }
  return false;
};

const logout = () => {
  localStorage.removeItem("AccessToken");
  localStorage.removeItem("AccessTokenExpiration");
  window.location.href = "/login?sessionExpired=true";
};

let retryCount = 0;
const MAX_RETRIES = 1;

basicAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log("Starting request:", config);
    const accessToken = localStorage.getItem("AccessToken");

    if (checkAccessTokenExpiration()) {
      console.log("Access token is expired.");
    }

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

basicAxios.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("Response received:", response);
    retryCount = 0; // Reset retry count on a successful response
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    console.error("Response error:", error);

    const errorMessage = (
      error.response?.data as { error?: { message?: string } }
    )?.error?.message;
    console.log("Error message from response:", errorMessage); // 에러 메시지를 로그로 출력

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      retryCount < MAX_RETRIES
    ) {
      originalRequest._retry = true;
      retryCount += 1;
      try {
        console.log("Attempting token refresh...");
        const response = await basicAxios.post("/users/refresh");
        const { accessToken } = response.data;
        localStorage.setItem("AccessToken", accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return basicAxios(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    if (retryCount >= MAX_RETRIES) {
      if (
        error.response?.status === 401 &&
        errorMessage === "UUID 토큰 검증에 실패하였습니다."
      ) {
        console.error("Max retries reached. Logging out...");
        logout();
      }
    }

    if (
      error.response?.status === 401 &&
      errorMessage === "토큰 유효 기간이 만료되었습니다."
    ) {
      logout();
    }

    return Promise.reject(error);
  }
);
