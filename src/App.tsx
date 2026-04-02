import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { AuthForm } from './components/auth/AuthForm';
import { Settings, AuthCredentials } from './types';
import { useChatDispatch, useChatState } from './store/chatStore';
import { loadChatState, saveChatState } from './utils/storage';
import { requestAccessToken } from './api/auth';
import './styles/theme.css';

const defaultSettings: Settings = {
  model: 'GIGACHAT',
  temperature: 0.7,
  topP: 1,
  maxTokens: 1000,
  systemPrompt: 'Вы полезный ассистент.🚀',
  theme: 'light',
};

const ChatRoute: React.FC<{
  isAuthenticated: boolean;
  settings: Settings;
  accessToken: string;
  isHydrated: boolean;
  onSettingsSave: (settings: Settings) => void;
}> = ({ isAuthenticated, settings, accessToken, isHydrated, onSettingsSave }) => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { chats, activeChatId, isLoading, error } = useChatState();
  const dispatch = useChatDispatch();

  const resolvedActiveChatId = useMemo(
    () => (chatId && chats.some((chat) => chat.id === chatId) ? chatId : activeChatId),
    [chatId, chats, activeChatId]
  );

  useEffect(() => {
    if (isHydrated && chatId && !chats.some((chat) => chat.id === chatId)) {
      navigate('/', { replace: true });
    }
  }, [isHydrated, chatId, chats, navigate]);

  useEffect(() => {
    if (chatId && chatId !== activeChatId) {
      dispatch({ type: 'SET_ACTIVE_CHAT', payload: chatId });
    }
  }, [chatId, activeChatId, dispatch]);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
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

function App() {
  const [authCredentials, setAuthCredentials] = useState<AuthCredentials | null>(null);
  const [accessToken, setAccessToken] = useState('');
  const [tokenExpiresAt, setTokenExpiresAt] = useState<number | null>(null);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isHydrated, setIsHydrated] = useState(false);
  const dispatch = useChatDispatch();
  const { chats, activeChatId } = useChatState();

  useEffect(() => {
    const persisted = loadChatState();
    if (persisted) {
      dispatch({ type: 'LOAD_STATE', payload: persisted });
    }
    setIsHydrated(true);
  }, [dispatch]);

  useEffect(() => {
    if (!isHydrated) return;
    saveChatState({ chats, activeChatId });
  }, [isHydrated, chats, activeChatId]);

  const refreshToken = async (credentials: AuthCredentials) => {
    const tokenData = await requestAccessToken(credentials);
    setAccessToken(tokenData.accessToken);
    setTokenExpiresAt(tokenData.expiresAt);
  };

  const handleLogin = async (credentials: AuthCredentials) => {
    await refreshToken(credentials);
    setAuthCredentials(credentials);
  };

  const handleSettingsSave = (newSettings: Settings) => {
    setSettings(newSettings);
    console.log('Settings saved:', newSettings);
  };

  useEffect(() => {
    if (!authCredentials || !tokenExpiresAt) return;

    const refreshInMs = Math.max(tokenExpiresAt - Date.now() - 60_000, 5_000);
    const timeoutId = window.setTimeout(() => {
      refreshToken(authCredentials).catch((error) => {
        console.error('Token refresh failed', error);
      });
    }, refreshInMs);

    return () => window.clearTimeout(timeoutId);
  }, [authCredentials, tokenExpiresAt]);

  const isAuthenticated = Boolean(authCredentials && accessToken);

  if (!isAuthenticated) {
    return <AuthForm onLogin={handleLogin} />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ChatRoute
            isAuthenticated={isAuthenticated}
            settings={settings}
            accessToken={accessToken}
            isHydrated={isHydrated}
            onSettingsSave={handleSettingsSave}
          />
        }
      />
      <Route
        path="/chat/:chatId"
        element={
          <ChatRoute
            isAuthenticated={isAuthenticated}
            settings={settings}
            accessToken={accessToken}
            isHydrated={isHydrated}
            onSettingsSave={handleSettingsSave}
          />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;