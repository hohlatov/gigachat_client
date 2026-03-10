import React, { useState } from 'react';
import { Chat, Message as MessageType, Settings } from '../../types';
import { Sidebar } from '../sidebar/Sidebar';
import { ChatWindow } from '../chat/ChatWindow';
import { SettingsPanel } from '../settings/SettingsPanel';
import './AppLayout.css';

interface AppLayoutProps {
  chats: Chat[];
  messages: MessageType[];
  activeChatId: string | null;
  settings: Settings;
  isTyping?: boolean;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  onEditChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onSendMessage: (message: string) => void;
  onSettingsSave: (settings: Settings) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  chats,
  messages,
  activeChatId,
  settings,
  isTyping = false,
  onChatSelect,
  onNewChat,
  onEditChat,
  onDeleteChat,
  onSendMessage,
  onSettingsSave,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeChat = chats.find((chat) => chat.id === activeChatId) || null;

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  React.useEffect(() => {
    handleThemeChange(settings.theme);
  }, [settings.theme]);

  return (
    <div className="app-layout">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onChatSelect={onChatSelect}
        onNewChat={onNewChat}
        onEditChat={onEditChat}
        onDeleteChat={onDeleteChat}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <ChatWindow
        activeChat={activeChat}
        messages={messages}
        onSendMessage={onSendMessage}
        onSettingsClick={() => setIsSettingsOpen(true)}
        onMenuClick={() => setIsSidebarOpen(true)}
        isTyping={isTyping}
      />
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={onSettingsSave}
      />
    </div>
  );
};