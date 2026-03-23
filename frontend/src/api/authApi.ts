import api from "./axios";

export const loginApi = (data: unknown) => {
  return api.post("/auth/login", data);
};

export const registerApi = (data: unknown) => {
  return api.post("/auth/register", data);
};

export const isAuthentic = () =>{
  return api.get("/auth/verify");
}

export const signOut = () =>{
  return api.get("/auth/logout");
}

export const getMe = () =>  {
  return api.get("/auth/me")
}