import { useState } from "react";
import { useChatStore } from "@/store/chat/chatStore";
import { getUsersByName } from "@/services/userServices";
import {
  addUserinGroup,
  removeUserFromGroup,
} from "@/services/conversationService";
import type { UserInterface } from "@/interfaces/userInterfaces";
import { toast } from "sonner";

export function useConversationActions() {
  const { activeConversation, setActiveConversation, conversations } =
    useChatStore();
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [foundUser, setFoundUser] = useState<UserInterface | null>(null);
  const [searchError, setSearchError] = useState("");
  const [notInList, setNotInList] = useState(false);

  const searchByName = async (name: string) => {
    if (!name.trim()) return;
    setSearching(true);
    setFoundUser(null);
    setSearchError("");
    setNotInList(false);
    try {
      const results = await getUsersByName(name);
      if (!results || results.length === 0) {
        setSearchError("No user found with this name");
        return;
      }
      const conversationParticipantIds = new Set(
        conversations.flatMap(
          (conv) => conv.participants?.map((p: any) => p._id) ?? [],
        ),
      );
      const filtered = results.filter((u: any) =>
        conversationParticipantIds.has(u._id),
      );
      if (filtered.length > 0) {
        setFoundUser(filtered[0]);
      } else {
        setNotInList(true);
        setSearchError("This user is not in your list");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Something went wrong";
      setSearchError(msg);
      toast.error(msg);
    } finally {
      setSearching(false);
    }
  };

  const addUser = async () => {
    if (!activeConversation?._id || !foundUser?._id) return;
    setLoading(true);
    try {
      const res = await addUserinGroup(activeConversation._id, foundUser._id);
      setActiveConversation(res.data);
      toast.success(`${foundUser.name} added to group`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  const removeUser = async (userId: string) => {
    if (!activeConversation?._id) return;
    setLoading(true);
    try {
      const res = await removeUserFromGroup(activeConversation._id, userId);
      setActiveConversation(res.data);
      toast.success("User removed from group");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to remove user");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFoundUser(null);
    setSearchError("");
    setNotInList(false);
  };

  return {
    searchByName,
    addUser,
    removeUser,
    foundUser,
    searching,
    searchError,
    loading,
    reset,
    notInList,
  };
}
