import React, { useState } from 'react';
import { Message as MessageType, Chat as ChatType } from '../../types';
import { MessageList } from './MessageList';
import { TypingIndicator } from './TypingIndicator';
import { InputArea } from './InputArea';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import './ChatWindow.css';

interface ChatWindowProps {
  activeChat: ChatType | null;
  messages: MessageType[];
  onSendMessage: (message: string) => void;
  onSettingsClick: () => void;
  onMenuClick?: () => void;
  isTyping?: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  activeChat,
  messages,
  onSendMessage,
  onSettingsClick,
  onMenuClick,
  isTyping = false,
}) => {
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
      <MessageList messages={messages} />
      {isTyping && <TypingIndicator isVisible={true} />}
      <InputArea onSend={onSendMessage} disabled={isTyping} />
    </div>
  );
};