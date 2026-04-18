import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '../ui/Button';
import { MessageImage } from '../../types';
import './InputArea.css';

interface InputAreaProps {
  onSend: (message: string, image?: MessageImage) => void;
  onStop?: () => void;
  disabled?: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({
  onSend,
  onStop,
  disabled = false,
}) => {
  const [message, setMessage] = useState('');
  const [image, setImage] = useState<MessageImage | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isLoading = disabled;

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 120);
      textarea.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    // Максимум 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert('Файл слишком большой. Максимум 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      // result = "data:image/jpeg;base64,/9j/4AAQ..."
      const base64Data = result.split(',')[1];
      setImage({ data: base64Data, mimeType: file.type });
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = useCallback(() => {
    if ((!message.trim() && !image) || isLoading) return;
    onSend(message.trim(), image ?? undefined);
    setMessage('');
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  }, [message, image, isLoading, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="input-area">
      {/* Превью изображения */}
      {imagePreview && (
        <div className="input-image-preview">
          <img src={imagePreview} alt="preview" className="input-preview-img" />
          <button className="input-remove-image" onClick={handleRemoveImage}>
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      <div className="input-area-wrapper">
        {/* Скрытый input для файла */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          style={{ display: 'none' }}
        />

        {/* Кнопка прикрепления */}
        <button
          className={`input-attach-btn ${image ? 'input-attach-btn-active' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          title="Прикрепить изображение"
          disabled={isLoading}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </button>

        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={image ? 'Добавьте вопрос к изображению...' : 'Введите сообщение...'}
          className="input-textarea"
          rows={1}
          disabled={disabled}
        />

        <div className="input-actions">
          {isLoading ? (
            <Button onClick={onStop} variant="danger" size="sm" disabled={!onStop}>
              Стоп
            </Button>
          ) : (
            <Button
              onClick={handleSend}
              variant="primary"
              size="sm"
              disabled={!message.trim() && !image}
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