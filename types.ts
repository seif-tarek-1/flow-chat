
export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  status?: string;
  online?: boolean;
  email: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Chat {
  id: string;
  participantIds: string[];
  messages: Message[];
  unreadCount?: number;
}

export type Page = 'AUTH' | 'CHATS' | 'SETTINGS';

export type Theme = 'light' | 'dark';
