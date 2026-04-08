import { requestAssistantReply } from './gigachat';
import { Message, Settings } from '../types';

describe('GigaChat API', () => {
  const mockMessages: Message[] = [
    { id: '1', content: 'Hello', role: 'user', timestamp: new Date() },
  ];
  
  const mockSettings: Settings = {
    model: 'GIGACHAT',
    temperature: 0.7,
    topP: 1,
    maxTokens: 1000,
    systemPrompt: 'You are helpful assistant',
    theme: 'light',
  };

  const mockAccessToken = 'test-token';

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('отправляет корректный запрос к API', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ choices: [{ message: { role: 'assistant', content: 'Hi there!' } }] }),
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    await requestAssistantReply({
      messages: mockMessages,
      settings: mockSettings,
      accessToken: mockAccessToken,
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/chat/completions'),
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockAccessToken}`,
        },
      })
    );
  });

  it('выбрасывает ошибку при неудачном запросе', async () => {
    const mockResponse = {
      ok: false,
      status: 401,
      text: async () => 'Unauthorized',
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    await expect(
      requestAssistantReply({
        messages: mockMessages,
        settings: mockSettings,
        accessToken: mockAccessToken,
      })
    ).rejects.toThrow('GigaChat API error 401: Unauthorized');
  });

  it('вызывает onChunk при получении ответа', async () => {
    const onChunk = jest.fn();
    const mockResponse = {
      ok: true,
      json: async () => ({ choices: [{ message: { role: 'assistant', content: 'Streaming response' } }] }),
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    await requestAssistantReply({
      messages: mockMessages,
      settings: mockSettings,
      accessToken: mockAccessToken,
      onChunk,
    });

    expect(onChunk).toHaveBeenCalledWith('Streaming response');
  });
});