import {
  deleteMessageApi,
  getMessagesApi,
  presignedUrlApi,
} from "../api/mesaagesApi";

export const getMessages = async (conversationId: string, page = 1) => {
  const res = await getMessagesApi(conversationId, page);
  return res.data;
};

export const getPresignedUrlApi = async (id: string) => {
  const res = await presignedUrlApi(id);
  return res.data;
};

export const deleteMessageService = async (messageId: string) => {
  const res = await deleteMessageApi(messageId);
  return res.data;
};
