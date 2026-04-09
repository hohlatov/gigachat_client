import React, { useEffect, useState } from 'react';
import { AppRoutes } from './app/router/routes';
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

  return (
    <AppRoutes
      isAuthenticated={isAuthenticated}
      settings={settings}
      accessToken={accessToken}
      isHydrated={isHydrated}
      onSettingsSave={handleSettingsSave}
      onLogin={handleLogin}
    />
  );
}

export default App;