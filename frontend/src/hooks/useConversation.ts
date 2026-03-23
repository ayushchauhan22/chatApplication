import { useCallback, useState } from "react";
import { useChatStore } from "../store/chat/chatStore";
import { getallConversation } from "../services/conversationService";
import { toast } from "sonner";

export const useConversation = () => {
  const { setConversations, conversations } = useChatStore();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await getallConversation(1);
      setConversations(res.conversations ?? res);
      setHasMore(res.hasMore ?? false);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to load conversations",
      );
    }
  }, [setConversations]);

  const loadMoreConversations = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await getallConversation(nextPage);
      setConversations([...conversations, ...(res.conversations ?? [])]);
      setHasMore(res.hasMore ?? false);
      setPage(nextPage);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load more");
    } finally {
      setLoadingMore(false);
    }
  };

  return { fetchConversations, loadMoreConversations, hasMore, loadingMore };
};
