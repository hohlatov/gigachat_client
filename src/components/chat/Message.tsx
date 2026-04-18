import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { Message as MessageType } from '../../types';
import './Message.css';

interface MessageProps {
  message: MessageType;
  variant: 'user' | 'assistant';
}

export const Message: React.FC<MessageProps> = ({ message, variant }) => {
  const [isCopied, setIsCopied] = useState(false);
  const isUser = variant === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`message message-${variant}`}>
      {!isUser && (
        <div className="message-avatar">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
        </div>
      )}
      <div className="message-content">
        <div className="message-header">
          <span className="message-sender">
            {isUser ? 'Вы' : 'GigaChat'}
          </span>
          <span className="message-time">{formatTime(message.timestamp)}</span>
        </div>
        <div className="message-body">
            {/* Отображение прикреплённого изображения */}
            {message.image && (
              <img
              src={`data:${message.image.mimeType};base64,${message.image.data}`}
              alt="Прикреплённое изображение"
              className="message-image"
            />
          )}
          <ReactMarkdown
            rehypePlugins={[rehypeHighlight]}
            components={{
              code({ className, children, ...props }) {
                const isInline = !className?.includes('language-');
                
                return isInline ? (
                  <code className="message-inline-code" {...props}>
                    {children}
                  </code>
                ) : (
                  <pre className="message-code">
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        {!isUser && (
          <button
            className={`message-copy-btn ${isCopied ? 'message-copy-btn-copied' : ''}`}
            onClick={handleCopy}
            title="Копировать"
          >
            {isCopied ? (
              'Скопировано!'
            ) : (
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
};