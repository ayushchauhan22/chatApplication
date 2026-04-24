import type { UserInterface } from "./userInterfaces";

export interface SeenBy {
  user_id: string;
  seenAt: string;
}

export interface SeenByDetail {
  user: {
    _id: string;
    name: string;
  };
  seenAt: string;
}

export interface MessageStatusInterface {
  _id?: string;
  message_id?: string;
  status: "sent" | "delivered" | "seen";
  seenBy?: SeenBy[];
  deliveredAt?: string;
  seenAt?: string;
  lastSeenMessageId?: string | null;
}

export interface MessageInterface {
  _id: string;
  sender: UserInterface;
  conversation_id: string;
  content: string | null;
  createdAt: string;
  fileUrl?: string | null;
  uploadId?: string | null;
  messageStatus?: MessageStatusInterface | null;
  filename: string;
}

export interface MessageInfoModalProps {
  messageId: string | null;
  onClose: () => void;
}
