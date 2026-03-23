import { useEffect, useState } from "react";
import { useChatStore } from "@/store/chat/chatStore";
import { getMessages } from "@/services/messageServices";
import { toast } from "sonner";

export const useMessages = () => {
  const { activeConversation, setMessages, messages } = useChatStore();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (!activeConversation?._id) return;
    setPage(1);
    setMessages([]);

    const fetchMessages = async () => {
      try {
        const res = await getMessages(activeConversation._id, 1);
        setMessages(res.messages ?? []);
        setHasMore(res.hasMore);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to load messages");
        setMessages([]);
      }
    };

    fetchMessages();
  }, [activeConversation?._id]);

  const loadMore = async () => {
    if (!activeConversation?._id || loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await getMessages(activeConversation._id, nextPage);
      setMessages([...res.messages, ...messages]);
      setHasMore(res.hasMore);
      setPage(nextPage);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to load more messages",
      );
    } finally {
      setLoadingMore(false);
    }
  };

  return { loadMore, hasMore, loadingMore };
};
