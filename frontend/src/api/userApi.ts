import api from "./axios";

export const getChatUser = () => {
  return api.get("/users/chat-user");
};

export const getUserByPhone = (phone: string) =>
  api.get(`/users/search?phone=${phone}`);

export const searchUserByNameApi = (name: string) =>
  api.get(`/users/search-name?name=${name}`);

// ← new: update logged-in user's name
export const updateUserApi = (name: string) =>
  api.put("/users/profile", { name });

