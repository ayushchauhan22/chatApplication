import { socket } from "@/sockets/socketConn";
import { userAuthStore } from "@/store/auth/authStore";
import {
  listenOnlineUsers,
  stopListeningOnlineUsers,
  listenMessageStatus,
  stopListeningMessageStatus,
} from "@/sockets/events/statusEvents";

let listenersRegistered = false;

export const connectSocket = () => {
  const user = userAuthStore.getState().user;
  if (!user?._id) return;


  if (!listenersRegistered) {
    listenOnlineUsers();
    listenMessageStatus();
    listenersRegistered = true;
  }

  if (socket.connected) {
    socket.emit("user_connected", user._id);
    return;
  }

  socket.once("connect", () => {
    socket.emit("user_connected", user._id);
  });

  socket.connect();
};

export const disconnectSocket = () => {
  if (socket.connected) {
    stopListeningOnlineUsers();
    stopListeningMessageStatus();
    listenersRegistered = false;
    socket.disconnect();
  }
};
