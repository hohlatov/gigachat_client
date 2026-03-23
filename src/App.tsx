import React, { useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { AuthForm } from './components/auth/AuthForm';
import { Chat, Message, Settings, AuthCredentials } from './types';
import './styles/theme.css';

// Mock
const mockChats: Chat[] = [
  {
    id: '1',
    title: 'Как создать React приложение',
    lastMessage: 'Спасибо за помощь!',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
  },
  {
    id: '2',
    title: 'Анализ данных с Python',
    lastMessage: 'Вот пример кода для анализа',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), 
  },
  {
    id: '3',
    title: 'Изучение TypeScript',
    lastMessage: 'Интерфейсы и типы',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), 
  },
  {
    id: '4',
    title: 'Настройка Docker',
    lastMessage: 'Dockerfile готов',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 48), 
  },
  {
    id: '5',
    title: 'API интеграция',
    lastMessage: 'REST API endpoint',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 72), 
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Привет! Как создать новое React приложение?',
    role: 'user',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    id: '2',
    content: `Привет! Для создания нового React приложения выполните следующие шаги:

1. **Установите Node.js** (если еще не установлен)
2. **Создайте приложение** используя Create React App:

\`\`\`bash
npx create-react-app my-app
cd my-app
npm start
\`\`\`

3. Или используйте **Vite** для более быстрой разработки:

\`\`\`bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
\`\`\`

Что бы вы хотели использовать?`,
    role: 'assistant',
    timestamp: new Date(Date.now() - 1000 * 60 * 55),
  },
  {
    id: '3',
    content: 'Давайте попробуем Vite. А как добавить TypeScript?',
    role: 'user',
    timestamp: new Date(Date.now() - 1000 * 60 * 50),
  },
  {
    id: '4',
    content: `Отлично! Для создания React приложения с TypeScript на Vite:

\`\`\`bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev
\`\`\`

**Основные преимущества TypeScript:**
- Статическая типизация
- Автодополнение в IDE
- Раннее обнаружение ошибок
- Лучшая поддержка рефакторинга

После установки вы получите готовую структуру с TypeScript конфигурацией! 🚀`,
    role: 'assistant',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    id: '5',
    content: 'Спасибо! А какие лучшие практики для структуры проекта?',
    role: 'user',
    timestamp: new Date(Date.now() - 1000 * 60 * 40),
  },
  {
    id: '6',
    content: `Вот рекомендуемая структура проекта:

\`\`\`
src/
├── components/
│   ├── ui/           # Переиспользуемые UI компоненты
│   ├── layout/       # Компоненты layout
│   └── features/     # Компоненты по фичам
├── hooks/            # Кастомные хуки
├── contexts/         # React Context
├── services/         # API calls
├── store/            # State management
├── utils/            # Утилиты
├── types/            # TypeScript типы
└── styles/           # Глобальные стили
\`\`\`

**Ключевые принципы:**
- Группировка по фичам, а не по типам файлов
- Переиспользуемые компоненты в \`components/ui\`
- Бизнес-логика в хуках
- API вызовы в сервисах

Нужна помощь с настройкой конкретной структуры?`,
    role: 'assistant',
    timestamp: new Date(Date.now() - 1000 * 60 * 35),
  },
];

const defaultSettings: Settings = {
  model: 'GIGACHAT',
  temperature: 0.7,
  topP: 1,
  maxTokens: 1000,
  systemPrompt: 'Вы полезный ассистент.🚀',
  theme: 'light',
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [chats] = useState<Chat[]>(mockChats);
  const initialMessages = mockMessages;
  const [activeChatId, setActiveChatId] = useState<string | null>('1');
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  const handleLogin = (credentials: AuthCredentials) => {
    console.log('Login with:', credentials);
    setIsAuthenticated(true);
  };

  const handleSettingsSave = (newSettings: Settings) => {
    setSettings(newSettings);
    console.log('Settings saved:', newSettings);
  };

  const handleNewChat = () => {
    console.log('Create new chat');
  };

  const handleEditChat = (chatId: string) => {
    console.log('Edit chat:', chatId);
  };

  const handleDeleteChat = (chatId: string) => {
    console.log('Delete chat:', chatId);
  };

  if (!isAuthenticated) {
    return <AuthForm onLogin={handleLogin} />;
  }

  return (
    <AppLayout
      chats={chats}
      activeChatId={activeChatId}
      settings={settings}
      initialMessages={initialMessages}
      onChatSelect={setActiveChatId}
      onNewChat={handleNewChat}
      onEditChat={handleEditChat}
      onDeleteChat={handleDeleteChat}
      onSettingsSave={handleSettingsSave}
    />
  );
}

export default App;