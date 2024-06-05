// import axios, { AxiosRequestConfig } from "axios";
// import Cookies from "js-cookie";

// export const BASE_URL = "http://52.78.79.44/";

// // 기본 axios 인스턴스 생성
// export const basicAxios = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // 엑세스 토큰으로 API 호출
// export const fetchWithAccessToken = async (
//   endpoint: string,
//   options: AxiosRequestConfig = {}
// ) => {
//   try {
//     let accessToken = localStorage.getItem("AccessToken");
//     const expiration = localStorage.getItem("AccessTokenExpiration");

//     // AccessToken과 만료 시간 확인
//     console.log("AccessToken:", accessToken);
//     console.log("Expiration:", expiration);

//     if (!accessToken || !expiration || Date.now() > parseInt(expiration)) {
//       // 만료된 토큰이거나 토큰이 없는 경우, 새로운 액세스 토큰을 얻기 위해 리프레시 토큰을 사용하여 재발급 요청을 보냅니다.
//       accessToken = await refreshTokenAndRetryRequest(endpoint, options);
//     }

//     const response = await basicAxios.request({
//       ...options,
//       url: endpoint,
//       headers: {
//         Authorization: `Bearer ${accessToken}`, // 요청 헤더에 엑세스 토큰을 추가합니다.
//         ...options.headers,
//       },
//     });

//     // 실제로 반환할 데이터가 있는지 확인 후 반환합니다.
//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.error("An axios error occurred:", error.response?.data);
//       // 엑세스 토큰 만료 등의 에러 처리
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
//       throw new Error("No refreshToken found");
//     }

//     const accessToken = localStorage.getItem("AccessToken");
//     if (!accessToken) {
//       throw new Error("No accessToken found");
//     }

//     const response = await basicAxios.post(
//       "/users/refresh-token",
//       { refreshToken },
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`, // 헤더에 기존 액세스 토큰을 추가합니다.
//         },
//       }
//     );

//     const { accessToken: newAccessToken } = response.data.result;
//     localStorage.setItem("AccessToken", newAccessToken); // 새 엑세스 토큰을 localStorage에 저장합니다.

//     console.log("엑세스 토큰 재발급:", newAccessToken);

//     // 재발급된 새로운 액세스 토큰을 사용하여 원래 요청을 재시도합니다.
//     const newOptions = {
//       ...options,
//       headers: {
//         ...options.headers,
//         Authorization: `Bearer ${newAccessToken}`, // 재발급된 새로운 액세스 토큰을 요청 헤더에 추가합니다.
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

// 2

// import axios, { AxiosRequestConfig } from "axios";
// import Cookies from "js-cookie";

// export const BASE_URL = "http://52.78.79.44/";

// // 기본 axios 인스턴스 생성
// export const basicAxios = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // 엑세스 토큰으로 API 호출
// export const fetchWithAccessToken = async (
//   endpoint: string,
//   options: AxiosRequestConfig = {}
// ) => {
//   try {
//     let accessToken = localStorage.getItem("AccessToken");
//     const expiration = localStorage.getItem("AccessTokenExpiration");

//     console.log("AccessToken:", accessToken);
//     console.log("Expiration:", expiration);

//     if (!accessToken || !expiration || Date.now() > parseInt(expiration)) {
//       accessToken = await refreshTokenAndRetryRequest(endpoint, options);
//     }

//     const response = await basicAxios.request({
//       ...options,
//       url: endpoint,
//       headers: {
//         Authorization: `Bearer ${accessToken}`, // 요청 헤더에 엑세스 토큰을 추가합니다.
//         ...options.headers,
//       },
//     });

//     // 실제로 반환할 데이터가 있는지 확인 후 반환합니다.
//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.error("An axios error occurred:", error.response?.data);
//       // 엑세스 토큰 만료 등의 에러 처리
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
//       throw new Error("No refreshToken found");
//     }

//     const response = await basicAxios.post(
//       "/users/refresh-token",
//       { refreshToken },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const newAccessToken = response.data.result.accessToken;
//     localStorage.setItem("AccessToken", newAccessToken); // 새 엑세스 토큰을 localStorage에 저장합니다.

//     console.log("새로운 액세스 토큰 발급:", newAccessToken); // 새로운 액세스 토큰을 콘솔에 출력합니다.
//     console.log("엑세스 토큰 재발급:", newAccessToken);

//     // 재발급된 새로운 액세스 토큰을 사용하여 원래 요청을 재시도합니다.
//     const newOptions = {
//       ...options,
//       headers: {
//         ...options.headers,
//         Authorization: `Bearer ${newAccessToken}`, // 재발급된 새로운 액세스 토큰을 요청 헤더에 추가합니다.
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

//3

// import axios, { AxiosRequestConfig } from "axios";
// import Cookies from "js-cookie";

// export const BASE_URL = "http://52.78.79.44/";

// // 기본 axios 인스턴스 생성
// export const basicAxios = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // 엑세스 토큰으로 API 호출
// export const fetchWithAccessToken = async (
//   endpoint: string,
//   options: AxiosRequestConfig = {}
// ) => {
//   try {
//     let accessToken = localStorage.getItem("AccessToken");
//     const expiration = localStorage.getItem("AccessTokenExpiration");

//     console.log("AccessToken:", accessToken);
//     console.log("Expiration:", expiration);

//     if (!accessToken || !expiration || Date.now() > parseInt(expiration)) {
//       // 만료된 토큰이거나 토큰이 없는 경우, 새로운 액세스 토큰을 얻기 위해 리프레시 토큰을 사용하여 재발급 요청을 보냅니다.
//       accessToken = await refreshTokenAndRetryRequest(endpoint, options);
//     }

//     const response = await basicAxios.request({
//       ...options,
//       url: endpoint,
//       headers: {
//         Authorization: `Bearer ${accessToken}`, // 요청 헤더에 엑세스 토큰을 추가합니다.
//         ...options.headers,
//       },
//     });

//     // 실제로 반환할 데이터가 있는지 확인 후 반환합니다.
//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.error("An axios error occurred:", error.response?.data);
//       // 엑세스 토큰 만료 등의 에러 처리
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
//       throw new Error("No refreshToken found");
//     }

//     const response = await basicAxios.post(
//       "/users/refresh",
//       { refreshToken },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const newAccessToken = response.data.result.accessToken;
//     const expiresIn = response.data.result.expiresIn; // 새로운 액세스 토큰의 만료 시간
//     const newExpiration = (Date.now() + expiresIn * 1000).toString(); // expiresIn을 밀리초 단위로 변환하여 현재 시간에 더해 새로운 만료 시간을 계산 후 문자열로 변환

//     localStorage.setItem("AccessToken", newAccessToken); // 새 엑세스 토큰을 localStorage에 저장합니다.
//     localStorage.setItem("AccessTokenExpiration", newExpiration); // 새 엑세스 토큰의 만료 시간을 localStorage에 저장합니다.

//     console.log("새로운 액세스 토큰 발급:", newAccessToken); // 새로운 액세스 토큰을 콘솔에 출력합니다.
//     console.log("엑세스 토큰 재발급:", newAccessToken);

//     // 재발급된 새로운 액세스 토큰을 사용하여 원래 요청을 재시도합니다.
//     const newOptions = {
//       ...options,
//       headers: {
//         ...options.headers,
//         Authorization: `Bearer ${newAccessToken}`, // 재발급된 새로운 액세스 토큰을 요청 헤더에 추가합니다.
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

//4

// import axios, { AxiosRequestConfig } from "axios";
// import Cookies from "js-cookie";

// export const BASE_URL = "http://52.78.79.44/";

// // 기본 axios 인스턴스 생성
// export const basicAxios = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // 액세스 토큰이 만료되었는지 확인하는 함수
// const isAccessTokenExpired = () => {
//   const expiration = localStorage.getItem("AccessTokenExpiration");
//   if (!expiration) {
//     return true;
//   }
//   return Date.now() > parseInt(expiration);
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

//     const response = await basicAxios.post(
//       "/users/refresh",
//       { refreshToken },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
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

import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

export const BASE_URL = "http://52.78.79.44/";

// 기본 axios 인스턴스 생성
export const basicAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키를 포함하도록 설정
});

// 액세스 토큰이 만료되었는지 확인하는 함수
const isAccessTokenExpired = () => {
  const expiration = localStorage.getItem("AccessTokenExpiration");
  if (!expiration) {
    return true;
  }
  return Date.now() > parseInt(expiration);
};

// 엑세스 토큰으로 API 호출
export const fetchWithAccessToken = async (
  endpoint: string,
  options: AxiosRequestConfig = {}
) => {
  try {
    let accessToken = localStorage.getItem("AccessToken");

    console.log("AccessToken:", accessToken);
    console.log("Expiration:", localStorage.getItem("AccessTokenExpiration"));

    if (!accessToken || isAccessTokenExpired()) {
      // 토큰이 없거나 만료된 경우 새로운 액세스 토큰을 얻기 위해 리프레시 토큰을 사용하여 재발급 요청을 보냅니다.
      accessToken = await refreshTokenAndRetryRequest(endpoint, options);
    }

    const response = await basicAxios.request({
      ...options,
      url: endpoint,
      headers: {
        Authorization: `Bearer ${accessToken}`, // 요청 헤더에 액세스 토큰을 추가
        ...options.headers,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("An axios error occurred:", error.response?.data);
      if (error.response?.status === 401) {
        // 엑세스 토큰이 만료되었거나 유효하지 않을 때
        return await refreshTokenAndRetryRequest(endpoint, options);
      }
    } else {
      console.error("An unexpected error occurred:", error);
    }
    throw error; // 에러를 호출한 쪽에서 처리하도록 던집니다.
  }
};

// 리프레시 토큰으로 새 엑세스 토큰을 얻고 원래 요청을 재시도
export const refreshTokenAndRetryRequest = async (
  endpoint: string,
  options: AxiosRequestConfig
) => {
  try {
    const refreshToken = Cookies.get("REFRESH_TOKEN");
    if (!refreshToken) {
      throw new Error("No refresh token found");
    }

    const currentAccessToken = localStorage.getItem("AccessToken");
    if (!currentAccessToken) {
      throw new Error("No access token found");
    }

    console.log("Sending refresh request with token:", refreshToken);

    const response = await basicAxios.post(
      "/users/refresh",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentAccessToken}`, // 기존 액세스 토큰을 Authorization 헤더에 추가
        },
        withCredentials: true, // 쿠키를 포함하도록 설정
      }
    );

    const newAccessToken = response.data.result.accessToken;
    const expiresIn = response.data.result.expiresIn; // 새로운 액세스 토큰의 만료 시간 (초 단위)
    const newExpiration = (Date.now() + expiresIn * 1000).toString(); // 밀리초 단위로 변환 후 현재 시간에 더해 만료 시간을 계산

    localStorage.setItem("AccessToken", newAccessToken); // 새 액세스 토큰을 localStorage에 저장
    localStorage.setItem("AccessTokenExpiration", newExpiration); // 새 액세스 토큰의 만료 시간을 localStorage에 저장

    console.log("새로운 액세스 토큰 발급:", newAccessToken);

    // 재발급된 새로운 액세스 토큰을 사용하여 원래 요청을 재시도
    const newOptions = {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${newAccessToken}`, // 새로운 액세스 토큰을 요청 헤더에 추가
      },
    };
    return await basicAxios
      .request({ url: endpoint, ...newOptions })
      .then((response) => response.data);
  } catch (error) {
    console.error(
      "토큰을 새로고침하거나 요청을 재시도하는 동안 오류가 발생했습니다.",
      error
    );
    throw error;
  }
};
