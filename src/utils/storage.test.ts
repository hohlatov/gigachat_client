import { loadChatState, saveChatState } from './storage';

describe('storage utilities', () => {
  const mockState = {
    chats: [
      {
        id: '1',
        title: 'Test Chat',
        messages: [
          {
            id: 'm1',
            content: 'Hello',
            role: 'user' as const,
            timestamp: new Date('2024-01-01T10:00:00Z'),
          },
        ],
        createdAt: new Date('2024-01-01T09:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      },
    ],
    activeChatId: '1',
  };

  let localStorageMock: Record<string, string> = {};

  beforeEach(() => {
    localStorageMock = {};
    
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => localStorageMock[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          localStorageMock[key] = value;
        }),
        clear: jest.fn(() => {
          localStorageMock = {};
        }),
      },
      writable: true,
    });
  });

  describe('saveChatState', () => {
    it('сохраняет состояние в localStorage', () => {
      saveChatState(mockState);
      
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'gigachat.chat-state.v1',
        expect.any(String)
      );
    });
  });

  describe('loadChatState', () => {
    it('загружает состояние из localStorage и преобразует даты', () => {
      const serializedState = {
        chats: [
          {
            id: '1',
            title: 'Test Chat',
            messages: [
              {
                id: 'm1',
                content: 'Hello',
                role: 'user',
                timestamp: '2024-01-01T10:00:00.000Z',
              },
            ],
            createdAt: '2024-01-01T09:00:00.000Z',
            updatedAt: '2024-01-01T10:00:00.000Z',
          },
        ],
        activeChatId: '1',
      };
      
      localStorageMock['gigachat.chat-state.v1'] = JSON.stringify(serializedState);
      
      const loaded = loadChatState();
      
      expect(loaded).not.toBeNull();
      expect(loaded?.chats[0].createdAt).toBeInstanceOf(Date);
      expect(loaded?.chats[0].messages[0].timestamp).toBeInstanceOf(Date);
      expect(loaded?.activeChatId).toBe('1');
    });

    it('возвращает null если данных нет', () => {
      const loaded = loadChatState();
      expect(loaded).toBeNull();
    });

    it('возвращает null при невалидном JSON', () => {
      localStorageMock['gigachat.chat-state.v1'] = '{invalid json}';
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const loaded = loadChatState();
      
      expect(loaded).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});