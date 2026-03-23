import {
  getChatUser,
  getUserByPhone,
  searchUserByNameApi,
} from "../api/userApi";

export const getUser = async () => {
  const res = await getChatUser();
  return res.data;
};

export const userbyPhone = async (phone: string) => {
  return await getUserByPhone(phone);
};

export const getUsersByName = async (name: string) => {
  const res = await searchUserByNameApi(name);
  return res.data;
};
