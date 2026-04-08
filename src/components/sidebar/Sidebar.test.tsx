import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sidebar } from './Sidebar';
import { Chat } from '../../types';

describe('Sidebar', () => {
  const mockChats: Chat[] = [
    { id: '1', title: 'React Discussion', messages: [{ id: 'm1', content: 'React is great', role: 'user', timestamp: new Date() }], createdAt: new Date(), updatedAt: new Date() },
    { id: '2', title: 'Vue.js Questions', messages: [], createdAt: new Date(), updatedAt: new Date() },
    { id: '3', title: 'TypeScript Tips', messages: [{ id: 'm2', content: 'Types are awesome', role: 'assistant', timestamp: new Date() }], createdAt: new Date(), updatedAt: new Date() },
  ];

  const mockOnChatSelect = jest.fn();
  const mockOnNewChat = jest.fn();
  const mockOnEditChat = jest.fn();
  const mockOnDeleteChat = jest.fn();

  beforeEach(() => {
    mockOnChatSelect.mockClear();
    mockOnNewChat.mockClear();
    mockOnEditChat.mockClear();
    mockOnDeleteChat.mockClear();
  });

  it('фильтрует чаты по названию при вводе в поиск', async () => {
    const user = userEvent.setup();
    render(
      <Sidebar
        chats={mockChats}
        activeChatId="1"
        onChatSelect={mockOnChatSelect}
        onNewChat={mockOnNewChat}
        onEditChat={mockOnEditChat}
        onDeleteChat={mockOnDeleteChat}
      />
    );

    const searchInput = screen.getByPlaceholderText('Поиск чатов...');
    await user.type(searchInput, 'react');

    expect(screen.getByText('React Discussion')).toBeInTheDocument();
    expect(screen.queryByText('Vue.js Questions')).not.toBeInTheDocument();
    expect(screen.queryByText('TypeScript Tips')).not.toBeInTheDocument();
  });

  it('фильтрует чаты по содержимому последнего сообщения', async () => {
    const user = userEvent.setup();
    render(
      <Sidebar
        chats={mockChats}
        activeChatId="1"
        onChatSelect={mockOnChatSelect}
        onNewChat={mockOnNewChat}
        onEditChat={mockOnEditChat}
        onDeleteChat={mockOnDeleteChat}
      />
    );

    const searchInput = screen.getByPlaceholderText('Поиск чатов...');
    await user.type(searchInput, 'awesome');

    expect(screen.getByText('TypeScript Tips')).toBeInTheDocument();
    expect(screen.queryByText('React Discussion')).not.toBeInTheDocument();
  });

  it('при пустом поиске отображаются все чаты', () => {
    render(
      <Sidebar
        chats={mockChats}
        activeChatId="1"
        onChatSelect={mockOnChatSelect}
        onNewChat={mockOnNewChat}
        onEditChat={mockOnEditChat}
        onDeleteChat={mockOnDeleteChat}
      />
    );

    expect(screen.getByText('React Discussion')).toBeInTheDocument();
    expect(screen.getByText('Vue.js Questions')).toBeInTheDocument();
    expect(screen.getByText('TypeScript Tips')).toBeInTheDocument();
  });

  it('при клике на кнопку "Новый чат" вызывается onNewChat', async () => {
    const user = userEvent.setup();
    render(
      <Sidebar
        chats={mockChats}
        activeChatId="1"
        onChatSelect={mockOnChatSelect}
        onNewChat={mockOnNewChat}
        onEditChat={mockOnEditChat}
        onDeleteChat={mockOnDeleteChat}
      />
    );

    const newChatButton = screen.getByText('Новый чат');
    await user.click(newChatButton);

    expect(mockOnNewChat).toHaveBeenCalled();
  });
});