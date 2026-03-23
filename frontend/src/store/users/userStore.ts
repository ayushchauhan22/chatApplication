import { create } from "zustand";
import type { UserInterface } from "@/interfaces/userInterfaces";
import type { outgoingRequestI } from "@/interfaces/outgoingRequestInterface";

interface UserStoreState {
  users: UserInterface[];
  outgoingRequests: outgoingRequestI[];
  setUsers: (users: UserInterface[]) => void;
  setOutgoingRequests: (requests: outgoingRequestI[]) => void;
  addOutgoingRequest: (receiverId: string) => void;
}

export const useUserStore = create<UserStoreState>((set) => ({
  users: [],
  outgoingRequests: [],
  setUsers: (users) => set({ users }),
  setOutgoingRequests: (requests) => set({ outgoingRequests: requests }),
  addOutgoingRequest: (receiverId) =>
    set((state) => ({
      outgoingRequests: [
        ...state.outgoingRequests,
        { receiver_id: receiverId } as unknown as outgoingRequestI,
      ],
    })),
}));
