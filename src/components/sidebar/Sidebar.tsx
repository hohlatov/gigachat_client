import React, { useState } from 'react';
import { Chat } from '../../types';
import { SearchInput } from './SearchInput';
import { ChatList } from './ChatList';
import { Button } from '../ui/Button';
import './Sidebar.css';

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  onEditChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  chats,
  activeChatId,
  onChatSelect,
  onNewChat,
  onEditChat,
  onDeleteChat,
  isOpen = true,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {isOpen && onClose && (
        <div className="sidebar-overlay" onClick={onClose}></div>
      )}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <Button onClick={onNewChat} variant="primary" size="md">
            <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Новый чат
          </Button>
        </div>
        <div className="sidebar-content">
          <SearchInput onSearch={setSearchQuery} />
          <ChatList
            chats={filteredChats}
            activeChatId={activeChatId}
            onChatSelect={onChatSelect}
            onEditChat={onEditChat}
            onDeleteChat={onDeleteChat}
          />
        </div>
      </aside>
    </>
  );
};