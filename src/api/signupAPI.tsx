import axios, { AxiosError } from "axios";
import { basicAxios } from "./axios";
import { User } from "@/interface/signup";

export const registerUser = async (userData: User) => {
  try {
    const response = await basicAxios.post("/users/join", userData);
    console.log("User registered successfully:", response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error("Error registering user:", axiosError.response);
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
};
