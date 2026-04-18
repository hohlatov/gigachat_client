export interface MessageImage {
  data: string;      
  mimeType: string; 
}

export interface Message {
  id: string;
  content: string;
  role: 'system' | 'user' | 'assistant';
  timestamp: Date;
  image?: MessageImage; 
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Settings {
  model: 'GIGACHAT' | 'GIGACHAT_PLUS' | 'GIGACHAT_PRO' | 'GIGACHAT_MAX';
  temperature: number;
  topP: number;
  maxTokens: number;
  systemPrompt: string;
  theme: 'light' | 'dark';
}

export interface AuthCredentials {
  credentials: string;
  scope: 'GIGACHAT_API_PERS' | 'GIGACHAT_API_B2B' | 'GIGACHAT_API_CORP';
}

export interface ChatState {
  chats: Chat[];
  activeChatId: string | null;
  isLoading: boolean;
  error: string | null;
}

export type ChatAction =
  | { type: 'LOAD_STATE'; payload: Pick<ChatState, 'chats' | 'activeChatId'> }
  | { type: 'CREATE_CHAT'; payload: { id: string; title: string } }
  | { type: 'SET_ACTIVE_CHAT'; payload: string | null }
  | { type: 'RENAME_CHAT'; payload: { chatId: string; title: string } }
  | { type: 'DELETE_CHAT'; payload: { chatId: string } }
  | { type: 'ADD_MESSAGE'; payload: { chatId: string; message: Message } }
  | { type: 'UPDATE_MESSAGE'; payload: { chatId: string; messageId: string; content: string } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };