import { socket } from "@/sockets/socketConn";
import { useChatStore } from "@/store/chat/chatStore";
import { useUserStore } from "@/store/users/userStore";

export const sendMessageSocket = (data: any) => { 
  socket.emit("send_message", data);
};

export const listenMessages = () => {
  const handler = (message: any) => {
    
    // console.log("SOCKET RECEIVED:", message);
    const { addMessage } = useChatStore.getState();
    addMessage(message);
  };

  const register = () => {
    // console.log("Socket connected?", socket.connected);
    socket.off("receive_message"); 
    socket.on("receive_message", handler); 
  };

  if (socket.connected) {
    register();
  } else {
    socket.once("connect", register);
  }
};

export const removeMessageListener = () => {
  socket.off("receive_message");
};

export const listenRequestAccepted = () => {
  socket.on("request_accepted", ({ receiverId, conversation }) => {
    const { outgoingRequests, setOutgoingRequests } = useUserStore.getState();
    const { addConversation } = useChatStore.getState();

    setOutgoingRequests(
      outgoingRequests.filter(
        (req: any) =>
          req.receiver_id?._id !== receiverId && req.receiver_id !== receiverId,
      ),
    );

    addConversation(conversation);
  });
};

export const removeRequestAcceptedListener = () => {
  socket.off("request_accepted");
};

export const listenNewChatRequest = (onNewRequest: () => void) => {
  socket.off("new_chat_request");
  socket.on("new_chat_request", onNewRequest);
};

export const stopListeningNewChatRequest = () => {
  socket.off("new_chat_request");
};
