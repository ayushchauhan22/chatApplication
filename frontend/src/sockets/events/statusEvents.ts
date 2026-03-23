import { socket } from "@/sockets/socketConn";
import { useChatStore } from "@/store/chat/chatStore";
import { useSocketStore } from "@/store/socket/socketStore";

export const listenOnlineUsers = () => {
  socket.on("online_users", (users: string[]) => {
    useSocketStore.getState().setOnlineUsers(users);
  });

  socket.on("user_came_online", (userId: string) => {
    useSocketStore.getState().addOnlineUser(userId);
  });

  socket.on("user_went_offline", (userId: string) => {
    useSocketStore.getState().removeOnlineUser(userId);
  });
};

export const stopListeningOnlineUsers = () => {
  socket.off("online_users");
  socket.off("user_came_online");
  socket.off("user_went_offline");
};

export const sendDelivered = (data: any) => {
  socket.emit("message_delivered", data);
};

export const sendSeen = (data: any) => {
  socket.emit("message_seen", data);
};

export const listenMessageStatus = () => {
  socket.off("message_status_updated");
  socket.on("message_status_updated", (data) => {
    useChatStore
      .getState()
      .updateMessageStatus(data.messageId, data.status, data.seenBy);
  });
};;

export const stopListeningMessageStatus = () => {
  socket.off("message_status_updated");
};