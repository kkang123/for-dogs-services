import { atom } from "recoil";

const getInitialUserState = () => {
  const savedUser = localStorage.getItem("user");
  return savedUser
    ? JSON.parse(savedUser)
    : { isLoggedIn: false, userId: "", role: "" };
};

const getInitialIsLoggedInState = () => {
  const accessToken = localStorage.getItem("AccessToken");
  return !!accessToken;
};

export const isLoggedInState = atom({
  key: "isLoggedInState",
  default: getInitialIsLoggedInState(),
});

export const userState = atom({
  key: "userState",
  default: getInitialUserState(),
});
