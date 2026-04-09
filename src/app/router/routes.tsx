import React, { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthPage } from '../../pages/AuthPage';
import { Settings } from '../../types';

// Ленивая загрузка ChatPage
const ChatPage = lazy(() => import('../../pages/ChatPage').then(module => ({ default: module.ChatPage })));

// Компонент-заглушка для Suspense
const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    fontSize: '18px',
    color: '#666'
  }}>
    Загрузка...
  </div>
);

interface AppRoutesProps {
  isAuthenticated: boolean;
  settings: Settings;
  accessToken: string;
  isHydrated: boolean;
  onSettingsSave: (settings: Settings) => void;
  onLogin: (credentials: any) => Promise<void>;
}

export const AppRoutes: React.FC<AppRoutesProps> = ({
  isAuthenticated,
  settings,
  accessToken,
  isHydrated,
  onSettingsSave,
  onLogin,
}) => {
  if (!isAuthenticated) {
    return <AuthPage onLogin={onLogin} />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route 
          path="/" 
          element={
            <ChatPage
              isAuthenticated={isAuthenticated}
              settings={settings}
              accessToken={accessToken}
              isHydrated={isHydrated}
              onSettingsSave={onSettingsSave}
            />
          } 
        />
        <Route 
          path="/chat/:chatId" 
          element={
            <ChatPage
              isAuthenticated={isAuthenticated}
              settings={settings}
              accessToken={accessToken}
              isHydrated={isHydrated}
              onSettingsSave={onSettingsSave}
            />
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};