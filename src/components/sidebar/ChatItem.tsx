import React from 'react';
import { Chat } from '../../types';
import './ChatItem.css';

interface ChatItemProps {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const ChatItem: React.FC<ChatItemProps> = ({
  chat,
  isActive,
  onClick,
  onEdit,
  onDelete,
}) => {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Сегодня';
    if (days === 1) return 'Вчера';
    if (days < 7) return `${days} дн. назад`;
    return new Date(date).toLocaleDateString('ru-RU');
  };

  return (
    <div
      className={`chat-item ${isActive ? 'chat-item-active' : ''}`}
      onClick={onClick}
    >
      <div className="chat-item-content">
        <div className="chat-item-title">{chat.title}</div>
        <div className="chat-item-meta">
          <span className="chat-item-date">{formatDate(chat.updatedAt)}</span>
        </div>
      </div>
      <div className="chat-item-actions">
        <button
          className="chat-item-action-btn"
          onClick={onEdit}
          title="Редактировать"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        <button
          className="chat-item-action-btn"
          onClick={onDelete}
          title="Удалить"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};