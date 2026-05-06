import { http } from './http';

export interface Conversation {
  userId: string;
  userDisplayName: string;
  userAvatarUrl?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount?: number;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderDisplayName: string;
  createdAt: string;
}

export const chatApi = {
  getConversations: async (): Promise<Conversation[]> => {
    try {
      const res = await http.get<Conversation[]>('/chat/conversations');
      return (res as any).data || [];
    } catch {
      return [];
    }
  },

  getMessages: async (userId: string): Promise<Message[]> => {
    try {
      const res = await http.get<Message[]>(`/chat/${userId}/messages`);
      return (res as any).data || [];
    } catch {
      return [];
    }
  },

  sendMessage: async (userId: string, content: string): Promise<Message> => {
    const res = await http.post<Message>(`/chat/${userId}/messages`, { content });
    return (res as any).data;
  },
};
