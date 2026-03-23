import api from "./axios";

export const addUserToConversation = (conversationId: string, userId: string) =>
  api.put(`/rooms/conversations/${conversationId}/add-user`, { userId });

export const removeUserFromConversation = (
  conversationId: string,
  userId: string,
) => api.put(`/rooms/conversations/${conversationId}/remove-user`, { userId });

export const createConversationApi = (data: object) =>
  api.post("/rooms/conversations", data);

export const allUserConvesration = (page = 1) => {
  return api.get(`/rooms/conversations?page=${page}`);
};

export const getMessagesApi = (conversationId: string, page = 1) => {
  return api.get(`/messages/${conversationId}?page=${page}`);
};
export const deleteConversationApi = (conversationId: string) =>
  api.delete(`/rooms/conversations/${conversationId}`);