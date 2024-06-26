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
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    console.error("Response error:", error);

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
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
    return Promise.reject(error);
  }
);
