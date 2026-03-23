import {
  loginApi,
  registerApi,
  isAuthentic,
  getMe,
  signOut,
} from "../api/authApi";
import { asyncWrapper } from "../wrappers/wrapper";
import type { UserInterface } from "@/interfaces/userInterfaces";

export const loginUser = async (data: { email: string; password: string }) => {
  return await loginApi(data);
};

export const signupUser = async(data: UserInterface) => {
  return await registerApi(data);
};

export const verifyUser = async () => {
  try {
    const res = await isAuthentic();
    return res;
  } catch (error: any) {
    if (error.response?.status === 401) {
      return null;
    }

    throw error;
  }
};

export const me = async () => {
  try {
    const res = await getMe();
    return res.data;
  } catch (err: any) {
    if (err.response?.status === 401) {
      return null;
    }

    throw err;
  }
};

export const logout = async () => {
  return asyncWrapper(signOut());
};
