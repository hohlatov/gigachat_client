import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import './InputArea.css';

interface InputAreaProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  disabled?: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({
  onSend,
  onStop,
  disabled = false,
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isLoading = disabled;

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 120); // Max 5 lines
      textarea.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div className="input-area">
      <div className="input-area-wrapper">
        <button className="input-attach-btn" title="Прикрепить изображение">
          <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </button>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Введите сообщение..."
          className="input-textarea"
          rows={1}
          disabled={disabled}
        />
        <div className="input-actions">
          {isLoading ? (
            <Button
              onClick={onStop}
              variant="danger"
              size="sm"
              disabled={!onStop}
              className="input-stop-btn"
            >
              Стоп
            </Button>
          ) : (
            <Button
              onClick={handleSend}
              variant="primary"
              size="sm"
              disabled={!message.trim()}
              className="input-send-btn"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
              Отправить
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};