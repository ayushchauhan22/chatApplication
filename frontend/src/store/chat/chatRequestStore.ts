import { create } from "zustand";
import {
  getIncomingRequests,
  getOutgoingRequests,
  acceptRequest,
  rejectRequest,
} from "@/services/chatRequestServices";
import { toast } from "sonner";

interface ChatRequestState {
  incoming: any[];
  outgoing: any[];
  fetchIncoming: (userId: string) => Promise<void>;
  fetchOutgoing: (userId: string) => Promise<void>;
  accept: (id: string, userId: string) => Promise<void>;
  reject: (id: string, userId: string) => Promise<void>;
}

export const useChatRequestStore = create<ChatRequestState>((set) => ({
  incoming: [],
  outgoing: [],

  fetchIncoming: async (userId) => {
    try {
      const data = await getIncomingRequests(userId);
      set({ incoming: data });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load requests");
    }
  },

  fetchOutgoing: async (userId) => {
    try {
      const data = await getOutgoingRequests(userId);
      set({ outgoing: data });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load requests");
    }
  },

  accept: async (id, userId) => {
    try {
      await acceptRequest(id);
      const data = await getIncomingRequests(userId);
      set({ incoming: data });
      toast.success("Request accepted");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to accept request");
    }
  },

  reject: async (id, userId) => {
    try {
      await rejectRequest(id);
      const data = await getIncomingRequests(userId);
      set({ incoming: data });
      toast.success("Request declined");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to decline request");
    }
  },
}));
