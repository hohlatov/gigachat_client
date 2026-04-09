import React from 'react';
import { Message as MessageType } from '../../types';
import { Message } from './Message';
import { TypingIndicator } from './TypingIndicator';
import { ErrorBoundary } from '../ErrorBoundary';
import './MessageList.css';

interface MessageListProps {
  messages: MessageType[];
  isLoading: boolean;
  children?: React.ReactNode;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isLoading, children }) => {
  const visibleMessages = messages.filter(
    (message): message is MessageType & { role: 'user' | 'assistant' } => message.role !== 'system'
  );

  return (
    <div className="message-list">
      <ErrorBoundary>
        {visibleMessages.map((message) => (
          <Message key={message.id} message={message} variant={message.role} />
        ))}
      </ErrorBoundary>
      <TypingIndicator isVisible={isLoading} />
      {children}
    </div>
  );
};