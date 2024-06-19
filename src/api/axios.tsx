// import axios, { AxiosRequestConfig } from "axios";
// import Cookies from "js-cookie";

// export const BASE_URL = "http://52.78.79.44/";

// // 기본 axios 인스턴스 생성
// export const basicAxios = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true, // 쿠키를 포함하도록 설정
// });

// // 액세스 토큰이 만료되었는지 확인하는 함수
// const isAccessTokenExpired = () => {
//   const expiration = localStorage.getItem("AccessTokenExpiration");
//   if (!expiration) {
//     return true;
//   }
//   return Date.now() > parseInt(expiration);
// };

// // 엑세스 토큰으로 API 호출
// export const fetchWithAccessToken = async (
//   endpoint: string,
//   options: AxiosRequestConfig = {}
// ) => {
//   try {
//     let accessToken = localStorage.getItem("AccessToken");

//     console.log("AccessToken:", accessToken);
//     console.log("Expiration:", localStorage.getItem("AccessTokenExpiration"));

//     if (!accessToken || isAccessTokenExpired()) {
//       // 토큰이 없거나 만료된 경우 새로운 액세스 토큰을 얻기 위해 리프레시 토큰을 사용하여 재발급 요청을 보냅니다.
//       accessToken = await refreshTokenAndRetryRequest(endpoint, options);
//     }

//     const response = await basicAxios.request({
//       ...options,
//       url: endpoint,
//       headers: {
//         Authorization: `Bearer ${accessToken}`, // 요청 헤더에 액세스 토큰을 추가
//         ...options.headers,
//       },
//     });

//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.error("An axios error occurred:", error.response?.data);
//       if (error.response?.status === 401) {
//         // 엑세스 토큰이 만료되었거나 유효하지 않을 때
//         return await refreshTokenAndRetryRequest(endpoint, options);
//       }
//     } else {
//       console.error("An unexpected error occurred:", error);
//     }
//     throw error; // 에러를 호출한 쪽에서 처리하도록 던집니다.
//   }
// };

// // 리프레시 토큰으로 새 엑세스 토큰을 얻고 원래 요청을 재시도
// export const refreshTokenAndRetryRequest = async (
//   endpoint: string,
//   options: AxiosRequestConfig
// ) => {
//   try {
//     const refreshToken = Cookies.get("REFRESH_TOKEN");
//     if (!refreshToken) {
//       throw new Error("No refresh token found");
//     }

//     const currentAccessToken = localStorage.getItem("AccessToken");
//     if (!currentAccessToken) {
//       throw new Error("No access token found");
//     }

//     console.log("Sending refresh request with token:", refreshToken);

//     const response = await basicAxios.post(
//       "/users/refresh",
//       {},
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${currentAccessToken}`, // 기존 액세스 토큰을 Authorization 헤더에 추가
//         },
//         withCredentials: true, // 쿠키를 포함하도록 설정
//       }
//     );

//     const newAccessToken = response.data.result.accessToken;
//     const expiresIn = response.data.result.expiresIn; // 새로운 액세스 토큰의 만료 시간 (초 단위)
//     const newExpiration = (Date.now() + expiresIn * 1000).toString(); // 밀리초 단위로 변환 후 현재 시간에 더해 만료 시간을 계산

//     localStorage.setItem("AccessToken", newAccessToken); // 새 액세스 토큰을 localStorage에 저장
//     localStorage.setItem("AccessTokenExpiration", newExpiration); // 새 액세스 토큰의 만료 시간을 localStorage에 저장

//     console.log("새로운 액세스 토큰 발급:", newAccessToken);

//     // 재발급된 새로운 액세스 토큰을 사용하여 원래 요청을 재시도
//     const newOptions = {
//       ...options,
//       headers: {
//         ...options.headers,
//         Authorization: `Bearer ${newAccessToken}`, // 새로운 액세스 토큰을 요청 헤더에 추가
//       },
//     };
//     return await basicAxios
//       .request({ url: endpoint, ...newOptions })
//       .then((response) => response.data);
//   } catch (error) {
//     console.error(
//       "토큰을 새로고침하거나 요청을 재시도하는 동안 오류가 발생했습니다.",
//       error
//     );
//     throw error;
//   }
// };

// 3

// import axios, { AxiosRequestConfig } from "axios";

// export const BASE_URL = "http://52.78.79.44/";

// // 기본 axios 인스턴스 생성
// export const basicAxios = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true, // 쿠키를 포함하도록 설정
// });

// // 엑세스 토큰으로 API 호출
// export const fetchWithAccessToken = async (
//   endpoint: string,
//   options: AxiosRequestConfig = {}
// ) => {
//   try {
//     const accessToken = localStorage.getItem("AccessToken");

//     if (!accessToken) {
//       throw new Error("No access token found");
//     }

//     const response = await basicAxios.request({
//       ...options,
//       url: endpoint,
//       headers: {
//         Authorization: `Bearer ${accessToken}`, // 요청 헤더에 액세스 토큰을 추가
//         ...options.headers,
//       },
//     });

//     return response.data;
//   } catch (error) {
//     console.error("An unexpected error occurred:", error);
//     throw error; // 에러를 호출한 쪽에서 처리하도록 던집니다.
//   }
// };

// 이미지 전송이 잘 되는 코드

// import axios, {
//   AxiosResponse,
//   AxiosError,
//   InternalAxiosRequestConfig,
// } from "axios";

// export const BASE_URL = " https://api.fordogs.store/";

// export const basicAxios = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true,
// });

// // 요청 인터셉터 추가
// basicAxios.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     const accessToken = localStorage.getItem("AccessToken");
//     if (accessToken && config.headers) {
//       (config.headers as Record<string, string | number | boolean>)[
//         "Authorization"
//       ] = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error: AxiosError) => {
//     return Promise.reject(error);
//   }
// );

// // 응답 인터셉터 추가
// basicAxios.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config as InternalAxiosRequestConfig & {
//       _retry?: boolean;
//     };
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const response = await basicAxios.post("/users/refresh");
//         const { accessToken } = response.data;
//         localStorage.setItem("AccessToken", accessToken);

//         // 재시도 전에 헤더 업데이트
//         originalRequest.headers.Authorization = `Bearer ${accessToken}`;
//         return basicAxios(originalRequest); // 요청 재시도
//       } catch (refreshError) {
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// // 액세스 토큰 만료 여부 확인
// const checkAccessTokenExpiration = () => {
//   const accessTokenExpiration = localStorage.getItem("AccessTokenExpiration");
//   if (
//     accessTokenExpiration &&
//     new Date().getTime() >= Number(accessTokenExpiration)
//   ) {
//     return true; // 액세스 토큰이 만료됨
//   }
//   return false; // 액세스 토큰이 유효함
// };

// basicAxios.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     if (checkAccessTokenExpiration()) {
//       // 액세스 토큰이 만료되었을 때 추가적인 동작이 필요할 경우 여기에 작성
//       console.log("Access token is expired.");
//     }
//     return config;
//   },
//   (error: AxiosError) => Promise.reject(error)
// );

// 불필요한 중복 코드 제거 및 인터셉터 응답 확인

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

// 액세스 토큰 만료 여부 확인 함수
const checkAccessTokenExpiration = () => {
  const accessTokenExpiration = localStorage.getItem("AccessTokenExpiration");
  if (
    accessTokenExpiration &&
    new Date().getTime() >= Number(accessTokenExpiration)
  ) {
    return true; // 액세스 토큰이 만료됨
  }
  return false; // 액세스 토큰이 유효함
};

// 요청 인터셉터 추가
basicAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log("Starting request:", config); // 요청 시작 로그 추가
    const accessToken = localStorage.getItem("AccessToken");

    if (checkAccessTokenExpiration()) {
      console.log("Access token is expired."); // 액세스 토큰 만료 로그 추가
    }

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    console.error("Request error:", error); // 요청 에러 로그 추가
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
basicAxios.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("Response received:", response); // 응답 로그 추가
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    console.error("Response error:", error); // 응답 에러 로그 추가

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        console.log("Attempting token refresh..."); // 토큰 갱신 시도 로그 추가
        const response = await basicAxios.post("/users/refresh");
        const { accessToken } = response.data;
        localStorage.setItem("AccessToken", accessToken);

        // 재시도 전에 헤더 업데이트
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return basicAxios(originalRequest); // 요청 재시도
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError); // 토큰 갱신 실패 로그 추가
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// test

// axios.tsx
// import axios, {
//   AxiosResponse,
//   AxiosError,
//   AxiosRequestConfig,
// } from "axios";

// export const BASE_URL = "https://api.fordogs.store/";

// export const basicAxios = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true,
// });

// basicAxios.interceptors.request.use(
//   (config: AxiosRequestConfig) => {
//     const accessToken = localStorage.getItem("AccessToken");
//     if (accessToken && config.headers) {
//       config.headers["Authorization"] = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error: AxiosError) => {
//     return Promise.reject(error);
//   }
// );

// basicAxios.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const response = await basicAxios.post("/users/refresh");
//         const { accessToken } = response.data;
//         localStorage.setItem("AccessToken", accessToken);
//         originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
//         return basicAxios(originalRequest); // retry the original request
//       } catch (refreshError) {
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// const checkAccessTokenExpiration = () => {
//   const accessTokenExpiration = localStorage.getItem("AccessTokenExpiration");
//   if (accessTokenExpiration && new Date().getTime() >= Number(accessTokenExpiration)) {
//     return true; // access token expired
//   }
//   return false; // access token valid
// };

// basicAxios.interceptors.request.use(
//   (config: AxiosRequestConfig) => {
//     if (checkAccessTokenExpiration()) {
//       console.log("Access token is expired.");
//       // Additional actions if access token is expired
//     }
//     return config;
//   },
//   (error: AxiosError) => Promise.reject(error)
// );
