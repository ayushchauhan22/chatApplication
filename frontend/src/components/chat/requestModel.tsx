import { useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useConversation } from "@/hooks/useConversation";
import { userAuthStore } from "../../store/auth/authStore";
import { useChatRequestStore } from "../../store/chat/chatRequestStore";
import { cancelRequest } from "@/services/chatRequestServices";
import { MessageSquarePlus, Inbox, Clock } from "lucide-react";

export default function RequestsModal({ open, setOpen }: any) {
    const { user } = userAuthStore();
    const { fetchConversations } = useConversation();
    const { incoming, outgoing, fetchIncoming, fetchOutgoing, accept, reject } = useChatRequestStore();

    useEffect(() => {
        if (open && user?._id) { fetchIncoming(user._id); fetchOutgoing(user._id); }
    }, [open, user]);

    useEffect(() => { fetchConversations(); }, [incoming.length, outgoing.length]);

    const getInitials = (name: string) => {
        if (!name) return "??";
        return name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-[420px] max-w-[90vw] p-0 overflow-hidden bg-card border-border">

                {/* Header */}
                <div className="px-5 pt-5 pb-4 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0">
                            <MessageSquarePlus className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-bold text-card-foreground leading-tight">
                                Chat Requests
                            </DialogTitle>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {incoming.length + outgoing.length} pending
                            </p>
                        </div>
                    </div>
                </div>

                <div className="px-5 pb-5 pt-4">
                    <Tabs defaultValue="incoming" className="w-full flex flex-col">

                        {/* Tabs — compact height */}
                        <TabsList className="w-full h-9 bg-muted rounded-xl p-1 mb-4">
                            <TabsTrigger
                                value="incoming"
                                className="flex-1 h-full rounded-lg text-xs font-medium text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all gap-1.5"
                            >
                                <Inbox className="w-3.5 h-3.5" />
                                Incoming ({incoming.length})
                            </TabsTrigger>
                            <TabsTrigger
                                value="outgoing"
                                className="flex-1 h-full rounded-lg text-xs font-medium text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all gap-1.5"
                            >
                                <Clock className="w-3.5 h-3.5" />
                                Outgoing ({outgoing.length})
                            </TabsTrigger>
                        </TabsList>

                        {/* INCOMING */}
                        <TabsContent value="incoming" className="mt-0">
                            <div className="max-h-60 overflow-y-auto overflow-x-hidden space-y-2 hide-scrollbar">
                                {incoming.length === 0 ? (
                                    <div className="text-center py-8 space-y-2">
                                        <div className="w-10 h-10 mx-auto bg-muted rounded-xl flex items-center justify-center">
                                            <Inbox className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                        <p className="text-sm font-medium text-card-foreground">No incoming requests</p>
                                        <p className="text-xs text-muted-foreground">Someone will reach out soon</p>
                                    </div>
                                ) : (
                                    incoming.map((req: any) => (
                                        <div
                                            key={req._id}
                                            className="flex items-start gap-3 p-3 bg-background rounded-xl border border-border hover:border-primary/30 hover:bg-accent/20 transition-colors w-full min-w-0"
                                        >
                                            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                                                <span className="font-bold text-sm text-primary-foreground">
                                                    {getInitials(req.sender_id?.name || "User")}
                                                </span>
                                            </div>

                                            {/* name + badge + buttons all stacked vertically */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-card-foreground truncate">
                                                    {req.sender_id?.name || "Unknown"}
                                                </p>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <span className="text-xs text-muted-foreground">wants to connect</span>
                                                    <Badge className="text-[10px] px-1.5 h-4 font-medium">New</Badge>
                                                </div>
                                                {/* buttons sit below the name — never overflow */}
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Button
                                                        size="sm"
                                                        className="h-7 px-4 text-xs flex-1"
                                                        onClick={(e) => { e.stopPropagation(); accept(req._id, String(user?._id)); }}
                                                    >
                                                        Accept
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-7 px-4 text-xs flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
                                                        onClick={(e) => { e.stopPropagation(); reject(req._id, String(user?._id)); }}
                                                    >
                                                        Decline
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </TabsContent>

                        {/* OUTGOING */}
                        <TabsContent value="outgoing" className="mt-0">
                            <div className="max-h-60 overflow-y-auto overflow-x-hidden space-y-2 hide-scrollbar">
                                {outgoing.length === 0 ? (
                                    <div className="text-center py-8 space-y-2">
                                        <div className="w-10 h-10 mx-auto bg-muted rounded-xl flex items-center justify-center">
                                            <Clock className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                        <p className="text-sm font-medium text-card-foreground">No outgoing requests</p>
                                        <p className="text-xs text-muted-foreground">Search for people to connect with</p>
                                    </div>
                                ) : (
                                    outgoing.map((req: any) => (
                                        <div
                                            key={req._id}
                                            className="flex items-start gap-3 p-3 bg-background rounded-xl border border-border transition-colors w-full min-w-0"
                                        >
                                            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shrink-0">
                                                <span className="font-bold text-sm text-primary-foreground">
                                                    {getInitials(req.receiver_id?.name || "User")}
                                                </span>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-card-foreground truncate">
                                                    {req.receiver_id?.name || "Unknown"}
                                                </p>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <Badge variant="outline" className="text-[10px] px-1.5 h-4 font-medium text-muted-foreground">
                                                        Pending
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground">awaiting response</span>
                                                </div>
                                            </div>

                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-7 px-3 text-xs shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    await cancelRequest(req._id);
                                                    fetchOutgoing(String(user?._id));
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
}