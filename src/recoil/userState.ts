import { atom, RecoilState } from "recoil";

import { User } from "@/interface/user";

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

export const userState: RecoilState<User> = atom({
  key: "userState",
  default: getInitialUserState(),
});
