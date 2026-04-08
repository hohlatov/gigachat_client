import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Message } from './Message';
import { Message as MessageType } from '../../types';

// Создаем мок для clipboard
const mockClipboard = {
  writeText: jest.fn().mockResolvedValue(undefined)
};

// Заменяем navigator.clipboard до всех тестов
beforeAll(() => {
  Object.defineProperty(navigator, 'clipboard', {
    value: mockClipboard,
    writable: true,
    configurable: true,
  });
});

describe('Message Component', () => {
  const mockMessage: MessageType = {
    id: '1',
    content: 'Test message content',
    role: 'assistant',
    timestamp: new Date('2024-01-01T12:00:00'),
  };

  beforeEach(() => {
    mockClipboard.writeText.mockClear();
  });

  it('для variant="user" отображается с классом message-user и текстом "Вы"', () => {
    const { container } = render(<Message message={mockMessage} variant="user" />);
    
    expect(container.querySelector('.message-user')).toBeInTheDocument();
    expect(screen.getByText('Вы')).toBeInTheDocument();
  });

  it('для variant="assistant" отображается с классом message-assistant и текстом "GigaChat"', () => {
    const { container } = render(<Message message={mockMessage} variant="assistant" />);
    
    expect(container.querySelector('.message-assistant')).toBeInTheDocument();
    expect(screen.getByText('GigaChat')).toBeInTheDocument();
  });

  it('для variant="assistant" отображается кнопка копирования', () => {
    render(<Message message={mockMessage} variant="assistant" />);
    
    const copyButton = screen.getByRole('button', { name: /копировать/i });
    expect(copyButton).toBeInTheDocument();
  });

  it('для variant="user" не отображается кнопка копирования', () => {
    render(<Message message={mockMessage} variant="user" />);
    
    expect(screen.queryByRole('button', { name: /копировать/i })).not.toBeInTheDocument();
  });

  it('при нажатии на кнопку копирования текст копируется в буфер обмена', async () => {
    render(<Message message={mockMessage} variant="assistant" />);
    
    const copyButton = screen.getByRole('button', { name: /копировать/i });
    
    // Используем fireEvent вместо userEvent
    fireEvent.click(copyButton);
    
    // Ждем асинхронную операцию
    await waitFor(() => {
      expect(mockClipboard.writeText).toHaveBeenCalledTimes(1);
      expect(mockClipboard.writeText).toHaveBeenCalledWith('Test message content');
    });
  });

  it('после копирования отображается текст "Скопировано!"', async () => {
    render(<Message message={mockMessage} variant="assistant" />);
    
    const copyButton = screen.getByRole('button', { name: /копировать/i });
    fireEvent.click(copyButton);
    
    // Проверяем, что текст "Скопировано!" появился
    await waitFor(() => {
      expect(screen.getByText('Скопировано!')).toBeInTheDocument();
    });
  });

  it('отображает время в формате "ЧЧ:ММ"', () => {
    render(<Message message={mockMessage} variant="user" />);
    
    expect(screen.getByText('12:00')).toBeInTheDocument();
  });
});