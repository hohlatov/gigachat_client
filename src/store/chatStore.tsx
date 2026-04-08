import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { ChatAction, ChatState } from '../types';

const initialState: ChatState = {
  chats: [],
  activeChatId: null,
  isLoading: false,
  error: null,
};

const touchChat = <T extends { updatedAt: Date }>(chat: T): T => ({
  ...chat,
  updatedAt: new Date(),
});

export const reducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'LOAD_STATE':
      return {
        ...state,
        chats: action.payload.chats,
        activeChatId: action.payload.activeChatId,
      };
    case 'CREATE_CHAT': {
      const nextChat = {
        id: action.payload.id,
        title: action.payload.title,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return {
        ...state,
        chats: [nextChat, ...state.chats],
        activeChatId: nextChat.id,
      };
    }
    case 'SET_ACTIVE_CHAT':
      return { ...state, activeChatId: action.payload };
    case 'RENAME_CHAT':
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat.id === action.payload.chatId ? touchChat({ ...chat, title: action.payload.title }) : chat
        ),
      };
    case 'DELETE_CHAT': {
      const chats = state.chats.filter((chat) => chat.id !== action.payload.chatId);
      const activeChatId =
        state.activeChatId === action.payload.chatId ? (chats[0]?.id ?? null) : state.activeChatId;
      return { ...state, chats, activeChatId };
    }
    case 'ADD_MESSAGE':
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat.id === action.payload.chatId
            ? touchChat({ ...chat, messages: [...chat.messages, action.payload.message] })
            : chat
        ),
      };
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat.id === action.payload.chatId
            ? touchChat({
                ...chat,
                messages: chat.messages.map((message) =>
                  message.id === action.payload.messageId
                    ? { ...message, content: action.payload.content, timestamp: new Date() }
                    : message
                ),
              })
            : chat
        ),
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const ChatStateContext = createContext<ChatState | undefined>(undefined);
const ChatDispatchContext = createContext<React.Dispatch<ChatAction> | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const stateValue = useMemo(() => state, [state]);

  return (
    <ChatStateContext.Provider value={stateValue}>
      <ChatDispatchContext.Provider value={dispatch}>{children}</ChatDispatchContext.Provider>
    </ChatStateContext.Provider>
  );
};

export const useChatState = () => {
  const context = useContext(ChatStateContext);
  if (!context) {
    throw new Error('useChatState must be used within ChatProvider');
  }
  return context;
};

export const useChatDispatch = () => {
  const context = useContext(ChatDispatchContext);
  if (!context) {
    throw new Error('useChatDispatch must be used within ChatProvider');
  }
  return context;
};
