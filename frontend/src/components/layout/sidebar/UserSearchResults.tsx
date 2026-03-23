import { useUserStore } from "@/store/users/userStore";
import { userAuthStore } from "@/store/auth/authStore";
import { sendRequest } from "@/services/chatRequestServices";
import { useChatStore } from "@/store/chat/chatStore";
import type { ConversationInterface } from "@/interfaces/conversationInterfaces";
import usePublicUsers from "@/hooks/useSerachUsers";
import type { outgoingRequestI } from "@/interfaces/outgoingRequestInterface";
import type { UserInterface } from "@/interfaces/userInterfaces";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search } from "lucide-react";

interface Props { searchName: string; }

function UserSearchResults({ searchName }: Props) {
    const { user } = userAuthStore();
    const { users, outgoingRequests, addOutgoingRequest } = useUserStore();
    const { conversations, setActiveConversation } = useChatStore();

    usePublicUsers(searchName);

    const isRequested = (userId: string) =>
        outgoingRequests.some((req: outgoingRequestI) => req.receiver_id === userId);

    const getConversation = (userId: string) =>
        conversations?.find((conv: ConversationInterface) =>
            !conv.is_group && conv.participants?.some((p: any) => p._id === userId)
        );

    const handleSendRequest = async (receiverId: string) => {
        if (!user?._id) return;
        try {
            await sendRequest(user._id, receiverId);
            addOutgoingRequest(receiverId);
            toast.success("Request sent");
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to send request");
        }
    };

    const handleOpenChat = (userId: string) => {
        const conversation = getConversation(userId);
        if (conversation) setActiveConversation(conversation);
    };

    if (users.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-40 text-center space-y-2">
                <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                    <Search className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                    No results for <span className="text-card-foreground font-medium">"{searchName}"</span>
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-1.5">
            {users.map((u: UserInterface) => {
                const initials = u.name?.slice(0, 2).toUpperCase();
                const conversation = getConversation(String(u._id));
                const connected = !!conversation;
                const requested = isRequested(String(u._id));

                return (
                    <div
                        key={u._id}
                        onClick={() => connected ? handleOpenChat(String(u._id)) : undefined}
                        className={`flex items-center justify-between p-3 rounded-xl border border-border transition-colors
                            ${connected ? "hover:bg-accent cursor-pointer" : "cursor-default"}`}
                    >
                        <div className="flex items-center gap-2.5 min-w-0">
                            {/* compact avatar — w-9 not w-16 */}
                            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                                {initials}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-semibold text-card-foreground truncate">{u.name}</span>
                                <span className="text-xs text-muted-foreground truncate">{u.phone}</span>
                            </div>
                        </div>

                        {/* compact badge/button — not h-14 */}
                        {connected ? (
                            <Badge className="text-xs px-2 h-6 font-medium shrink-0 ml-2">
                                Message
                            </Badge>
                        ) : requested ? (
                            <Badge variant="secondary" className="text-xs px-2 h-6 font-medium shrink-0 ml-2 text-muted-foreground">
                                Pending
                            </Badge>
                        ) : (
                            <Button
                                size="sm"
                                className="h-7 px-3 text-xs font-medium shrink-0 ml-2"
                                onClick={(e) => { e.stopPropagation(); handleSendRequest(String(u._id)); }}
                            >
                                Connect
                            </Button>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default UserSearchResults;