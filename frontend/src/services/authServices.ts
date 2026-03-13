import { loginApi,  registerApi , isAuthentic} from "../api/authApi";
import { asyncWrapper } from "../wrappers/wrapper";


export const loginUser = async (data: { email: string; password: string }) => {
  return asyncWrapper(loginApi(data));
};

export const signupUser = (data: { phone: number; name: string; email: string; password: string }) => {
  return asyncWrapper(registerApi(data));
};

export const verifyUser = () => {
  return isAuthentic();
};