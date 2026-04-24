import { create } from "zustand";
import type { ConversationInterface as Conversation } from "@/interfaces/conversationInterfaces";
import type { MessageInterface } from "@/interfaces/messageInterfaces";

interface ChatState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: MessageInterface[];

  setConversations: (conversations: Conversation[]) => void;
  setActiveConversation: (conversation: Conversation | null) => void;
  setMessages: (msgs: MessageInterface[]) => void;
  addMessage: (msg: MessageInterface) => void;
  addConversation: (conv: Conversation) => void;
  updateActiveConversation: (conv: Conversation) => void;
  updateMessageStatus: (
    conversationId: string,
    status: string,
    lastSeenMessageId: string,
    userId?: string,
    messageId?: string,
  ) => void;
  removeConversation: (conversationId: string) => void;
  incrementUnread: (conversationId: string) => void;
  clearUnread: (conversationId: string) => void;
  removeMessage: (messageId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  activeConversation: null,
  messages: [],

  setConversations: (conversations) => set({ conversations }),

  setActiveConversation: (conversation) =>
    set({ activeConversation: conversation }),

  setMessages: (msgs: any) => set({ messages: msgs }),

  addConversation: (conv) =>
    set((state) => ({ conversations: [conv, ...state.conversations] })),

  updateActiveConversation: (conv) =>
    set((state) => ({
      activeConversation: conv,
      conversations: state.conversations.map((c) =>
        c._id === conv._id ? conv : c,
      ),
    })),

  updateMessageStatus: (
    conversationId,
    status,
    lastSeenMessageId,
    userId,
    messageId,
  ) =>
    set((state) => ({
      messages: state.messages.map((msg) => {
        if (String(msg.conversation_id ?? "") !== String(conversationId ?? ""))
          return msg;

        if (status === "delivered") {
          // Targets one specific message. Match on messageId OR lastSeenMessageId.
          const targetId = String(messageId ?? lastSeenMessageId ?? "");
          if (String(msg._id ?? "") !== targetId) return msg;

          // Never downgrade from seen → delivered
          if (msg.messageStatus?.status === "seen") return msg;

          return {
            ...msg,
            messageStatus: {
              ...(msg.messageStatus ?? {}),
              status: "delivered" as const,
              lastSeenMessageId:
                lastSeenMessageId ??
                msg.messageStatus?.lastSeenMessageId ??
                null,
            },
          };
        }

        if (status === "seen") {
          // Skip messages sent by the person who just did the seeing
          const isSentByViewer =
            String(msg.sender?._id ?? "") === String(userId ?? "") ||
            String(msg.sender ?? "") === String(userId ?? "");
          if (isSentByViewer) return msg;

          // Update all messages at or before the boundary
          if (String(msg._id ?? "") > String(lastSeenMessageId ?? ""))
            return msg;

          return {
            ...msg,
            messageStatus: {
              ...(msg.messageStatus ?? {}),
              status: "seen" as const,
              lastSeenMessageId:
                lastSeenMessageId ??
                msg.messageStatus?.lastSeenMessageId ??
                null,
            },
          };
        }

        return msg;
      }),
    })),

  removeConversation: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.filter(
        (c) => c._id !== conversationId,
      ),
      activeConversation:
        state.activeConversation?._id === conversationId
          ? null
          : state.activeConversation,
    })),

  incrementUnread: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c._id === conversationId
          ? { ...c, unreadCount: (c.unreadCount ?? 0) + 1 }
          : c,
      ),
    })),

  clearUnread: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c._id === conversationId ? { ...c, unreadCount: 0 } : c,
      ),
    })),

  removeMessage: (messageId) =>
    set((state) => ({
      messages: state.messages.filter((m) => m._id !== messageId),
    })),

  addMessage: (msg) =>
    set((state) => {
      const convId = String(msg.conversation_id ?? "");
      const msgId = String(msg._id ?? "");
      const isActive = state.activeConversation?._id === convId;

      const updatedConversations = state.conversations.map((conv) => {
        if (conv._id !== convId) return conv;
        return {
          ...conv,
          lastMessage: msg,
          updatedAt: msg.createdAt,
          unreadCount: isActive ? 0 : (conv.unreadCount ?? 0) + 1,
        };
      });

      const sorted = [...updatedConversations].sort((a, b) => {
        const aTime = a.updatedAt ?? a.lastMessage?.createdAt ?? "";
        const bTime = b.updatedAt ?? b.lastMessage?.createdAt ?? "";
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      });

      if (!isActive) return { conversations: sorted };

      const alreadyExists = state.messages.some(
        (m) => String(m._id ?? "") === msgId,
      );
      if (alreadyExists) return { conversations: sorted };

      return {
        messages: [...state.messages, msg],
        conversations: sorted,
      };
    }),
}));
