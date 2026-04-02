import React from 'react';
import { Chat } from '../../types';
import { ChatItem } from './ChatItem';
import './ChatList.css';

interface ChatListProps {
  chats: Chat[];
  activeChatId: string | null;
  onChatSelect: (chatId: string) => void;
  onEditChat: (chatId: string, title: string) => void;
  onDeleteChat: (chatId: string) => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  activeChatId,
  onChatSelect,
  onEditChat,
  onDeleteChat,
}) => {
  return (
    <div className="chat-list">
      {chats.map((chat) => (
        <ChatItem
          key={chat.id}
          chat={chat}
          isActive={activeChatId === chat.id}
          onClick={() => onChatSelect(chat.id)}
          onEdit={(e) => {
            e.stopPropagation();
            const nextTitle = window.prompt('Введите новое название чата', chat.title)?.trim();
            if (nextTitle) onEditChat(chat.id, nextTitle);
          }}
          onDelete={(e) => {
            e.stopPropagation();
            const confirmed = window.confirm('Удалить чат без возможности восстановления?');
            if (confirmed) onDeleteChat(chat.id);
          }}
        />
      ))}
    </div>
  );
};