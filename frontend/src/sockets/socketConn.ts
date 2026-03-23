import { io } from "socket.io-client";
export const API_URL = import.meta.env.VITE_API_URL;

export const socket = io(API_URL, {
  withCredentials: true,
  autoConnect: false, 
});
