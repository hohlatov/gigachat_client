import React, { useState } from 'react';
import { Chat, Settings } from '../../types';
import { Sidebar } from '../sidebar/Sidebar';
import { ChatWindow } from '../chat/ChatWindow';
import { SettingsPanel } from '../settings/SettingsPanel';
import './AppLayout.css';

interface AppLayoutProps {
  chats: Chat[];
  activeChatId: string | null;
  settings: Settings;
  isLoading: boolean;
  error: string | null;
  accessToken: string;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  onEditChat: (chatId: string, title: string) => void;
  onDeleteChat: (chatId: string) => void;
  onSettingsSave: (settings: Settings) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  chats,
  activeChatId,
  settings,
  isLoading,
  error,
  accessToken,
  onChatSelect,
  onNewChat,
  onEditChat,
  onDeleteChat,
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
        isLoading={isLoading}
        error={error}
        settings={settings}
        accessToken={accessToken}
        onSettingsClick={() => setIsSettingsOpen(true)}
        onMenuClick={() => setIsSidebarOpen(true)}
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