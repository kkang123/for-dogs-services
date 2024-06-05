// import { atom } from "recoil";
// import Cookies from "js-cookie";

// const getInitialUserState = () => {
//   const savedUser = localStorage.getItem("user");
//   return savedUser
//     ? JSON.parse(savedUser)
//     : { isLoggedIn: false, userId: "", role: "" };
// };

// export const isLoggedInState = atom({
//   key: "isLoggedInState",
//   default: !!Cookies.get("REFRESH_TOKEN"), // 쿠키에 리프레시 토큰이 있는지 확인
// });

// export const userState = atom({
//   key: "userState",
//   default: getInitialUserState(),
// });

import { atom } from "recoil";

const getInitialUserState = () => {
  const savedUser = localStorage.getItem("user");
  return savedUser
    ? JSON.parse(savedUser)
    : { isLoggedIn: false, userId: "", userRole: "" };
};

export const userState = atom({
  key: "userState",
  default: getInitialUserState(),
});

export const isLoggedInState = atom({
  key: "isLoggedInState",
  default: getInitialUserState().isLoggedIn,
});
