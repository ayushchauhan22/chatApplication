import {
  serachUser,
  addRequestApi,
  outgoingRequestApi,
  acceptRequestApi,
  rejectRequestApi,
  incomingRequestApi,
  cancelRequestApi,
} from "@/api/chatRequestApi";

export const getPublicUsers = async (phone: string) => {
  const res = await serachUser(phone);
  return res.data;
};

export const sendRequest = async (senderId: string, receiverId: string) => {
  const res = await addRequestApi(senderId, receiverId);
  return res.data;
};

export const getOutgoingRequests = async (id: string) => {
  const res = await outgoingRequestApi(id);
  return res.data;
};

export const getIncomingRequests = async (id: string) => {
  const res = await incomingRequestApi(id);
  return res.data;
};

export const acceptRequest = async (id: string) => {
  const res = await acceptRequestApi(id);
  return res.data;
};

export const rejectRequest = async (id: string) => {
  const res = await rejectRequestApi(id);
  return res.data;
};

export const cancelRequest = async (id: string) => {
  const res = await cancelRequestApi(id);
  return res.data;
};
