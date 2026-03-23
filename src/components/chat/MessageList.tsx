import React from 'react';
import { Message as MessageType } from '../../types';
import { Message } from './Message';
import { TypingIndicator } from './TypingIndicator';
import './MessageList.css';

interface MessageListProps {
  messages: MessageType[];
  isLoading: boolean;
  children?: React.ReactNode;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isLoading, children }) => {
  return (
    <div className="message-list">
      {messages.map((message) => (
        <Message key={message.id} message={message} variant={message.role} />
      ))}
      <TypingIndicator isVisible={isLoading} />
      {children}
    </div>
  );
};