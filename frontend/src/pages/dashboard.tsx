import Sidebar from "../components/layout/sidebar/sidebar";
import MessageContainer from "../components/chat/messageContainer";
import { socket } from "@/sockets/socketConn";
import { userAuthStore } from "@/store/auth/authStore";
import { useEffect } from "react";
import { useConversation } from "@/hooks/useConversation";

function Home() {
    const { user } = userAuthStore();
    useConversation();

    useEffect(() => {
        if (user?._id) {
            socket.connect();
            socket.emit("user_connected", user._id);
        }
        return () => { socket.disconnect(); };
    }, [user]);

    return (
        // bg-background = your theme color from index.css, NOT hardcoded dark gradient
        <div className="flex h-screen w-screen bg-background text-foreground">
            <div className="flex-shrink-0 w-72 h-full">
                <Sidebar />
            </div>
            <div className="flex-1 h-full min-w-0">
                <MessageContainer />
            </div>
        </div>
    );
}

export default Home;