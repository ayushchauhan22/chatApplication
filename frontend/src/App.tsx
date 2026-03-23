import AppRoutes from "./routes/appRoutes";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { userAuthStore } from "@/store/auth/authStore";
import { connectSocket, disconnectSocket } from "@/store/socket/socketProviders";
import { socket } from "@/sockets/socketConn";
import { BrowserRouter } from "react-router-dom";
import { useChatStore } from "./store/chat/chatStore";
import { listenRequestAccepted, removeRequestAcceptedListener } from "@/sockets/events/chatEvents";
import { listenGroupUpdates, stopListeningGroupUpdates } from "@/sockets/events/conversationEvents"; // ← add

function App() {
  const { user } = userAuthStore();
  const { activeConversation } = useChatStore();

  useEffect(() => {
    if (!user?._id) return;

    const handleConnect = () => console.log("CONNECTED", socket.id);
    const handleDisconnect = () => console.log("DISCONNECTED");
    const handleError = (err: Error) => console.log("Error:", err.message);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleError);

    connectSocket();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleError);
      disconnectSocket();
    };
  }, [user?._id]);

  useEffect(() => {
    if (!user?._id) return;

    listenRequestAccepted();
    listenGroupUpdates(); // ← add

    return () => {
      removeRequestAcceptedListener();
      stopListeningGroupUpdates(); // ← add
    };
  }, [user?._id]);

  useEffect(() => {
    if (!activeConversation?._id) return;

    const joinRoom = () => {
      socket.emit("join_conversation", activeConversation._id);
      console.log("Joined room:", activeConversation._id);
    };

    if (socket.connected) {
      joinRoom();
    } else {
      socket.once("connect", joinRoom);
    }

    return () => {
      socket.off("connect", joinRoom);
    };
  }, [activeConversation?._id]);

  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster position="top-center" />
    </BrowserRouter>
  );
}

export default App;