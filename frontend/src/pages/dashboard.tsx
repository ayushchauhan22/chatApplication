import Sidebar from "../components/layout/sidebar/sidebar";
import MessageContainer from "../components/chat/messageContainer";
import { useConversation } from "@/hooks/useConversation";

function Home() {
    useConversation();

    return (
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