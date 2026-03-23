export interface outgoingRequestI {
  _id: string;
  sender_id: string;
  receiver_id: string | { _id: string };
  status: string;
}
