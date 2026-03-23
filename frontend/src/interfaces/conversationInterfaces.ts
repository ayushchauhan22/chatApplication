import type { UserInterface } from "./userInterfaces";
import type { MessageInterface } from "./messageInterfaces";

export interface ConversationInterface {
  _id: string;
  participants: UserInterface[];
  is_group: boolean;
  group_name?: string | null;
  lastMessage?: MessageInterface | null; 
  unreadCount?: number; 
  updatedAt?: string; 
}
