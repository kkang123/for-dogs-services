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
//     const accessToken = localStorage.getItem("AccessToken"); // 엑세스 토큰을 localStorage에서 가져옵니다.
//     const response = await basicAxios.request({
//       ...options,
//       url: endpoint,
//       headers: {
//         Authorization: `Bearer ${accessToken}`, // 요청 헤더에 엑세스 토큰을 추가합니다.
//         ...options.headers,
//       },
//     });
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
//     return await basicAxios.request({ url: endpoint, ...newOptions });
//   } catch (error) {
//     console.error(
//       "토큰을 새로고침하거나 요청을 재시도하는 동안 오류가 발생했습니다.",
//       error
//     );
//     throw error;
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
});

// 엑세스 토큰으로 API 호출
export const fetchWithAccessToken = async (
  endpoint: string,
  options: AxiosRequestConfig = {}
) => {
  try {
    const accessToken = localStorage.getItem("AccessToken"); // 엑세스 토큰을 localStorage에서 가져옵니다.

    // 만약 액세스 토큰이 없다면 바로 에러를 던집니다.
    if (!accessToken) {
      throw new axios.AxiosError("No AccessToken found", "401");
    }

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
      throw new Error("No refreshToken found");
    }

    const response = await basicAxios.post(
      "/users/refresh-token",
      { refreshToken },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const { accessToken: newAccessToken } = response.data.result;
    localStorage.setItem("AccessToken", newAccessToken); // 새 엑세스 토큰을 localStorage에 저장합니다.

    console.log("엑세스 토큰 재발급:", newAccessToken);

    // 재발급된 새로운 엑세스 토큰을 사용하여 원래 요청을 재시도합니다.
    const newOptions = {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${newAccessToken}`, // 재발급된 새로운 엑세스 토큰을 요청 헤더에 추가합니다.
      },
    };
    return await basicAxios.request({ url: endpoint, ...newOptions });
  } catch (error) {
    console.error(
      "토큰을 새로고침하거나 요청을 재시도하는 동안 오류가 발생했습니다.",
      error
    );
    throw error;
  }
};
