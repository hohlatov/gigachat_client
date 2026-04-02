import { Message, Settings } from '../types';
import { getChatCompletionsUrl } from '../utils/gigachatUrls';

interface GigaChatResponse {
  choices?: Array<{
    message?: {
      role: 'assistant';
      content: string;
    };
  }>;
}

const mapMessagesForApi = (messages: Message[], settings: Settings) => {
  const payload: Array<{ role: Message['role']; content: string }> = [];
  if (settings.systemPrompt.trim()) {
    payload.push({ role: 'system', content: settings.systemPrompt.trim() });
  }
  return [
    ...payload,
    ...messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
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
    stream: false,
    messages: mapMessagesForApi(messages, settings),
  };

  const response = await fetch(getChatCompletionsUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GigaChat API error ${response.status}: ${errorText || 'Unknown error'}`);
  }

  const data = (await response.json()) as GigaChatResponse;
  const content = data.choices?.[0]?.message?.content ?? '';
  if (onChunk) onChunk(content);
  return content;
};
