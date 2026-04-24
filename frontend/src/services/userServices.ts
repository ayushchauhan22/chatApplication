import {
  getChatUser,
  getUserByPhone,
  searchUserByNameApi,
  updateUserApi,
} from "../api/userApi";

export const getUser = async () => {
  const res = await getChatUser();
  return res.data;
};

//usecreategroup serchby phone change 
export const userbyPhone = async (phone: string) => { 
  return await getUserByPhone(phone);
};

export const getUsersByName = async (name: string) => {
  const res = await searchUserByNameApi(name);
  return res.data;
};

// ← new
export const updateUserService = async (name: string) => {
  const res = await updateUserApi(name);
  return res.data;
};
