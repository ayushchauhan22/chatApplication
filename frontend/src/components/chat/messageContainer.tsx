import { useMessages } from "@/hooks/useMessages";
import { userAuthStore } from "@/store/auth/authStore";
import { useChatStore } from "@/store/chat/chatStore";
import { useEffect, useRef, useState } from "react";
import { listenMessages, removeMessageListener, sendMessageSocket } from "@/sockets/events/chatEvents";
import type { UserInterface } from "@/interfaces/userInterfaces";
import type { MessageInterface } from "@/interfaces/messageInterfaces";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useFileDownload } from "@/hooks/useFileDownload";
import { useGroupMenu } from "@/hooks/useGroupMenu";
import { listenMessageStatus, sendSeen, stopListeningMessageStatus } from "@/sockets/events/statusEvents";
import { toast } from "sonner";
import { deleteMessageService } from "@/services/messageServices";
import { deleteConversationService } from "@/services/conversationService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { MoreHorizontal, Trash2, Send, Paperclip, Download, UserPlus, UserMinus, Loader2, X, MessageCircle } from "lucide-react";

function MessageContainer() {
    const { loadMore, hasMore, loadingMore } = useMessages();
    const { messages, activeConversation } = useChatStore();
    const { user } = userAuthStore();
    const [text, setText] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);
    const [confirmDelete, setConfirmDelete] = useState<{ type: "message" | "conversation"; id: string } | null>(null);

    const { fileInputRef, selectedFile, uploading, uploadProgress, handleFileSelect, clearFile, uploadAndSend } =
        useFileUpload(activeConversation?._id ?? "", user?._id ?? "");

    const { downloading, downloadProgress, handleDownload } = useFileDownload();

    const { menuRef, modal, setModal, searchQuery, setSearchQuery, targetUserId, setTargetUserId,
        handleCloseModal, handleConfirm, searchByName, foundUser, searching, searchError, loading, reset, notInList,
    } = useGroupMenu();

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
    
    useEffect(() => {
        listenMessages(); listenMessageStatus();
        return () => { removeMessageListener(); stopListeningMessageStatus(); };
    }, []);

    useEffect(() => {
        if (!activeConversation || !user?._id || messages.length === 0) return;
        messages.forEach((msg) => {
            const isSender = msg.sender?._id?.toString() === user._id || msg.sender?.toString() === user._id;
            if (isSender || msg.messageStatus?.status === "seen") return;
            sendSeen({ messageId: msg._id, conversationId: activeConversation._id, userId: user._id });
        });
    }, [activeConversation?._id, messages]);

    const handleSend = async () => {
        if (!text.trim() && !selectedFile) return;
        if (!activeConversation) return;
        if (selectedFile) { await uploadAndSend(text); setText(""); return; }
        sendMessageSocket({ conversationId: activeConversation._id, content: text.trim(), senderId: user?._id });
        setText("");
    };
    const handleDeleteMessage = async () => {
        if (!confirmDelete || confirmDelete.type !== "message") return;
        try { await deleteMessageService(confirmDelete.id); }
        catch { toast.error("Failed to delete message"); }
        finally { setConfirmDelete(null); }
    };
    const handleDeleteConversation = async () => {
        if (!confirmDelete || confirmDelete.type !== "conversation") return;
        try { await deleteConversationService(activeConversation!._id); toast.success("Conversation deleted"); }
        catch { toast.error("Failed to delete conversation"); }
        finally { setConfirmDelete(null); }
    };

    if (!activeConversation) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-background">
                <div className="text-center space-y-3 card p-6">
                    <div className="w-16 h-16 mx-auto bg-muted/50 rounded-2xl flex items-center justify-center shadow-sm">
                        <MessageCircle className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">No conversation selected</h2>
                    <p className="text-sm text-muted-foreground">Choose a chat from the sidebar</p>
                </div>
            </div>
        );
    }

    let displayName = "";
    let initials = "";
    if (activeConversation.is_group) {
        displayName = activeConversation.group_name || "Group";
        initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
    } else {
        const otherUser = activeConversation.participants?.find((p: UserInterface) => p._id !== user?._id);
        displayName = otherUser?.name || "User";
        initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
    }

    return (
        <div className="flex flex-col h-full bg-background relative">

            {/* Header */}
            <div className="bg-card border-b border-border px-4 py-3 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-primary/90 ring-2 ring-background/50 shadow-sm rounded-xl flex items-center justify-center flex-shrink-0 elevated-hover">
                        <span className="font-bold text-primary-foreground text-sm">{initials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-base font-semibold text-card-foreground truncate leading-tight">{displayName}</h2>
                        {activeConversation?.is_group && (
                            <p className="text-xs text-muted-foreground truncate mt-1">
                                {activeConversation.participants?.filter((p: UserInterface) => p._id !== user?._id).map((p: UserInterface) => p.name).join(", ")}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0" ref={menuRef}>
                        {activeConversation.is_group && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="w-9 h-9 shadow-sm hover:shadow-md text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-44">
                                    <DropdownMenuItem onClick={() => setModal("add")} className="gap-2 cursor-pointer rounded-lg">
                                        <UserPlus className="w-4 h-4" /> Add Member
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setModal("remove")} className="gap-2 cursor-pointer text-destructive rounded-lg hover:bg-destructive/10 focus:bg-destructive/10">
                                        <UserMinus className="w-4 h-4" /> Remove Member
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                        <Button variant="ghost" size="icon"
                            onClick={() => setConfirmDelete({ type: "conversation", id: activeConversation._id })}
                            className="w-9 h-9 shadow-sm hover:shadow-md text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Messages — bg-background = Stormy Teal */}
            <div className="flex-1 px-5 py-4 overflow-y-auto space-y-3 hide-scrollbar bg-background">
                {hasMore && (
                    <div className="flex justify-center pb-1">
                        <Button variant="ghost" size="sm" onClick={loadMore} disabled={loadingMore}
                            className="text-xs text-muted-foreground hover:text-foreground h-8">
                            {loadingMore ? <><Loader2 className="w-3 h-3 animate-spin mr-1" />Loading...</> : "Load older messages"}
                        </Button>
                    </div>
                )}

                {messages.map((msg: MessageInterface) => {
                    const isSender =
                        msg.sender?._id?.toString() === user?._id?.toString() ||
                        msg.sender?.toString() === user?._id?.toString();

                    return (
                        <div key={msg._id} className={`flex w-full items-end gap-2 group ${isSender ? "justify-end" : "justify-start"}`}>

                            {/* Receiver avatar */}
                            {!isSender && (
                                <div className="w-8 h-8 bg-primary/90 ring-2 ring-background/80 shadow-sm rounded-xl flex items-center justify-center flex-shrink-0 elevated-hover">
                                    <span className="text-xs font-bold text-primary-foreground">
                                        {(msg.sender?.name || "U").slice(0, 2).toUpperCase()}
                                    </span>
                                </div>
                            )}

                            {/* Delete button */}
                            {isSender && (
                                <Button variant="ghost" size="icon"
                                    onClick={() => setConfirmDelete({ type: "message", id: msg._id })}
                                    className="opacity-0 group-hover:opacity-100 transition-all w-8 h-8 shadow-sm hover:shadow-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0 self-center order-first">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            )}

                            <div className="max-w-sm lg:max-w-md space-y-1.5">
                                <div
                                    style={{
                                        backgroundColor: isSender ? 'hsl(var(--message-self))' : 'hsl(var(--message-other))',
                                        color: isSender ? 'hsl(var(--message-self-fg))' : 'hsl(var(--message-other-fg))',
                                    }}
                                    className={isSender
                                        ? "shadow-sm rounded-[18px] rounded-tr-sm px-3.5 py-2.5"
                                        : "shadow-sm border border-border rounded-[18px] rounded-tl-sm px-3.5 py-2.5"
                                    }
                                >
                                    {msg.content && <p className="text-sm leading-relaxed break-words">{msg.content}</p>}
                                    {msg.fileUrl && (
                                        <div className={`flex items-center gap-2 ${msg.content ? "mt-1.5" : ""} p-2.5 bg-muted/50 rounded-xl shadow-sm`}>
                                            <Paperclip className="w-4 h-4 flex-shrink-0 opacity-80" />
                                            <span className="text-xs font-medium opacity-90 truncate flex-1">{msg.filename?.split(".")[0]}</span>
                                            <Button variant="ghost" size="icon" onClick={() => handleDownload(msg)}
                                                className="w-7 h-7 shadow-sm hover:shadow-md hover:bg-accent/50 opacity-90 hover:opacity-100">
                                                <Download className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className={`text-xs font-medium text-muted-foreground ${isSender ? "ml-auto" : ""}`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </p>

                                    {/* Ticks */}
                                    {isSender && (
                                        <div className="flex gap-0.5">
                                            {msg.messageStatus?.status === "seen" ? (
                                                <>
                                                    <svg className="w-4 h-4 -mr-0.5" fill="none" stroke="currentColor"
                                                        style={{ color: "var(--accent)" }} viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor"
                                                        style={{ color: "var(--accent)" }} viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </>
                                            ) : msg.messageStatus?.status === "delivered" ? (
                                                <>
                                                    <svg className="w-4 h-4 text-muted-foreground -mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </>
                                            ) : (
                                                <svg className="w-4 h-4 text-muted-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {isSender && activeConversation.is_group && (msg?.messageStatus?.seenBy?.length ?? 0) > 0 && (
                                    <p className="text-xs text-muted-foreground ml-auto">
                                        Seen by {msg?.messageStatus?.seenBy?.length}
                                    </p>
                                )}
                            </div>

                            {/* Sender avatar */}
                            {isSender && (
                                <div className="w-8 h-8 bg-primary/90 ring-2 ring-background/80 shadow-sm rounded-xl flex items-center justify-center flex-shrink-0 elevated-hover">
                                    <span className="text-xs font-bold text-primary-foreground">
                                        {(user?.name || "U").slice(0, 2).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            {/* File preview */}
            {selectedFile && (
                <div className="mx-4 mb-3 flex items-center gap-2 px-4 py-3 bg-muted/80 rounded-xl border border-border/50 shadow-inner">
                    <Paperclip className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm font-medium text-card-foreground truncate flex-1">{selectedFile.name}</span>
                    {!uploading && (
                        <Button variant="ghost" size="icon" onClick={clearFile}
                            className="w-7 h-7 shadow-sm hover:shadow-md text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                            <X className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            )}

            <Separator className="mx-4" />

            {/* Input bar */}
            <div className="bg-card px-4 py-3 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}
                        className="w-10 h-10 shadow-sm hover:shadow-md flex-shrink-0 text-muted-foreground hover:text-primary hover:bg-accent/80">
                        <Paperclip className="w-4 h-4" />
                    </Button>
                    <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect} />
                    <div className="flex-1 relative">
                        <Input
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
                            type="text"
                            placeholder={selectedFile ? "Add a caption..." : "Type a message..."}
                            className="pr-12 shadow-sm ring-1 ring-border/50"
                        />
                        <Button variant="ghost" size="icon" onClick={handleSend} disabled={uploading}
                            className="absolute right-0.5 inset-y-0 my-auto w-9 h-9 shadow-sm hover:shadow-md text-muted-foreground hover:text-primary hover:bg-accent/50">
                            {uploading
                                ? <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                : <Send className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform" />
                            }
                        </Button>
                    </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center font-medium">Press Enter to send</p>
            </div>

            <Dialog open={!!modal} onOpenChange={(open) => { if (!open) handleCloseModal(); }}>
                <DialogContent className="w-80 p-6 space-y-4">
                    <DialogTitle className="text-card-foreground font-semibold text-base">
                        {modal === "add" ? "Add Member" : "Remove Member"}
                    </DialogTitle>

                    {modal === "add" ? (
                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <Input value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value); reset(); }}
                                    onKeyDown={(e) => { if (e.key === "Enter") searchByName(searchQuery); }}
                                    placeholder="Search by name..." className="flex-1" />
                                <Button size="sm" onClick={() => searchByName(searchQuery)} disabled={searching || !searchQuery.trim()}>
                                    {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
                                </Button>
                            </div>
                            {searchError && !notInList && <p className="text-destructive text-xs">{searchError}</p>}
                            {notInList && (
                                <div className="p-3 bg-muted rounded-xl border border-border">
                                    <p className="text-muted-foreground text-xs mb-1.5">This user is not in your contact list.</p>
                                    <button onClick={() => { toast.info("Send a chat request from the sidebar"); handleCloseModal(); }}
                                        className="text-xs text-primary underline">Send a chat request instead?</button>
                                </div>
                            )}
                            {foundUser && (
                                <div className="flex items-center gap-3 p-3 bg-accent rounded-xl border border-border">
                                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-xs font-bold text-primary-foreground">{foundUser.name?.[0]?.toUpperCase()}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-card-foreground">{foundUser.name}</p>
                                        <p className="text-xs text-muted-foreground">{foundUser.phone}</p>
                                    </div>
                                    <span className="text-xs text-primary font-medium">✓ Found</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-1.5 max-h-48 overflow-y-auto">
                            {activeConversation.participants?.filter((p: UserInterface) => p._id !== user?._id).map((p: UserInterface) => (
                                <div key={p._id} onClick={() => setTargetUserId(String(p._id))}
                                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors border ${targetUserId === p._id
                                        ? "bg-destructive/10 border-destructive/30"
                                        : "bg-muted border-transparent hover:border-border"
                                        }`}>
                                    <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                                        <span className="text-xs font-bold text-primary-foreground">{p.name?.[0]?.toUpperCase()}</span>
                                    </div>
                                    <span className="text-sm text-card-foreground">{p.name}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <Button variant="secondary" onClick={handleCloseModal} className="flex-1">Cancel</Button>
                        <Button onClick={handleConfirm}
                            disabled={modal === "add" ? !foundUser || loading : !targetUserId || loading}
                            variant={modal === "remove" ? "destructive" : "default"} className="flex-1">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                            {modal === "add" ? "Add" : "Remove"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Confirm delete */}
            <Dialog open={!!confirmDelete} onOpenChange={(open) => { if (!open) setConfirmDelete(null); }}>
                <DialogContent className="w-72 p-6 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-destructive/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Trash2 className="w-5 h-5 text-destructive" />
                        </div>
                        <div>
                            <DialogTitle className="text-card-foreground font-semibold text-base">
                                {confirmDelete?.type === "message" ? "Delete Message" : "Delete Conversation"}
                            </DialogTitle>
                            <p className="text-muted-foreground text-xs mt-0.5">
                                {confirmDelete?.type === "message" ? "Removed for everyone." : "This cannot be undone."}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="secondary" onClick={() => setConfirmDelete(null)} className="flex-1">Cancel</Button>
                        <Button variant="destructive" onClick={confirmDelete?.type === "message" ? handleDeleteMessage : handleDeleteConversation} className="flex-1">Delete</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {(uploading || downloading) && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                    <div className="flex flex-col items-center gap-3">
                        <div className="relative w-20 h-20">
                            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                                <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" className="text-border" strokeWidth="6" />
                                <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" className="text-primary" strokeWidth="6"
                                    strokeLinecap="round"
                                    strokeDasharray={`${2 * Math.PI * 34}`}
                                    strokeDashoffset={`${2 * Math.PI * 34 * (1 - (uploading ? uploadProgress : downloadProgress) / 100)}`}
                                    style={{ transition: "stroke-dashoffset 0.2s ease" }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-foreground text-sm font-bold">
                                    {uploading ? uploadProgress : downloadProgress}%
                                </span>
                            </div>
                        </div>
                        <p className="text-muted-foreground text-xs">{uploading ? "Uploading..." : "Downloading..."}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MessageContainer;