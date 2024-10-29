import { atom } from "recoil";

export const chatModalState = atom<boolean>({
  key: "chatModalState",
  default: false,
});
