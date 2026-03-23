import React, { useEffect, useRef, useState } from 'react';
import { Message as MessageType, Chat as ChatType } from '../../types';
import { MessageList } from './MessageList';
import { InputArea } from './InputArea';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import './ChatWindow.css';

interface ChatWindowProps {
  activeChat: ChatType | null;
  initialMessages: MessageType[];
  onSettingsClick: () => void;
  onMenuClick?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  activeChat,
  initialMessages,
  onSettingsClick,
  onMenuClick,
}) => {
  const [messages, setMessages] = useState<MessageType[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const assistantTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (assistantTimeoutRef.current) clearTimeout(assistantTimeoutRef.current);
    setMessages(initialMessages);
    setIsLoading(false);
  }, [activeChat?.id, initialMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (assistantTimeoutRef.current) clearTimeout(assistantTimeoutRef.current);
    };
  }, []);

  const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const handleStopGeneration = () => {
    if (!isLoading) return;

    if (assistantTimeoutRef.current) {
      clearTimeout(assistantTimeoutRef.current);
      assistantTimeoutRef.current = null;
    }

    setIsLoading(false);
  };

  const handleSendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    // Clear any pending mock assistant response (e.g. if component unmounted quickly).
    if (assistantTimeoutRef.current) clearTimeout(assistantTimeoutRef.current);

    const userMessage: MessageType = {
      id: createId(),
      content: trimmed,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Typing indicator appeared after user message; keep the view pinned to the bottom.
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 0);

    assistantTimeoutRef.current = setTimeout(() => {
      const assistantMessage: MessageType = {
        id: createId(),
        content: `Мок-ответ ассистента. Вы написали: "${trimmed}"`,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000 + Math.random() * 1000); // 1–2 сек
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
      <MessageList messages={messages} isLoading={isLoading}>
        <div ref={messagesEndRef} />
      </MessageList>
      <InputArea onSend={handleSendMessage} onStop={handleStopGeneration} disabled={isLoading} />
    </div>
  );
};