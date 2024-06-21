// import { useEffect } from "react";
// import { useRecoilState } from "recoil";
// import { userState, isLoggedInState } from "@/recoil/userState";

// const useAuth = () => {
//   const [user, setUser] = useRecoilState(userState);
//   const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);

//   //   useEffect(() => {
//   //     const checkAuth = async () => {
//   //       const accessToken = localStorage.getItem("AccessToken");
//   //       const accessTokenExpiration = localStorage.getItem(
//   //         "AccessTokenExpiration"
//   //       );

//   //   if (
//   //     accessToken &&
//   //     accessTokenExpiration &&
//   //     new Date().getTime() < Number(accessTokenExpiration)
//   //   ) {
//   //     setIsLoggedIn(true);
//   //   } else {
//   // try {
//   //   const response = await basicAxios.post("/users/refresh");
//   //   const { accessToken } = response.data;
//   //   const newExpiration = new Date(accessToken.expiration).getTime();
//   //   localStorage.setItem("AccessToken", accessToken.value);
//   //   localStorage.setItem(
//   //     "AccessTokenExpiration",
//   //     newExpiration.toString()
//   //   );
//   //   setIsLoggedIn(true);
//   // } catch (error) {
//   // setIsLoggedIn(false);
//   // setUser({ isLoggedIn: false, userId: "", userRole: "" });
//   // localStorage.removeItem("user");
//   // localStorage.removeItem("AccessToken");
//   // localStorage.removeItem("AccessTokenExpiration");
//   // }
//   //   }
//   // };

//   //     checkAuth();
//   //   }, [setIsLoggedIn, setUser]);

//   return { user, isLoggedIn };
// };

// export default useAuth;

// 2

// import { useEffect } from "react";
// import { useRecoilState } from "recoil";
// import { userState, isLoggedInState } from "@/recoil/userState";
// import { useLogout } from "@/hooks/useLogout";
// import Cookies from "js-cookie";

// const useAuth = () => {
//   const [user, setUser] = useRecoilState(userState);
//   const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
//   const { logout } = useLogout();

//   useEffect(() => {
//     const checkAuth = () => {
//       const refreshToken = Cookies.get("REFRESH_TOKEN");

//       if (refreshToken) {
//         // 쿠키에 리프레시 토큰이 존재하면 로그인 상태로 설정
//         const storedUser = localStorage.getItem("user");
//         if (storedUser) {
//           const parsedUser = JSON.parse(storedUser);
//           const { userId, userRole } = parsedUser;

//           setUser({ isLoggedIn: true, userId, userRole });
//           setIsLoggedIn(true);
//           return;
//         }
//       }

//       // 쿠키에 리프레시 토큰이 없으면 로그아웃 처리
//       logout();
//     };

//     checkAuth();
//   }, [setIsLoggedIn, setUser]);

//   return { user, isLoggedIn };
// };

// export default useAuth;

// import { useEffect } from "react";
// import { useRecoilState } from "recoil";
// import { userState, isLoggedInState } from "@/recoil/userState";
// import { useLogout } from "@/hooks/useLogout";
// import Cookies from "js-cookie";
// import axios from "axios"; // HTTP 요청을 위한 axios

// const useAuth = () => {
//   const [user, setUser] = useRecoilState(userState);
//   const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
//   const { logout } = useLogout();

//   const refreshAccessToken = async () => {
//     try {
//       const response = await axios.post("/api/auth/refresh-token", {
//         token: Cookies.get("REFRESH_TOKEN"),
//       });

//       const { accessToken } = response.data;
//       localStorage.setItem("AccessToken", accessToken);
//       return accessToken;
//     } catch (error) {
//       console.error("Failed to refresh access token:", error);
//       logout();
//       return null;
//     }
//   };

//   useEffect(() => {
//     const checkAuth = async () => {
//       const refreshToken = Cookies.get("REFRESH_TOKEN");

//       if (refreshToken) {
//         const accessToken = localStorage.getItem("AccessToken");
//         if (!accessToken) {
//           // Access token이 없으면 refresh token으로 새로운 access token 발급 시도
//           const newAccessToken = await refreshAccessToken();
//           if (newAccessToken) {
//             setIsLoggedIn(true);
//           }
//         } else {
//           setIsLoggedIn(true);
//         }
//         const storedUser = localStorage.getItem("user");
//         if (storedUser) {
//           const parsedUser = JSON.parse(storedUser);
//           const { userId, userRole } = parsedUser;
//           setUser({ isLoggedIn: true, userId, userRole });
//         }
//         return;
//       }

//       logout();
//     };

//     checkAuth();

//     const interval = setInterval(() => {
//       checkAuth();
//     }, 15 * 60 * 1000); // 15분마다 토큰 갱신 시도

//     return () => clearInterval(interval);
//   }, [logout, setIsLoggedIn, setUser]);

//   return { user, isLoggedIn };
// };

// export default useAuth;

// import { useEffect } from "react";
// import { useRecoilState } from "recoil";
// import { userState, isLoggedInState } from "@/recoil/userState";
// import { useLogout } from "@/hooks/useLogout";
// import { basicAxios } from "@/api/axios";

// const useAuth = () => {
//   const [user, setUser] = useRecoilState(userState);
//   const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
//   const { logout } = useLogout();

//   const refreshAccessToken = async () => {
//     try {
//       const response = await basicAxios.post("/users/refresh");
//       const { accessToken } = response.data;
//       localStorage.setItem("AccessToken", accessToken);

//       // 액세스 토큰 만료 시간 갱신 (예시: 5분 후 만료)
//       const accessTokenExpiration = new Date().getTime() + 5 * 60 * 1000;
//       localStorage.setItem(
//         "AccessTokenExpiration",
//         accessTokenExpiration.toString()
//       );

//       return accessToken;
//     } catch (error) {
//       console.error("Failed to refresh access token:", error);
//       logout();
//       return null;
//     }
//   };

//   useEffect(() => {
//     const checkAuth = async () => {
//       const accessToken = localStorage.getItem("AccessToken");
//       const accessTokenExpiration = localStorage.getItem(
//         "AccessTokenExpiration"
//       );

//       if (accessToken && accessTokenExpiration) {
//         const now = new Date().getTime();
//         const expirationTime = Number(accessTokenExpiration);

//         if (now < expirationTime) {
//           // 액세스 토큰이 유효한 경우
//           setIsLoggedIn(true);
//           const storedUser = localStorage.getItem("user");
//           if (storedUser) {
//             const parsedUser = JSON.parse(storedUser);
//             setUser(parsedUser);
//           }

//           // 만료 시간까지 남은 시간 계산
//           const timeUntilExpiration = expirationTime - now;

//           // 예시: 만료 시간 5분 이내일 때만 토큰 갱신 시도
//           if (timeUntilExpiration < 5 * 60 * 1000) {
//             await refreshAccessToken();
//           }
//         } else {
//           // 액세스 토큰이 만료된 경우
//           const newAccessToken = await refreshAccessToken();
//           if (newAccessToken) {
//             setIsLoggedIn(true);
//           } else {
//             logout();
//           }
//         }
//       } else {
//         // 액세스 토큰이 없는 경우 (로그아웃 처리)
//         logout();
//       }
//     };

//     checkAuth();

//     // 초기 실행 후, 만료 시간까지 남은 시간을 고려하여 다음 갱신을 예약
//     const accessTokenExpiration = localStorage.getItem("AccessTokenExpiration");
//     if (accessTokenExpiration) {
//       const now = new Date().getTime();
//       const expirationTime = Number(accessTokenExpiration);
//       const timeUntilExpiration = expirationTime - now;

//       // 예시: 만료 시간 5분 이내일 때만 토큰 갱신 시도
//       if (timeUntilExpiration < 5 * 60 * 1000) {
//         const interval = setInterval(() => {
//           checkAuth();
//         }, timeUntilExpiration);

//         return () => clearInterval(interval);
//       }
//     }
//   }, [logout, setIsLoggedIn, setUser]);

//   return { user, isLoggedIn };
// };

// export default useAuth;

// 로그아웃까지는 제대로 되는 코드

// import { useEffect } from "react";
// import { useRecoilState } from "recoil";
// import { userState, isLoggedInState } from "@/recoil/userState";
// import { useLogout } from "@/hooks/useLogout";
// import { basicAxios } from "@/api/axios";
// import axios from "axios";

// const useAuth = () => {
//   const [user, setUser] = useRecoilState(userState);
//   const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
//   const { logout } = useLogout();

//   const refreshAccessToken = async () => {
//     try {
//       const response = await basicAxios.post("/users/refresh");
//       const { accessToken } = response.data;
//       localStorage.setItem("AccessToken", accessToken);

//       // 액세스 토큰 만료 시간 갱신 (예시: 5분 후 만료)
//       const accessTokenExpiration = new Date().getTime() + 5 * 60 * 1000;
//       localStorage.setItem(
//         "AccessTokenExpiration",
//         accessTokenExpiration.toString()
//       );

//       return accessToken;
//     } catch (error) {
//       console.error("Failed to refresh access token:", error);

//       if (axios.isAxiosError(error)) {
//         const response = error.response;
//         if (
//           response?.status === 400 &&
//           response.data?.error?.message ===
//             "refresh_token 필수 요청 쿠키가 누락되었습니다."
//         ) {
//           logout();
//         }
//       }

//       return null;
//     }
//   };

//   useEffect(() => {
//     const checkAuth = async () => {
//       const accessToken = localStorage.getItem("AccessToken");
//       const accessTokenExpiration = localStorage.getItem(
//         "AccessTokenExpiration"
//       );

//       if (accessToken && accessTokenExpiration) {
//         const now = new Date().getTime();
//         const expirationTime = Number(accessTokenExpiration);

//         if (now < expirationTime) {
//           // 액세스 토큰이 유효한 경우
//           setIsLoggedIn(true);
//           const storedUser = localStorage.getItem("user");
//           if (storedUser) {
//             const parsedUser = JSON.parse(storedUser);
//             setUser(parsedUser);
//           }

//           // 만료 시간까지 남은 시간 계산
//           const timeUntilExpiration = expirationTime - now;

//           // 만료 시간 5분 이내일 때만 토큰 갱신 시도
//           if (timeUntilExpiration < 5 * 60 * 1000) {
//             await refreshAccessToken();
//           }
//         } else {
//           // 액세스 토큰이 만료된 경우
//           const newAccessToken = await refreshAccessToken();
//           if (newAccessToken) {
//             setIsLoggedIn(true);
//           } else {
//             // logout(); // 새 액세스 토큰 갱신 실패 시 로그아웃
//           }
//         }
//       } else {
//         // 액세스 토큰이 없는 경우 (로그아웃 처리)
//         logout();
//       }
//     };

//     checkAuth();

//     // 초기 실행 후, 만료 시간까지 남은 시간을 고려하여 다음 갱신을 예약
//     const accessTokenExpiration = localStorage.getItem("AccessTokenExpiration");
//     if (accessTokenExpiration) {
//       const now = new Date().getTime();
//       const expirationTime = Number(accessTokenExpiration);
//       const timeUntilExpiration = expirationTime - now;

//       // 만료 시간 5분 이내일 때만 토큰 갱신 시도
//       if (timeUntilExpiration < 5 * 60 * 1000) {
//         const interval = setInterval(() => {
//           checkAuth();
//         }, timeUntilExpiration);

//         return () => clearInterval(interval);
//       }
//     }
//   }, [logout, setIsLoggedIn, setUser]);

//   return { user, isLoggedIn };
// };

// export default useAuth;

// 액세스 토큰 만료 여부를 확인하고 -> 무한루프 발생

// import { useEffect } from "react";
// import { useRecoilState } from "recoil";
// import { userState, isLoggedInState } from "@/recoil/userState";
// import { useLogout } from "@/hooks/useLogout";
// import { basicAxios } from "@/api/axios";
// import axios from "axios";

// const useAuth = () => {
//   const [user, setUser] = useRecoilState(userState);
//   const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
//   const { logout } = useLogout();

//   const refreshAccessToken = async () => {
//     try {
//       const response = await basicAxios.post("/users/refresh");
//       const { accessToken } = response.data;
//       localStorage.setItem("AccessToken", accessToken);

//       // 액세스 토큰 만료 시간 갱신 (예시: 5분 후 만료)
//       const accessTokenExpiration = new Date().getTime() + 5 * 60 * 1000;
//       localStorage.setItem(
//         "AccessTokenExpiration",
//         accessTokenExpiration.toString()
//       );

//       return accessToken;
//     } catch (error) {
//       console.error("Failed to refresh access token:", error);

//       if (axios.isAxiosError(error)) {
//         const response = error.response;
//         if (
//           response?.status === 400 &&
//           response.data?.error?.message ===
//             "refresh_token 필수 요청 쿠키가 누락되었습니다."
//         ) {
//           logout();
//         }
//       }

//       return null;
//     }
//   };

//   const checkAndRefreshToken = async () => {
//     const accessToken = localStorage.getItem("AccessToken");
//     const accessTokenExpiration = localStorage.getItem("AccessTokenExpiration");

//     if (accessToken && accessTokenExpiration) {
//       const now = new Date().getTime();
//       const expirationTime = Number(accessTokenExpiration);

//       if (now >= expirationTime) {
//         // 액세스 토큰이 만료된 경우 갱신 시도
//         const newAccessToken = await refreshAccessToken();
//         if (newAccessToken) {
//           setIsLoggedIn(true);
//         } else {
//           //   logout(); // 새 액세스 토큰 갱신 실패 시 로그아웃
//         }
//       }
//     } else {
//       logout(); // 액세스 토큰이 없는 경우 (로그아웃 처리)
//     }
//   };

//   useEffect(() => {
//     const accessToken = localStorage.getItem("AccessToken");
//     const accessTokenExpiration = localStorage.getItem("AccessTokenExpiration");

//     if (accessToken && accessTokenExpiration) {
//       const now = new Date().getTime();
//       const expirationTime = Number(accessTokenExpiration);

//       if (now < expirationTime) {
//         // 액세스 토큰이 유효한 경우
//         setIsLoggedIn(true);
//         const storedUser = localStorage.getItem("user");
//         if (storedUser) {
//           const parsedUser = JSON.parse(storedUser);
//           setUser(parsedUser);
//         }
//       } else {
//         // 액세스 토큰이 만료된 경우
//         checkAndRefreshToken();
//       }
//     } else {
//       // 액세스 토큰이 없는 경우 (로그아웃 처리)
//       logout();
//     }
//   }, [logout, setIsLoggedIn, setUser]);

//   return { user, isLoggedIn, checkAndRefreshToken };
// };

// export default useAuth;

// 2 -> 흰화면 모든 컴포넌트에서 출력되는 이상현상 발생

// import { useEffect, useMemo, useCallback } from "react";
// import { useRecoilState } from "recoil";
// import { userState, isLoggedInState } from "@/recoil/userState";
// import { useLogout } from "@/hooks/useLogout";
// import { basicAxios } from "@/api/axios";
// import axios from "axios";

// const useAuth = () => {
//   const [user, setUser] = useRecoilState(userState);
//   const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
//   const { logout } = useLogout();

//   const refreshAccessToken = useCallback(async () => {
//     try {
//       const response = await basicAxios.post("/users/refresh");
//       const { accessToken } = response.data;
//       localStorage.setItem("AccessToken", accessToken);

//       // 액세스 토큰 만료 시간 갱신 (예시: 5분 후 만료)
//       const accessTokenExpiration = new Date().getTime() + 5 * 60 * 1000;
//       localStorage.setItem(
//         "AccessTokenExpiration",
//         accessTokenExpiration.toString()
//       );

//       return accessToken;
//     } catch (error) {
//       console.error("Failed to refresh access token:", error);

//       if (axios.isAxiosError(error)) {
//         const response = error.response;
//         if (
//           response?.status === 400 &&
//           response.data?.error?.message ===
//             "refresh_token 필수 요청 쿠키가 누락되었습니다."
//         ) {
//           logout();
//         }
//       }

//       return null;
//     }
//   }, [logout]);

//   const checkAndRefreshToken = useMemo(
//     () => async () => {
//       const accessToken = localStorage.getItem("AccessToken");
//       const accessTokenExpiration = localStorage.getItem(
//         "AccessTokenExpiration"
//       );

//       if (accessToken && accessTokenExpiration) {
//         const now = new Date().getTime();
//         const expirationTime = Number(accessTokenExpiration);

//         if (now >= expirationTime) {
//           // 액세스 토큰이 만료된 경우 갱신 시도
//           const newAccessToken = await refreshAccessToken();
//           if (newAccessToken) {
//             setIsLoggedIn(true);
//           } else {
//             //   logout(); // 새 액세스 토큰 갱신 실패 시 로그아웃
//           }
//         }
//       } else {
//         logout(); // 액세스 토큰이 없는 경우 (로그아웃 처리)
//       }
//     },
//     [refreshAccessToken, logout, setIsLoggedIn]
//   );

//   useEffect(() => {
//     const accessToken = localStorage.getItem("AccessToken");
//     const accessTokenExpiration = localStorage.getItem("AccessTokenExpiration");

//     if (accessToken && accessTokenExpiration) {
//       const now = new Date().getTime();
//       const expirationTime = Number(accessTokenExpiration);

//       if (now < expirationTime) {
//         // 액세스 토큰이 유효한 경우
//         setIsLoggedIn(true);
//         const storedUser = localStorage.getItem("user");
//         if (storedUser) {
//           const parsedUser = JSON.parse(storedUser);
//           setUser(parsedUser);
//         }
//       } else {
//         // 액세스 토큰이 만료된 경우
//         checkAndRefreshToken();
//       }
//     } else {
//       // 액세스 토큰이 없는 경우 (로그아웃 처리)
//       logout();
//     }
//   }, [checkAndRefreshToken, logout, setIsLoggedIn, setUser]);

//   return { user, isLoggedIn, checkAndRefreshToken };
// };

// export default useAuth;

// 3 성공 -> 401 에러 발생

// import { useEffect, useMemo, useCallback } from "react";
// import { useRecoilState } from "recoil";
// import { userState, isLoggedInState } from "@/recoil/userState";
// import { useLogout } from "@/hooks/useLogout";
// import { basicAxios } from "@/api/axios";
// import axios from "axios";

// const useAuth = () => {
//   const [user, setUser] = useRecoilState(userState);
//   const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
//   const { logout } = useLogout();

//   const refreshAccessToken = useCallback(async () => {
//     try {
//       const response = await basicAxios.post("/users/refresh");
//       const { accessToken } = response.data;
//       localStorage.setItem("AccessToken", accessToken);

//       // 액세스 토큰 만료 시간 갱신 (예시: 5분 후 만료)
//       const accessTokenExpiration = new Date().getTime() + 5 * 60 * 1000;
//       localStorage.setItem(
//         "AccessTokenExpiration",
//         accessTokenExpiration.toString()
//       );

//       return accessToken;
//     } catch (error) {
//       console.error("Failed to refresh access token:", error);

//       if (axios.isAxiosError(error)) {
//         const response = error.response;
//         if (
//           response?.status === 400 &&
//           response.data?.error?.message ===
//             "refresh_token 필수 요청 쿠키가 누락되었습니다."
//         ) {
//           logout();
//         }
//       }

//       return null;
//     }
//   }, [logout]);

//   const checkAndRefreshToken = useMemo(
//     () => async () => {
//       const accessToken = localStorage.getItem("AccessToken");
//       const accessTokenExpiration = localStorage.getItem(
//         "AccessTokenExpiration"
//       );

//       if (accessToken && accessTokenExpiration) {
//         const now = new Date().getTime();
//         const expirationTime = Number(accessTokenExpiration);

//         if (now >= expirationTime) {
//           // 액세스 토큰이 만료된 경우 갱신 시도
//           const newAccessToken = await refreshAccessToken();
//           if (newAccessToken) {
//             setIsLoggedIn(true);
//           } else {
//             //   logout(); // 새 액세스 토큰 갱신 실패 시 로그아웃
//           }
//         }
//       } else {
//         logout(); // 액세스 토큰이 없는 경우 (로그아웃 처리)
//       }
//     },
//     [refreshAccessToken, logout, setIsLoggedIn]
//   );

//   useEffect(() => {
//     const checkTokenAndRefresh = async () => {
//       const accessToken = localStorage.getItem("AccessToken");
//       const accessTokenExpiration = localStorage.getItem(
//         "AccessTokenExpiration"
//       );

//       if (accessToken && accessTokenExpiration) {
//         const now = new Date().getTime();
//         const expirationTime = Number(accessTokenExpiration);

//         if (now < expirationTime) {
//           // 액세스 토큰이 유효한 경우
//           setIsLoggedIn(true);
//           const storedUser = localStorage.getItem("user");
//           if (storedUser) {
//             const parsedUser = JSON.parse(storedUser);
//             setUser(parsedUser);
//           }
//         } else {
//           // 액세스 토큰이 만료된 경우
//           await checkAndRefreshToken(); // 비동기 처리
//         }
//       } else {
//         // 액세스 토큰이 없는 경우 (로그아웃 처리)
//         logout();
//       }
//     };

//     checkTokenAndRefresh(); // 함수 호출

//     // useEffect의 의존성 배열은 비우지 않도록 주의하세요.
//     // 단, 빈 의존성 배열을 사용해야 할 때, [setUser, setIsLoggedIn, checkAndRefreshToken, logout]를 사용하십시오
//   }, []);

//   return { user, isLoggedIn, checkAndRefreshToken };
// };

// export default useAuth;

// console.log 찍기

// import { useEffect, useMemo, useCallback } from "react";
// import { useRecoilState } from "recoil";
// import { userState, isLoggedInState } from "@/recoil/userState";
// import { useLogout } from "@/hooks/useLogout";
// import { basicAxios } from "@/api/axios";
// import axios from "axios";

// const useAuth = () => {
//   const [user, setUser] = useRecoilState(userState);
//   const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
//   const { logout } = useLogout();

//   const refreshAccessToken = useCallback(async () => {
//     try {
//       console.log("Starting token refresh..."); // 추가된 로그
//       const response = await basicAxios.post("/users/refresh");
//       console.log("Refresh response:", response); // 추가된 로그

//       const { accessToken } = response.data;
//       localStorage.setItem("AccessToken", accessToken);

//       // 액세스 토큰 만료 시간 갱신 (예시: 5분 후 만료)
//       const accessTokenExpiration = new Date().getTime() + 5 * 60 * 1000;
//       localStorage.setItem(
//         "AccessTokenExpiration",
//         accessTokenExpiration.toString()
//       );

//       return accessToken;
//     } catch (error) {
//       console.error("액세스 토큰 갱신 실패:", error);

//       if (axios.isAxiosError(error)) {
//         const response = error.response;
//         console.log("Axios 오류 응답:", response); // 응답 로그 추가

//         if (
//           response?.status === 400 &&
//           response.data?.error?.message ===
//             "refresh_token 필수 요청 쿠키가 누락되었습니다."
//         ) {
//           logout();
//         } else if (response?.status === 401) {
//           console.log("Unauthorized 오류 응답:", response.data);
//         }
//       }

//       return null;
//     }
//   }, [logout]);

//   const checkAndRefreshToken = useMemo(
//     () => async () => {
//       const accessToken = localStorage.getItem("AccessToken");
//       const accessTokenExpiration = localStorage.getItem(
//         "AccessTokenExpiration"
//       );

//       if (accessToken && accessTokenExpiration) {
//         const now = new Date().getTime();
//         const expirationTime = Number(accessTokenExpiration);

//         if (now >= expirationTime) {
//           // 액세스 토큰이 만료된 경우 갱신 시도
//           const newAccessToken = await refreshAccessToken();
//           if (newAccessToken) {
//             setIsLoggedIn(true);
//           } else {
//             //   logout(); // 새 액세스 토큰 갱신 실패 시 로그아웃
//           }
//         }
//       } else {
//         logout(); // 액세스 토큰이 없는 경우 (로그아웃 처리)
//       }
//     },
//     [refreshAccessToken, logout, setIsLoggedIn]
//   );

//   useEffect(() => {
//     const checkTokenAndRefresh = async () => {
//       const accessToken = localStorage.getItem("AccessToken");
//       const accessTokenExpiration = localStorage.getItem(
//         "AccessTokenExpiration"
//       );

//       if (accessToken && accessTokenExpiration) {
//         const now = new Date().getTime();
//         const expirationTime = Number(accessTokenExpiration);

//         if (now < expirationTime) {
//           // 액세스 토큰이 유효한 경우
//           setIsLoggedIn(true);
//           const storedUser = localStorage.getItem("user");
//           if (storedUser) {
//             const parsedUser = JSON.parse(storedUser);
//             setUser(parsedUser);
//           }
//         } else {
//           // 액세스 토큰이 만료된 경우
//           await checkAndRefreshToken(); // 비동기 처리
//         }
//       } else {
//         // 액세스 토큰이 없는 경우 (로그아웃 처리)
//         logout();
//       }
//     };

//     checkTokenAndRefresh(); // 함수 호출
//   }, []);

//   return { user, isLoggedIn, checkAndRefreshToken };
// };

// export default useAuth;

// 401 에러 해결

// import { useEffect, useMemo, useCallback } from "react";
// import { useRecoilState } from "recoil";
// import { userState, isLoggedInState } from "@/recoil/userState";
// import { useLogout } from "@/hooks/useLogout";
// import { basicAxios } from "@/api/axios";
// import axios from "axios";

// const useAuth = () => {
//   const [user, setUser] = useRecoilState(userState);
//   const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
//   const { logout } = useLogout();

//   const refreshAccessToken = useCallback(async () => {
//     try {
//       console.log("Starting token refresh...");
//       const response = await basicAxios.post("/users/refresh");
//       console.log("Refresh response:", response);

//       const { accessToken } = response.data;
//       localStorage.setItem("AccessToken", accessToken);

//       // 액세스 토큰 만료 시간 갱신 (예시: 5분 후 만료)
//       const accessTokenExpiration = new Date().getTime() + 5 * 60 * 1000;
//       localStorage.setItem(
//         "AccessTokenExpiration",
//         accessTokenExpiration.toString()
//       );

//       return accessToken;
//     } catch (error) {
//       console.error("액세스 토큰 갱신 실패:", error);

//       if (axios.isAxiosError(error)) {
//         const response = error.response;
//         console.log("Axios 오류 응답:", response);

//         if (response?.status === 401) {
//           console.log("Unauthorized 오류 응답:", response.data);
//         }
//       }

//       return null;
//     }
//   }, [logout]);

//   const checkAndRefreshToken = useMemo(
//     () => async () => {
//       const accessToken = localStorage.getItem("AccessToken");
//       const accessTokenExpiration = localStorage.getItem(
//         "AccessTokenExpiration"
//       );

//       if (accessToken && accessTokenExpiration) {
//         const now = new Date().getTime();
//         const expirationTime = Number(accessTokenExpiration);

//         if (now >= expirationTime) {
//           const newAccessToken = await refreshAccessToken();
//           if (newAccessToken) {
//             setIsLoggedIn(true);
//           } else {
//             logout();
//           }
//         }
//       } else {
//         logout();
//       }
//     },
//     [refreshAccessToken, logout, setIsLoggedIn]
//   );

//   useEffect(() => {
//     const checkTokenAndRefresh = async () => {
//       const accessToken = localStorage.getItem("AccessToken");
//       const accessTokenExpiration = localStorage.getItem(
//         "AccessTokenExpiration"
//       );

//       if (accessToken && accessTokenExpiration) {
//         const now = new Date().getTime();
//         const expirationTime = Number(accessTokenExpiration);

//         if (now < expirationTime) {
//           setIsLoggedIn(true);
//           const storedUser = localStorage.getItem("user");
//           if (storedUser) {
//             const parsedUser = JSON.parse(storedUser);
//             setUser(parsedUser);
//           }
//         } else {
//           await checkAndRefreshToken();
//         }
//       } else {
//         logout();
//       }
//     };

//     checkTokenAndRefresh();
//   }, [checkAndRefreshToken, logout, setIsLoggedIn, setUser]);

//   return { user, isLoggedIn, checkAndRefreshToken };
// };

// export default useAuth;

// 의존성 배열 최소화

// import { useEffect, useCallback } from "react";
// import { useRecoilState } from "recoil";
// import { userState, isLoggedInState } from "@/recoil/userState";
// import { useLogout } from "@/hooks/useLogout";
// import { basicAxios } from "@/api/axios";
// import axios from "axios";

// const useAuth = () => {
//   const [user, setUser] = useRecoilState(userState);
//   const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
//   const { logout } = useLogout();

//   const refreshAccessToken = useCallback(async () => {
//     try {
//       console.log("Starting token refresh...");
//       const response = await basicAxios.post("/users/refresh");
//       console.log("Refresh response:", response);

//       const { accessToken } = response.data;
//       localStorage.setItem("AccessToken", accessToken);

//       // 액세스 토큰 만료 시간 갱신 (예시: 5분 후 만료)
//       const accessTokenExpiration = new Date().getTime() + 5 * 60 * 1000;
//       localStorage.setItem(
//         "AccessTokenExpiration",
//         accessTokenExpiration.toString()
//       );

//       return accessToken;
//     } catch (error) {
//       console.error("액세스 토큰 갱신 실패:", error);

//       if (axios.isAxiosError(error)) {
//         const response = error.response;
//         console.log("Axios 오류 응답:", response);

//         if (response?.status === 401) {
//           console.log("Unauthorized 오류 응답:", response.data);
//         }
//       }

//       return null;
//     }
//   }, []);

//   const checkAndRefreshToken = useCallback(async () => {
//     const accessToken = localStorage.getItem("AccessToken");
//     const accessTokenExpiration = localStorage.getItem("AccessTokenExpiration");

//     if (accessToken && accessTokenExpiration) {
//       const now = new Date().getTime();
//       const expirationTime = Number(accessTokenExpiration);

//       if (now >= expirationTime) {
//         const newAccessToken = await refreshAccessToken();
//         if (newAccessToken) {
//           setIsLoggedIn(true);
//         } else {
//           logout();
//         }
//       }
//     } else {
//       logout();
//     }
//   }, [refreshAccessToken, setIsLoggedIn, logout]);

//   useEffect(() => {
//     const checkTokenAndRefresh = async () => {
//       const accessToken = localStorage.getItem("AccessToken");
//       const accessTokenExpiration = localStorage.getItem(
//         "AccessTokenExpiration"
//       );

//       if (accessToken && accessTokenExpiration) {
//         const now = new Date().getTime();
//         const expirationTime = Number(accessTokenExpiration);

//         if (now < expirationTime) {
//           if (!isLoggedIn) {
//             setIsLoggedIn(true);
//           }
//           const storedUser = localStorage.getItem("user");
//           if (storedUser) {
//             const parsedUser = JSON.parse(storedUser);
//             setUser(parsedUser);
//           }
//         } else {
//           await checkAndRefreshToken();
//         }
//       } else {
//         logout();
//       }
//     };

//     checkTokenAndRefresh();
//   }, [checkAndRefreshToken, isLoggedIn, logout, setIsLoggedIn, setUser]);

//   return { user, isLoggedIn, checkAndRefreshToken };
// };

// export default useAuth;

// 콘솔 추가

// import { useEffect, useCallback } from "react";
// import { useRecoilState } from "recoil";
// import { userState, isLoggedInState } from "@/recoil/userState";
// import { useLogout } from "@/hooks/useLogout";
// import { basicAxios } from "@/api/axios";
// import axios from "axios";

// const useAuth = () => {
//   const [user, setUser] = useRecoilState(userState);
//   const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
//   const { logout } = useLogout();

//   const refreshAccessToken = useCallback(async () => {
//     try {
//       console.log("Starting token refresh...");
//       const response = await basicAxios.post("/users/refresh");
//       console.log("Refresh response:", response);

//       const { accessToken } = response.data;
//       localStorage.setItem("AccessToken", accessToken);

//       return accessToken;
//     } catch (error) {
//       console.error("액세스 토큰 갱신 실패:", error);

//       if (axios.isAxiosError(error)) {
//         const response = error.response;
//         console.log("Axios 오류 응답:", response);

//         if (response?.status === 401) {
//           console.log("Unauthorized 오류 응답:", response.data);
//         }
//       }

//       return null;
//     }
//   }, []);

//   const checkAndRefreshToken = useCallback(async () => {
//     console.log("Checking and refreshing token...");
//     const accessToken = localStorage.getItem("AccessToken");
//     const accessTokenExpiration = localStorage.getItem("AccessTokenExpiration");

//     if (accessToken && accessTokenExpiration) {
//       const now = new Date().getTime();
//       const expirationTime = Number(accessTokenExpiration);

//       if (now >= expirationTime) {
//         console.log("Token expired. Refreshing token...");
//         const newAccessToken = await refreshAccessToken();
//         if (newAccessToken) {
//           console.log("Token refreshed successfully");
//           setIsLoggedIn(true);
//         } else {
//           console.log("Token refresh failed. Logging out...");
//           logout();
//         }
//       }
//     } else {
//       console.log("No access token found. Logging out...");
//       logout();
//     }
//   }, [refreshAccessToken, setIsLoggedIn, logout]);

//   useEffect(() => {
//     const checkTokenAndRefresh = async () => {
//       console.log(
//         "Executing useEffect to check token and refresh if necessary"
//       );
//       const accessToken = localStorage.getItem("AccessToken");
//       const accessTokenExpiration = localStorage.getItem(
//         "AccessTokenExpiration"
//       );

//       if (accessToken && accessTokenExpiration) {
//         const now = new Date().getTime();
//         const expirationTime = Number(accessTokenExpiration);

//         if (now < expirationTime) {
//           console.log("Access token is still valid");
//           if (!isLoggedIn) {
//             console.log("User is not logged in. Setting isLoggedIn to true");
//             setIsLoggedIn(true);
//           }
//           const storedUser = localStorage.getItem("user");
//           if (storedUser) {
//             console.log("User data found in localStorage. Setting user state");
//             const parsedUser = JSON.parse(storedUser);
//             setUser(parsedUser);
//           }
//         } else {
//           console.log("Access token expired. Refreshing token...");
//           await checkAndRefreshToken();
//         }
//       } else {
//         console.log("No access token or expiration time found. Logging out...");
//         logout();
//       }
//     };

//     checkTokenAndRefresh();
//   }, [checkAndRefreshToken, isLoggedIn, logout, setIsLoggedIn, setUser]);

//   return { user, isLoggedIn, checkAndRefreshToken };
// };

// export default useAuth;

// 액세스 토큰 시간이 만료되면 액세스 토큰 재발급 api 201하는 코드지만 현재 로컬에는 저장이 안되서 로그아웃이 되는 중 아마 만료 시간을 로컬에 저장 안해서 해당 오류 발생 추측

// import { useEffect, useCallback } from "react";
// import { useRecoilState } from "recoil";
// import { userState, isLoggedInState } from "@/recoil/userState";
// import { useLogout } from "@/hooks/useLogout";
// import { basicAxios } from "@/api/axios";
// import axios from "axios";

// const useAuth = () => {
//   const [user] = useRecoilState(userState);
//   const [isLoggedIn] = useRecoilState(isLoggedInState);
//   const { logout } = useLogout();

//   const refreshAccessToken = useCallback(async () => {
//     try {
//       console.log("Starting token refresh...");
//       const response = await basicAxios.post("/users/refresh");
//       console.log("Refresh response:", response);

//       const { accessToken } = response.data;
//       localStorage.setItem("AccessToken", accessToken);

//       return accessToken;
//     } catch (error) {
//       console.error("액세스 토큰 갱신 실패:", error);

//       if (axios.isAxiosError(error)) {
//         const response = error.response;
//         console.log("Axios 오류 응답:", response);

//         if (response?.status === 401) {
//           console.log("Unauthorized 오류 응답:", response.data);
//         }
//       }

//       return null;
//     }
//   }, []);

//   const checkAndRefreshToken = useCallback(async () => {
//     const accessToken = localStorage.getItem("AccessToken");
//     const accessTokenExpiration = localStorage.getItem("AccessTokenExpiration");

//     if (accessToken && accessTokenExpiration) {
//       const now = new Date().getTime();
//       const expirationTime = Number(accessTokenExpiration);

//       if (now >= expirationTime) {
//         // 액세스 토큰이 만료되었습니다. 새로고침하세요.
//         const newAccessToken = await refreshAccessToken();
//         if (newAccessToken) {
//           // 새로운 액세스 토큰 및 만료 시간으로 localStorage 업데이트
//           localStorage.setItem("AccessToken", newAccessToken);
//           // axios 인스턴스가 Authorization 헤더를 사용하는 경우 헤더 업데이트 -> 새로운 액세스 토큰 헤더에 저장
//           basicAxios.defaults.headers.common[
//             "Authorization"
//           ] = `Bearer ${newAccessToken}`;
//         } else {
//           // 토큰 새로 고침 실패 처리, 사용자 로그아웃 가능
//           logout(); // 이 부분에서 토큰 갱신 실패 시 로그아웃을 호출합니다
//         }
//       } else {
//         // 액세스 토큰은 여전히 유효합니다. 필요한 경우 axios 헤더를 업데이트하세요.
//         basicAxios.defaults.headers.common[
//           "Authorization"
//         ] = `Bearer ${accessToken}`;
//       }
//     } else {
//       // 액세스 토큰을 찾을 수 없습니다. 사용자가 로그아웃될 수 있습니다.
//       logout();
//     }
//   }, [refreshAccessToken, logout]);

//   useEffect(() => {
//     checkAndRefreshToken();
//   }, [checkAndRefreshToken]);

//   return { user, isLoggedIn, checkAndRefreshToken };
// };

// export default useAuth;

// 로컬 스토리지에 새로 발급 받은 액세스 토큰 만료시간 추가

import { useEffect, useCallback } from "react";
import { useRecoilState } from "recoil";
import { userState, isLoggedInState } from "@/recoil/userState";
import { useLogout } from "@/hooks/useLogout";
import { basicAxios } from "@/api/axios";
import axios from "axios";

const useAuth = () => {
  const [user] = useRecoilState(userState);
  const [isLoggedIn] = useRecoilState(isLoggedInState);
  const { logout } = useLogout();

  const refreshAccessToken = useCallback(async () => {
    try {
      console.log("Starting token refresh...");
      const response = await basicAxios.post("/users/refresh");
      console.log("Refresh response:", response);

      const { accessToken, expiration } = response.data.result;

      // Store the new access token and its expiration time in local storage
      localStorage.setItem("AccessToken", accessToken);
      localStorage.setItem(
        "AccessTokenExpiration",
        new Date(expiration).getTime().toString()
      );

      return accessToken;
    } catch (error) {
      console.error("액세스 토큰 갱신 실패:", error);

      if (axios.isAxiosError(error)) {
        const response = error.response;
        console.log("Axios 오류 응답:", response);

        if (response?.status === 401) {
          console.log("Unauthorized 오류 응답:", response.data);
        }
      }

      return null;
    }
  }, []);

  const checkAndRefreshToken = useCallback(async () => {
    const accessToken = localStorage.getItem("AccessToken");
    const accessTokenExpiration = localStorage.getItem("AccessTokenExpiration");

    if (accessToken && accessTokenExpiration) {
      const now = new Date().getTime();
      const expirationTime = Number(accessTokenExpiration);

      if (now >= expirationTime) {
        // Access token expired, refresh it
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          // Update headers if your axios instance uses Authorization header
          basicAxios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
        } else {
          // Handle token refresh failure, possibly log out user
          logout(); // 이 부분에서 토큰 갱신 실패 시 로그아웃을 호출합니다
        }
      } else {
        // Access token is still valid, update axios headers if needed
        basicAxios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
      }
    } else {
      // No access token found, possibly log out user
      logout();
    }
  }, [refreshAccessToken, logout]);

  useEffect(() => {
    checkAndRefreshToken();
  }, [checkAndRefreshToken]);

  return { user, isLoggedIn, checkAndRefreshToken };
};

export default useAuth;
