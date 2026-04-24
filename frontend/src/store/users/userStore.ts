import { create } from "zustand";
import type { UserInterface } from "@/interfaces/userInterfaces";
import type { outgoingRequestI } from "@/interfaces/outgoingRequestInterface";

interface UserStoreState {
  users: UserInterface[];
  outgoingRequests: outgoingRequestI[];
  setUsers: (users: UserInterface[]) => void;
  setOutgoingRequests: (requests: outgoingRequestI[]) => void;
}

export const useUserStore = create<UserStoreState>((set) => ({
  users: [],
  outgoingRequests: [],
  setUsers: (users) => set({ users }),
  setOutgoingRequests: (requests) => set({ outgoingRequests: requests }),
}));
