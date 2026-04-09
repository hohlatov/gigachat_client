import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { useChatDispatch, useChatState } from '../store/chatStore';
import { Settings } from '../types';

interface ChatPageProps {
  isAuthenticated: boolean;
  settings: Settings;
  accessToken: string;
  isHydrated: boolean;
  onSettingsSave: (settings: Settings) => void;
}

export const ChatPage: React.FC<ChatPageProps> = ({
  isAuthenticated,
  settings,
  accessToken,
  isHydrated,
  onSettingsSave,
}) => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { chats, activeChatId, isLoading, error } = useChatState();
  const dispatch = useChatDispatch();

  const resolvedActiveChatId = React.useMemo(
    () => (chatId && chats.some((chat) => chat.id === chatId) ? chatId : activeChatId),
    [chatId, chats, activeChatId]
  );

  React.useEffect(() => {
    if (isHydrated && chatId && !chats.some((chat) => chat.id === chatId)) {
      navigate('/', { replace: true });
    }
  }, [isHydrated, chatId, chats, navigate]);

  React.useEffect(() => {
    if (chatId && chatId !== activeChatId) {
      dispatch({ type: 'SET_ACTIVE_CHAT', payload: chatId });
    }
  }, [chatId, activeChatId, dispatch]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AppLayout
      chats={chats}
      activeChatId={resolvedActiveChatId}
      settings={settings}
      isLoading={isLoading}
      error={error}
      accessToken={accessToken}
      onChatSelect={(id) => {
        dispatch({ type: 'SET_ACTIVE_CHAT', payload: id });
        navigate(`/chat/${id}`);
      }}
      onNewChat={() => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        dispatch({ type: 'CREATE_CHAT', payload: { id, title: 'Новый чат' } });
        navigate(`/chat/${id}`);
      }}
      onEditChat={(id, title) => dispatch({ type: 'RENAME_CHAT', payload: { chatId: id, title } })}
      onDeleteChat={(id) => {
        dispatch({ type: 'DELETE_CHAT', payload: { chatId: id } });
        if (resolvedActiveChatId === id) {
          navigate('/');
        }
      }}
      onSettingsSave={onSettingsSave}
    />
  );
};