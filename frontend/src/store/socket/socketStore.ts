import { create } from "zustand";

interface SocketState {
  onlineUsers: Map<string, boolean>;
  setOnlineUsers: (users: string[]) => void;
  addOnlineUser: (userId: string) => void;
  removeOnlineUser: (userId: string) => void;
}

export const useSocketStore = create<SocketState>((set) => ({
  onlineUsers: new Map(),

  setOnlineUsers: (users) =>
    set({
      onlineUsers: new Map(users.map((id) => [id, true])),
    }),

  addOnlineUser: (userId) =>
    set((state) => {
      const updated = new Map(state.onlineUsers);
      updated.set(userId, true);
      return { onlineUsers: updated };
    }),

  removeOnlineUser: (userId) =>
    set((state) => {
      const updated = new Map(state.onlineUsers);
      updated.delete(userId);
      return { onlineUsers: updated };
    }),
}));
