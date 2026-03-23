import { create } from "zustand";
import type { UserInterface } from "@/interfaces/userInterfaces";
import { logout } from "@/services/authServices";

interface AuthState {
  user: UserInterface | null;
  setUser: (user: UserInterface | null) => void;
  logout: () => void;
}

export const userAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: async () => {
    try {
      await logout();
      set({ user: null });

    } catch (error) {
      console.error("Logout failed", error);
    }
  },
}));
