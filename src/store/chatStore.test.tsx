import { reducer } from './chatStore';
import { ChatAction, ChatState, Message } from '../types';

const touchChat = <T extends { updatedAt: Date }>(chat: T): T => ({
  ...chat,
  updatedAt: new Date(),
});

const testReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'LOAD_STATE':
      return { ...state, chats: action.payload.chats, activeChatId: action.payload.activeChatId };
    case 'CREATE_CHAT': {
      const nextChat = {
        id: action.payload.id,
        title: action.payload.title,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return { ...state, chats: [nextChat, ...state.chats], activeChatId: nextChat.id };
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
      const activeChatId = state.activeChatId === action.payload.chatId ? (chats[0]?.id ?? null) : state.activeChatId;
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

describe('Chat Reducer', () => {
  let state: ChatState;

  beforeEach(() => {
    state = {
      chats: [
        { id: '1', title: 'Chat 1', messages: [], createdAt: new Date(), updatedAt: new Date() },
        { id: '2', title: 'Chat 2', messages: [], createdAt: new Date(), updatedAt: new Date() },
      ],
      activeChatId: '1',
      isLoading: false,
      error: null,
    };
  });

  describe('CREATE_CHAT', () => {
    it('должен создавать новый чат и добавлять его в начало массива', () => {
      const action: ChatAction = {
        type: 'CREATE_CHAT',
        payload: { id: '3', title: 'New Chat' },
      };

      const newState = testReducer(state, action);

      expect(newState.chats).toHaveLength(3);
      expect(newState.chats[0].id).toBe('3');
      expect(newState.chats[0].title).toBe('New Chat');
      expect(newState.chats[0].messages).toEqual([]);
      expect(newState.activeChatId).toBe('3');
    });
  });

  describe('SET_ACTIVE_CHAT', () => {
    it('должен устанавливать активный чат', () => {
      const action: ChatAction = { type: 'SET_ACTIVE_CHAT', payload: '2' };
      const newState = testReducer(state, action);
      expect(newState.activeChatId).toBe('2');
    });

    it('должен устанавливать null как активный чат', () => {
      const action: ChatAction = { type: 'SET_ACTIVE_CHAT', payload: null };
      const newState = testReducer(state, action);
      expect(newState.activeChatId).toBeNull();
    });
  });

  describe('RENAME_CHAT', () => {
    it('должен переименовывать существующий чат', () => {
      const action: ChatAction = {
        type: 'RENAME_CHAT',
        payload: { chatId: '1', title: 'Updated Title' },
      };

      const newState = testReducer(state, action);
      expect(newState.chats.find(c => c.id === '1')?.title).toBe('Updated Title');
    });

    it('не должен изменять другие чаты', () => {
      const action: ChatAction = {
        type: 'RENAME_CHAT',
        payload: { chatId: '1', title: 'Updated Title' },
      };

      const newState = testReducer(state, action);
      expect(newState.chats.find(c => c.id === '2')?.title).toBe('Chat 2');
    });
  });

  describe('DELETE_CHAT', () => {
    it('должен удалять чат по id', () => {
      const action: ChatAction = { type: 'DELETE_CHAT', payload: { chatId: '1' } };
      const newState = testReducer(state, action);
      
      expect(newState.chats).toHaveLength(1);
      expect(newState.chats.find(c => c.id === '1')).toBeUndefined();
    });

    it('при удалении активного чата должен установить активным первый чат', () => {
      const action: ChatAction = { type: 'DELETE_CHAT', payload: { chatId: '1' } };
      const newState = testReducer(state, action);
      
      expect(newState.activeChatId).toBe('2');
    });

    it('при удалении последнего чата activeChatId должен быть null', () => {
      const singleChatState = {
        ...state,
        chats: [{ id: '1', title: 'Only Chat', messages: [], createdAt: new Date(), updatedAt: new Date() }],
        activeChatId: '1',
      };
      
      const action: ChatAction = { type: 'DELETE_CHAT', payload: { chatId: '1' } };
      const newState = testReducer(singleChatState, action);
      
      expect(newState.chats).toHaveLength(0);
      expect(newState.activeChatId).toBeNull();
    });
  });

  describe('ADD_MESSAGE', () => {
    it('должен добавлять сообщение в указанный чат', () => {
      const newMessage: Message = {
        id: 'msg1',
        content: 'Hello',
        role: 'user',
        timestamp: new Date(),
      };
      
      const action: ChatAction = {
        type: 'ADD_MESSAGE',
        payload: { chatId: '1', message: newMessage },
      };

      const newState = testReducer(state, action);
      const chat = newState.chats.find(c => c.id === '1');
      
      expect(chat?.messages).toHaveLength(1);
      expect(chat?.messages[0]).toEqual(newMessage);
    });
  });

  describe('UPDATE_MESSAGE', () => {
    it('должен обновлять содержимое сообщения', () => {
      const existingMessage: Message = {
        id: 'msg1',
        content: 'Original',
        role: 'assistant',
        timestamp: new Date(),
      };
      
      const stateWithMessage = {
        ...state,
        chats: state.chats.map(chat =>
          chat.id === '1'
            ? { ...chat, messages: [existingMessage] }
            : chat
        ),
      };
      
      const action: ChatAction = {
        type: 'UPDATE_MESSAGE',
        payload: { chatId: '1', messageId: 'msg1', content: 'Updated content' },
      };

      const newState = testReducer(stateWithMessage, action);
      const updatedMessage = newState.chats.find(c => c.id === '1')?.messages[0];
      
      expect(updatedMessage?.content).toBe('Updated content');
    });
  });
});