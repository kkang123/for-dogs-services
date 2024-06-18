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

import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { userState, isLoggedInState } from "@/recoil/userState";
import { useLogout } from "@/hooks/useLogout";
import { basicAxios } from "@/api/axios";
import axios from "axios";

const useAuth = () => {
  const [user, setUser] = useRecoilState(userState);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
  const { logout } = useLogout();

  const refreshAccessToken = async () => {
    try {
      const response = await basicAxios.post("/users/refresh");
      const { accessToken } = response.data;
      localStorage.setItem("AccessToken", accessToken);

      // 액세스 토큰 만료 시간 갱신 (예시: 5분 후 만료)
      const accessTokenExpiration = new Date().getTime() + 5 * 60 * 1000;
      localStorage.setItem(
        "AccessTokenExpiration",
        accessTokenExpiration.toString()
      );

      return accessToken;
    } catch (error) {
      console.error("Failed to refresh access token:", error);

      if (axios.isAxiosError(error)) {
        const response = error.response;
        if (
          response?.status === 400 &&
          response.data?.error?.message ===
            "refresh_token 필수 요청 쿠키가 누락되었습니다."
        ) {
          logout();
        }
      }

      return null;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem("AccessToken");
      const accessTokenExpiration = localStorage.getItem(
        "AccessTokenExpiration"
      );

      if (accessToken && accessTokenExpiration) {
        const now = new Date().getTime();
        const expirationTime = Number(accessTokenExpiration);

        if (now < expirationTime) {
          // 액세스 토큰이 유효한 경우
          setIsLoggedIn(true);
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          }

          // 만료 시간까지 남은 시간 계산
          const timeUntilExpiration = expirationTime - now;

          // 만료 시간 5분 이내일 때만 토큰 갱신 시도
          if (timeUntilExpiration < 5 * 60 * 1000) {
            await refreshAccessToken();
          }
        } else {
          // 액세스 토큰이 만료된 경우
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            setIsLoggedIn(true);
          } else {
            logout(); // 새 액세스 토큰 갱신 실패 시 로그아웃
          }
        }
      } else {
        // 액세스 토큰이 없는 경우 (로그아웃 처리)
        logout();
      }
    };

    checkAuth();

    // 초기 실행 후, 만료 시간까지 남은 시간을 고려하여 다음 갱신을 예약
    const accessTokenExpiration = localStorage.getItem("AccessTokenExpiration");
    if (accessTokenExpiration) {
      const now = new Date().getTime();
      const expirationTime = Number(accessTokenExpiration);
      const timeUntilExpiration = expirationTime - now;

      // 만료 시간 5분 이내일 때만 토큰 갱신 시도
      if (timeUntilExpiration < 5 * 60 * 1000) {
        const interval = setInterval(() => {
          checkAuth();
        }, timeUntilExpiration);

        return () => clearInterval(interval);
      }
    }
  }, [logout, setIsLoggedIn, setUser]);

  return { user, isLoggedIn };
};

export default useAuth;
