import React, { useEffect, useRef } from 'react';
import { Chat as ChatType, Message as MessageType, MessageImage, Settings } from '../../types';
import { MessageList } from './MessageList';
import { InputArea } from './InputArea';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { useChatDispatch } from '../../store/chatStore';
import { requestAssistantReply } from '../../api/gigachat';
import './ChatWindow.css';

interface ChatWindowProps {
  activeChat: ChatType | null;
  isLoading: boolean;
  error: string | null;
  settings: Settings;
  accessToken: string;
  onSettingsClick: () => void;
  onMenuClick?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  activeChat,
  isLoading,
  error,
  settings,
  accessToken,
  onSettingsClick,
  onMenuClick,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dispatch = useChatDispatch();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages, isLoading]);

  const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const handleStopGeneration = () => dispatch({ type: 'SET_LOADING', payload: false });

  const makeChatTitle = (value: string) => {
    const normalized = value.trim().replace(/\s+/g, ' ');
    if (normalized.length >= 5) {
      return normalized.length > 40 ? `${normalized.slice(0, 40)}...` : normalized;
    }
    return 'Новый чат';
  };

  const handleSendMessage = async (text: string, image?: MessageImage) => {
    const trimmed = text.trim();
    if ((!trimmed && !image) || isLoading || !activeChat) return;

    const userMessage: MessageType = {
      id: createId(),
      content: trimmed,
      role: 'user',
      timestamp: new Date(),
      image: image,
    };

    if (!activeChat.messages.length && activeChat.title === 'Новый чат') {
      dispatch({
        type: 'RENAME_CHAT',
        payload: { chatId: activeChat.id, title: makeChatTitle(trimmed) },
      });
    }

    dispatch({ type: 'ADD_MESSAGE', payload: { chatId: activeChat.id, message: userMessage } });
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    const assistantId = createId();
    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        chatId: activeChat.id,
        message: { id: assistantId, content: '', role: 'assistant', timestamp: new Date() },
      },
    });

    try {
      const nextMessages = [...activeChat.messages, userMessage];
      await requestAssistantReply({
        messages: nextMessages,
        settings,
        accessToken,
        onChunk: (content) =>
          dispatch({
            type: 'UPDATE_MESSAGE',
            payload: { chatId: activeChat.id, messageId: assistantId, content },
          }),
      });
    } catch (apiError) {
      dispatch({
        type: 'UPDATE_MESSAGE',
        payload: {
          chatId: activeChat.id,
          messageId: assistantId,
          content: 'Не удалось получить ответ от API. Проверьте токен и настройки подключения.',
        },
      });
      dispatch({
        type: 'SET_ERROR',
        payload: apiError instanceof Error ? apiError.message : 'API error',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  if (!activeChat) {
    return (
      <div className="chat-window">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="chat-window">
      <header className="chat-window-header">
        <div className="chat-window-header-left">
          {onMenuClick && (
            <button className="chat-menu-btn" onClick={onMenuClick}>
              <svg viewBox="0 0 20 20" fill="currentColor" width="24" height="24">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          <h2 className="chat-window-title">{activeChat.title}</h2>
        </div>
        <Button onClick={onSettingsClick} variant="ghost" size="sm">
          <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        </Button>
      </header>
      <MessageList messages={activeChat.messages} isLoading={isLoading}>
        <div ref={messagesEndRef} />
      </MessageList>
      {error && <div className="chat-window-error">{error}</div>}
      <InputArea onSend={handleSendMessage} onStop={handleStopGeneration} disabled={isLoading} />
    </div>
  );
};