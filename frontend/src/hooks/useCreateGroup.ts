import { useState } from "react";
import { createGroupConversation } from "@/services/conversationService";
import { useChatStore } from "@/store/chat/chatStore";
import { userAuthStore } from "@/store/auth/authStore";
import type { UserInterface } from "@/interfaces/userInterfaces";
import { toast } from "sonner";

export function useCreateGroup() {
  const { user } = userAuthStore();
  const { addConversation, setActiveConversation, conversations } =
    useChatStore();

  const [groupName, setGroupName] = useState("");
  const [phone, setPhone] = useState("");
  const [foundUsers, setFoundUsers] = useState<UserInterface[]>([]);
  const [searchError, setSearchError] = useState("");
  const [searching, setSearching] = useState(false);
  const [participants, setParticipants] = useState<UserInterface[]>([]);
  const [loading, setLoading] = useState(false);

  const searchByPhone = async () => {
    if (!phone.trim()) return;
    setSearching(true);
    setFoundUsers([]);
    setSearchError("");
    try {
      const conversation = conversations.filter(
        (c) =>
          c.is_group === false &&
          c.participants.some((p) => String(p.phone).includes(String(phone))),
      );

      const result = conversation.flatMap((c) =>
        c.participants.filter((p) => String(p.phone).includes(String(phone))),
      );

      const filtered = result?.filter(
        (u: UserInterface) =>
          u._id !== user?._id && !participants.some((p) => p._id === u._id),
      );
      if (!filtered?.length) {
        setSearchError("No user found");
        return;
      }
      setFoundUsers(filtered);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Search failed";
      setSearchError(msg);
      toast.error(msg);
    } finally {
      setSearching(false);
    }
  };

  const addParticipant = (u: UserInterface) => {
    setParticipants((prev) => [...prev, u]);
    setFoundUsers([]);
    setPhone("");
    setSearchError("");
  };

  const removeParticipant = (userId: string) =>
    setParticipants((prev) => prev.filter((p) => p._id !== userId));

  const createGroup = async () => {
    if (!groupName.trim() || participants.length < 2) return;
    setLoading(true);
    try {
      const participantIds = [
        user?._id,
        ...participants.map((p) => p._id),
      ].filter(Boolean) as string[];
      const group = await createGroupConversation(groupName, participantIds);
      addConversation(group);
      setActiveConversation(group);
      toast.success(`Group "${groupName}" created`);
      resetAll();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setGroupName("");
    setPhone("");
    setFoundUsers([]);
    setSearchError("");
    setParticipants([]);
  };

  return {
    groupName,
    setGroupName,
    phone,
    setPhone,
    foundUsers,
    searchError,
    searching,
    participants,
    loading,
    searchByPhone,
    addParticipant,
    removeParticipant,
    createGroup,
    resetAll,
  };
}
