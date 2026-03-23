import { create } from "zustand";
import type { ConversationInterface as Conversation } from "@/interfaces/conversationInterfaces";
import type {
  MessageInterface,
  MessageStatusInterface,
} from "@/interfaces/messageInterfaces";


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
  updateMessageStatus: ( messageId: string, status: string, seenBy?: any[]) => void;
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
  updateMessageStatus: (messageId, status, seenBy) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg._id === messageId
          ? {
              ...msg,
              messageStatus: {
                ...(msg.messageStatus ?? {}),
                status: status as "sent" | "delivered" | "seen", // ← cast
                seenBy: seenBy ?? msg.messageStatus?.seenBy ?? [],
              } as MessageStatusInterface,
            }
          : msg,
      ) as MessageInterface[], // ← cast the array
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
      const convId = msg.conversation_id;
      const alreadyExists = state.messages.some((m) => m._id === msg._id);
      const isActive = state.activeConversation?._id === convId;

      const updatedConversations = state.conversations.map((conv) => {
        if (conv._id === convId) {
          return {
            ...conv,
            lastMessage: msg,
            updatedAt: msg.createdAt,
            unreadCount: isActive ? 0 : (conv.unreadCount ?? 0) + 1,
          };
        }
        return conv;
      });

      // sort by most recent message
      const sorted = [...updatedConversations].sort((a, b) => {
        const aTime = a.updatedAt ?? a.lastMessage?.createdAt ?? "";
        const bTime = b.updatedAt ?? b.lastMessage?.createdAt ?? "";
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      });

      if (!isActive) return { conversations: sorted };

      if (alreadyExists) return { conversations: sorted };

      return {
        messages: [...state.messages, msg],
        conversations: sorted,
      };
    }),
}));
