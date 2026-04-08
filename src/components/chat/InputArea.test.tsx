import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputArea } from './InputArea';

describe('InputArea', () => {
  const mockOnSend = jest.fn();
  const mockOnStop = jest.fn();

  beforeEach(() => {
    mockOnSend.mockClear();
    mockOnStop.mockClear();
  });

  it('при вводе текста и клике на кнопку вызывается onSend', async () => {
    const user = userEvent.setup();
    render(<InputArea onSend={mockOnSend} disabled={false} />);

    const textarea = screen.getByPlaceholderText('Введите сообщение...');
    const sendButton = screen.getByRole('button', { name: /отправить/i });

    await user.type(textarea, 'Test message');
    await user.click(sendButton);

    expect(mockOnSend).toHaveBeenCalledWith('Test message');
    expect(textarea).toHaveValue('');
  });

  it('при нажатии Enter (без Shift) вызывается onSend', async () => {
    const user = userEvent.setup();
    render(<InputArea onSend={mockOnSend} disabled={false} />);

    const textarea = screen.getByPlaceholderText('Введите сообщение...');
    await user.type(textarea, 'Test message{Enter}');

    expect(mockOnSend).toHaveBeenCalledWith('Test message');
  });

  it('при нажатии Shift+Enter не вызывается onSend и добавляется новая строка', async () => {
    const user = userEvent.setup();
    render(<InputArea onSend={mockOnSend} disabled={false} />);

    const textarea = screen.getByPlaceholderText('Введите сообщение...');
    await user.type(textarea, 'Line 1{Shift>}{Enter}{/Shift}Line 2');

    expect(mockOnSend).not.toHaveBeenCalled();
    expect(textarea).toHaveValue('Line 1\nLine 2');
  });

  it('кнопка отправки заблокирована при пустом поле', () => {
    render(<InputArea onSend={mockOnSend} disabled={false} />);
    
    const sendButton = screen.getByRole('button', { name: /отправить/i });
    expect(sendButton).toBeDisabled();
  });

  it('кнопка отправки разблокируется при вводе текста', async () => {
    const user = userEvent.setup();
    render(<InputArea onSend={mockOnSend} disabled={false} />);

    const textarea = screen.getByPlaceholderText('Введите сообщение...');
    const sendButton = screen.getByRole('button', { name: /отправить/i });

    expect(sendButton).toBeDisabled();
    
    await user.type(textarea, 'test');
    expect(sendButton).not.toBeDisabled();
  });

  it('при disabled=true показывается кнопка "Стоп" вместо "Отправить"', () => {
    render(<InputArea onSend={mockOnSend} onStop={mockOnStop} disabled={true} />);
    
    expect(screen.getByRole('button', { name: 'Стоп' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /отправить/i })).not.toBeInTheDocument();
  });

  it('при клике на кнопку "Стоп" вызывается onStop', async () => {
    const user = userEvent.setup();
    render(<InputArea onSend={mockOnSend} onStop={mockOnStop} disabled={true} />);
    
    const stopButton = screen.getByRole('button', { name: 'Стоп' });
    await user.click(stopButton);
    
    expect(mockOnStop).toHaveBeenCalled();
  });
});