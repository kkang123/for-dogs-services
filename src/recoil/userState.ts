import { atom } from "recoil";

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
  default: {
    isLoggedIn: false,
    userId: "",
    role: "", // "SELLER" 또는 "BUYER"
  },
});
