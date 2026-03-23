import {
  allUserConvesration,
  addUserToConversation,
  removeUserFromConversation,
  createConversationApi,
  deleteConversationApi,
} from "../api/conversationApi";

export const getallConversation = async (page = 1) => {
  const res = await allUserConvesration(page);
  return res.data;
};

export const addUserinGroup = (conversationId: string, userId: string) => {
  return addUserToConversation(conversationId, userId);
};

export const removeUserFromGroup = (conversationId: string, userId: string) => {
  return removeUserFromConversation(conversationId, userId);
};

export const createGroupConversation = async (
  group_name: string,
  participants: string[],
) => {
  const res = await createConversationApi({
    group_name,
    participants,
    isGroup: true,
  });
  return res.data;
};

export const deleteConversationService = async (conversationId: string) => {
  const res = await deleteConversationApi(conversationId);
  return res.data;
};
