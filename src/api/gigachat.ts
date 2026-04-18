import { Message, Settings } from '../types';
import { getChatCompletionsUrl } from '../utils/gigachatUrls';

const mapMessagesForApi = (messages: Message[], settings: Settings) => {
  const payload: Array<{ role: Message['role']; content: any }> = [];

  if (settings.systemPrompt.trim()) {
    payload.push({ role: 'system', content: settings.systemPrompt.trim() });
  }

  return [
    ...payload,
    ...messages.map((message) => {
      // Если есть изображение — отправляем multimodal контент
      if (message.image) {
        return {
          role: message.role,
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:${message.image.mimeType};base64,${message.image.data}`,
              },
            },
            {
              type: 'text',
              text: message.content || 'Что на этом изображении?',
            },
          ],
        };
      }
      return {
        role: message.role,
        content: message.content,
      };
    }),
  ];
};

export const requestAssistantReply = async ({
  messages,
  settings,
  accessToken,
  onChunk,
}: {
  messages: Message[];
  settings: Settings;
  accessToken: string;
  onChunk?: (partial: string) => void;
}) => {
  const body = {
    model: settings.model,
    temperature: settings.temperature,
    top_p: settings.topP,
    max_tokens: settings.maxTokens,
    stream: true,
    messages: mapMessagesForApi(messages, settings),
  };

  const response = await fetch(getChatCompletionsUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GigaChat API error ${response.status}: ${errorText || 'Unknown error'}`);
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder('utf-8');
  let fullContent = '';

  if (!reader) throw new Error('Response body is not readable');

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n').filter((line) => line.trim());

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6).trim();
        if (data === '[DONE]') break;

        try {
          const parsed = JSON.parse(data);
          const delta = parsed.choices?.[0]?.delta?.content ?? '';
          if (delta) {
            fullContent += delta;
            if (onChunk) onChunk(fullContent);
          }
        } catch {
          // пропускаем невалидный JSON
        }
      }
    }
  }

  return fullContent;
};