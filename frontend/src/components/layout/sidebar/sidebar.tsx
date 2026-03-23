import { useState } from "react";
import { useChatStore } from "@/store/chat/chatStore";
import { userAuthStore } from "@/store/auth/authStore";
import { useConversation } from "@/hooks/useConversation";
import UserSearchResults from "./UserSearchResults";
import RequestButton from "@/components/layout/popup/requestPopup";
import type { ConversationInterface } from "@/interfaces/conversationInterfaces";
import type { UserInterface } from "@/interfaces/userInterfaces";
import useDebounce from "@/hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import CreateGroupModal from "@/components/chat/CreateGroupModal";
import { useSocketStore } from "@/store/socket/socketStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, X, Plus, LogOut, MessageSquare } from "lucide-react";

function Sidebar() {
    const { conversations, setActiveConversation } = useChatStore();
    const { user, logout } = userAuthStore();
    const navigate = useNavigate();
    const { onlineUsers } = useSocketStore();
    const { loadMoreConversations, hasMore, loadingMore } = useConversation();
    const [searchInput, setSearchInput] = useState("");
    const [showCreateGroup, setShowCreateGroup] = useState(false);

    useConversation();
    const debouncedName = useDebounce(searchInput.trim(), 1000);

    const handleLogout = async () => { await logout(); navigate("/login"); };

    const nametag = user?.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

    return (
        // bg-card = Pearl Aqua from CSS variable
        <div className="flex flex-col h-full bg-card border-r border-border">

            {/* TOP BAR */}
            <div className="px-4 pt-5 pb-3.5 border-b border-border space-y-3.5 flex-shrink-0">

                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                            <span className="text-primary-foreground font-bold text-sm">{nametag}</span>
                        </div>
                        <h2 className="text-card-foreground font-bold text-base truncate">{user?.name}</h2>
                    </div>
                    <RequestButton />
                </div>

                <div className="flex items-center justify-between">
                    <h2 className="text-card-foreground font-bold text-base">Chats</h2>
                    <Button
                        variant="ghost" size="icon"
                        onClick={() => setShowCreateGroup(true)}
                        className="w-8 h-8 text-card-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                {showCreateGroup && <CreateGroupModal onClose={() => setShowCreateGroup(false)} />}

                <div className="relative">
                    <Search className="absolute inset-y-0 left-3 my-auto w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                        type="text"
                        placeholder="Search by name..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="pl-10 pr-10"
                    />
                    {searchInput && (
                        <button
                            onClick={() => setSearchInput("")}
                            className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-card-foreground"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* CONTENT — keep overflow-y-auto, NOT ScrollArea */}
            <div className="flex-1 overflow-y-auto px-3 pt-3 hide-scrollbar">
                {debouncedName ? (
                    <UserSearchResults searchName={debouncedName} />
                ) : (
                    <>
                        {conversations?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-72 text-center space-y-4 p-8">
                                {/* bg-muted is valid, card/50 is NOT */}
                                <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center">
                                    <MessageSquare className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-card-foreground mb-1">No conversations yet</h3>
                                    <p className="text-sm text-muted-foreground">Search by name to connect with people</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-1 pb-4">
                                {conversations.map((conversation: ConversationInterface) => {
                                    let displayName = "";
                                    let initials = "";
                                    let isGroup = false;
                                    let otherUserId = "";

                                    if (conversation.is_group) {
                                        isGroup = true;
                                        displayName = conversation.group_name || "Group Chat";
                                        initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
                                    } else {
                                        const otherUser = conversation.participants?.find((p: UserInterface) => p._id !== user?._id);
                                        displayName = otherUser?.name || "Unknown";
                                        initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
                                        otherUserId = otherUser?._id ?? "";
                                    }

                                    const isOnline = !isGroup && onlineUsers.get(otherUserId) === true;
                                    const unread = conversation.unreadCount ?? 0;

                                    return (
                                        <div
                                            key={conversation._id}
                                            onClick={() => {
                                                setActiveConversation(conversation);
                                                useChatStore.getState().clearUnread(conversation._id);
                                            }}
                                            className="group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors hover:bg-accent border border-transparent hover:border-border"
                                        >
                                            <div className="relative flex-shrink-0">
                                                <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center shadow-sm">
                                                    <span className="font-bold text-sm text-primary-foreground">{initials}</span>
                                                </div>
                                                {!isGroup && (
                                                    <div
                                                        className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card"
                                                        style={{ backgroundColor: isOnline ? "hsl(var(--online))" : "hsl(var(--offline))" }}
                                                    />
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-semibold text-card-foreground truncate">{displayName}</h3>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <span className="text-xs text-muted-foreground">{isGroup ? "Group" : "Direct"}</span>
                                                    {!isGroup && (
                                                        <span
                                                            className="text-xs font-medium"
                                                            style={{ color: isOnline ? "hsl(var(--online))" : "hsl(var(--offline))" }}
                                                        >
                                                            · {isOnline ? "Online" : "Offline"}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {unread > 0 && (
                                                <Badge className="min-w-[20px] h-5 flex items-center justify-center rounded-full text-[10px] font-bold px-1.5 border-0">
                                                    {unread > 99 ? "99+" : unread}
                                                </Badge>
                                            )}
                                        </div>
                                    );
                                })}

                                {hasMore && (
                                    <Button
                                        variant="ghost"
                                        onClick={loadMoreConversations}
                                        disabled={loadingMore}
                                        className="w-full text-xs text-muted-foreground hover:text-card-foreground h-9 mt-1"
                                    >
                                        {loadingMore ? "Loading..." : "Load more"}
                                    </Button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            <Separator />

            {/* FOOTER */}
            <div className="px-3 py-3 flex-shrink-0">
                <div className="flex items-center justify-between gap-3 bg-muted rounded-xl px-3 py-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-primary-foreground font-bold text-xs">{nametag}</span>
                        </div>
                        <span className="text-sm text-card-foreground font-medium truncate">{user?.name || "User"}</span>
                    </div>
                    <Button
                        variant="ghost" size="sm"
                        onClick={handleLogout}
                        className="flex-shrink-0 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1.5"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;