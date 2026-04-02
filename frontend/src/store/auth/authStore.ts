import { create } from "zustand";
import type { UserInterface } from "@/interfaces/userInterfaces";
import { logout } from "@/services/authServices";

interface AuthState {
  user: UserInterface | null;
  setUser: (user: UserInterface | null) => void;
  updateUser: (updates: Partial<UserInterface>) => void; // ← new
  logout: () => void;
}

export const userAuthStore = create<AuthState>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  // ← merge partial updates into existing user, used after profile edit
  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : state.user,
    })),

  logout: async () => {
    try {
      await logout();
      set({ user: null });
    } catch (error) {
      console.error("Logout failed", error);
    }
  },
}));
