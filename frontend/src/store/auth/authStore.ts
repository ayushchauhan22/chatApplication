import { create } from "zustand";
import type { UserInterface } from "@/interfaces/userInterfaces";
import { logout } from "@/services/authServices";
import { useChatStore } from "@/store/chat/chatStore";

interface AuthState {
  user: UserInterface | null;
  setUser: (user: UserInterface | null) => void;
  updateUser: (updates: Partial<UserInterface>) => void;
  logout: () => void;
}

export const userAuthStore = create<AuthState>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : state.user,
    })),

  logout: async () => {
    try {
      await logout();
      useChatStore.getState().setActiveConversation(null);
      set({ user: null });
    } catch (error) {
      console.error("Logout failed", error);
    }
  },
}));
