import { socket } from "@/sockets/socketConn";
import { useChatStore } from "@/store/chat/chatStore";

export const joinConversation = (conversationId: string) => {
  socket.emit("join_conversation", conversationId);
};

export const leaveConversation = (conversationId: string) => {
  socket.emit("leave_conversation", conversationId);
};

export const listenGroupUpdates = () => {
  socket.off("group_updated");
  socket.off("removed_from_group");
  socket.off("conversation_added");
  socket.off("conversation_deleted");
  socket.off("message_deleted");

  socket.on("group_updated", (updatedConversation: any) => {
    const {
      conversations,
      setConversations,
      activeConversation,
      updateActiveConversation,
    } = useChatStore.getState();
    const updatedList = conversations.map((c) =>
      c._id === updatedConversation._id ? updatedConversation : c,
    );
    setConversations(updatedList);
    if (activeConversation?._id === updatedConversation._id) {
      updateActiveConversation(updatedConversation);
    }
  });

  socket.on(
    "removed_from_group",
    ({ conversationId }: { conversationId: string }) => {
      const { removeConversation } = useChatStore.getState();
      removeConversation(conversationId);
    },
  );

  socket.on("conversation_added", ({ conversation }: { conversation: any }) => {
    const { addConversation, conversations } = useChatStore.getState();
    const alreadyExists = conversations.some((c) => c._id === conversation._id);
    if (!alreadyExists) addConversation(conversation);
  });

  socket.on(
    "conversation_deleted",
    ({ conversationId }: { conversationId: string }) => {
      const { removeConversation } = useChatStore.getState();
      removeConversation(conversationId);
    },
  );

  socket.on("message_deleted", ({ messageId }: { messageId: string }) => {
    const { removeMessage } = useChatStore.getState();
    removeMessage(messageId);
  });
};

export const stopListeningGroupUpdates = () => {
  socket.off("group_updated");
  socket.off("removed_from_group");
  socket.off("conversation_added");
};
