export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  lastMessageTime: Date;
  isActive?: boolean;
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