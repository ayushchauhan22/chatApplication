import { useEffect, useState } from "react";
import RequestsModal from "@/components/chat/requestModel";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { userAuthStore } from "@/store/auth/authStore";
import { useChatRequestStore } from "@/store/chat/chatRequestStore";
import { listenNewChatRequest, stopListeningNewChatRequest } from "@/sockets/events/chatEvents";

export function RequestButton() {
    const [open, setOpen] = useState(false);
    const { user } = userAuthStore();
    const { incoming, fetchIncoming} = useChatRequestStore();

    useEffect(() => {
        if (!user?._id) return;
        fetchIncoming(user._id);
    }, [user?._id]);

    useEffect(() => {
        if (!user?._id) return;

        listenNewChatRequest(() => {
            fetchIncoming(String(user._id));
        });

        return () => stopListeningNewChatRequest();
    }, [user?._id]);

    const handleClose = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen && user?._id){
            fetchIncoming(String(user._id));
        };

    };

    const count = incoming.length ;

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(true)}
                className="relative w-9 h-9 text-muted-foreground hover:text-card-foreground hover:bg-accent transition-colors"
                title={count > 0 ? `${count} pending request${count > 1 ? "s" : ""}` : "Chat Requests"}
            >
                <Bell className="w-5 h-5" />

                {count > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
                        {count > 99 ? "99+" : count}
                    </span>
                )}
            </Button>

            <RequestsModal open={open} setOpen={handleClose} />
        </>
    );
}

export default RequestButton;