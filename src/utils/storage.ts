import { ChatState, Chat, Message } from '../types';

const CHAT_STATE_KEY = 'gigachat.chat-state.v1';

interface PersistedChatState {
  chats: Array<{
    id: string;
    title: string;
    messages: Array<{
      id: string;
      content: string;
      role: Message['role'];
      timestamp: string;
    }>;
    createdAt: string;
    updatedAt: string;
  }>;
  activeChatId: string | null;
}

const deserializeChat = (chat: PersistedChatState['chats'][number]): Chat => ({
  ...chat,
  createdAt: new Date(chat.createdAt),
  updatedAt: new Date(chat.updatedAt),
  messages: chat.messages.map((message) => ({
    ...message,
    timestamp: new Date(message.timestamp),
  })),
});

export const loadChatState = (): Pick<ChatState, 'chats' | 'activeChatId'> | null => {
  try {
    const raw = localStorage.getItem(CHAT_STATE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as PersistedChatState;
    if (!Array.isArray(parsed.chats)) return null;

    return {
      chats: parsed.chats.map(deserializeChat),
      activeChatId: parsed.activeChatId ?? null,
    };
  } catch (error) {
    console.error('Failed to read chat state from localStorage', error);
    return null;
  }
};

export const saveChatState = (state: Pick<ChatState, 'chats' | 'activeChatId'>) => {
  try {
    localStorage.setItem(CHAT_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save chat state to localStorage', error);
  }
};
