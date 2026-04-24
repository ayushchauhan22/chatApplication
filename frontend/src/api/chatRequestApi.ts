import api from "./axios";


export const addRequestApi = (senderId: string, receiverId: string) => {
  return api.post("/chat-requests/send-request", {
    senderId,
    receiverId,
  });
};

export const outgoingRequestApi = (requestId: string) => {
  return api.get(`/chat-requests/outgoing-requests/${requestId}`);
};

export const incomingRequestApi = (requestId: string) => {
  return api.get(`/chat-requests/incoming-requests/${requestId}`);
};

export const acceptRequestApi = (requestId: string) => {
  return api.put(`/chat-requests/accept/${requestId}`);
};

export const rejectRequestApi = (requestId: string) => {
  return api.put(`/chat-requests/reject/${requestId}`);
};

export const cancelRequestApi = (requestId: string) =>{
  return api.put(`/chat-requests/cancel/${requestId}`);
};