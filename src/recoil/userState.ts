import { atom } from "recoil";

const getInitialUserState = () => {
  const savedUser = localStorage.getItem("user");
  return savedUser
    ? JSON.parse(savedUser)
    : { isLoggedIn: false, userId: "", role: "" };
};

export const accessTokenState = atom({
  key: "accessTokenState",
  default: localStorage.getItem("accessToken") || "",
});

export const isLoggedInState = atom({
  key: "isLoggedInState",
  default: !!localStorage.getItem("accessToken"),
});

export const userState = atom({
  key: "userState",
  default: getInitialUserState(),
});
