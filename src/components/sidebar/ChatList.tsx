import React from 'react';
import { Chat } from '../../types';
import { ChatItem } from './ChatItem';
import './ChatList.css';

interface ChatListProps {
  chats: Chat[];
  activeChatId: string | null;
  onChatSelect: (chatId: string) => void;
  onEditChat: (chatId: string) => void;
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
            onEditChat(chat.id);
          }}
          onDelete={(e) => {
            e.stopPropagation();
            onDeleteChat(chat.id);
          }}
        />
      ))}
    </div>
  );
};