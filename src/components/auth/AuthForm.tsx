import React, { useState } from 'react';
import { AuthCredentials } from '../../types';
import { Button } from '../ui/Button';
import { ErrorMessage } from '../ui/ErrorMessage';
import './AuthForm.css';

interface AuthFormProps {
  onLogin: (credentials: AuthCredentials) => Promise<void> | void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
  const [credentials, setCredentials] = useState('');
  const [scope, setScope] = useState<AuthCredentials['scope']>('GIGACHAT_API_PERS');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!credentials.trim()) {
      setError('Введите учётные данные');
      return;
    }

    try {
      setIsSubmitting(true);
      await onLogin({ credentials: credentials.trim(), scope });
    } catch (loginError) {
      const message =
        loginError instanceof Error ? loginError.message : 'Не удалось получить токен';
      if (message === 'Failed to fetch' || message.toLowerCase().includes('fetch')) {
        setError('Не удалось связаться с сервером. Проверьте VPN и интернет-соединение.');
      } else {
        setError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form">
        <div className="auth-header">
          <div className="auth-logo">
            <svg viewBox="0 0 40 40" fill="currentColor" width="40" height="40">
              <path d="M20 0C8.954 0 0 8.954 0 20s8.954 20 20 20 20-8.954 20-20S31.046 0 20 0zm0 36c-8.837 0-16-7.163-16-16S11.163 4 20 4s16 7.163 16 16-7.163 16-16 16z" />
              <path d="M20 8c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12S26.627 8 20 8zm0 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" />
            </svg>
          </div>
          <h1 className="auth-title">GigaChat</h1>
          <p className="auth-subtitle">Войдите для начала работы</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form-content">
          <div className="auth-field">
            <label className="auth-label" htmlFor="credentials">
              Учётные данные
            </label>
            <input
              type="password"
              id="credentials"
              value={credentials}
              onChange={(e) => setCredentials(e.target.value)}
              className="auth-input"
              placeholder="client_id:client_secret или Base64"
              autoComplete="off"
              disabled={isSubmitting}
            />
            {error && <ErrorMessage message={error} />}
          </div>

          <div className="auth-field">
            <label className="auth-label">Тип доступа</label>
            <div className="auth-radio-group">
              {[
                { value: 'GIGACHAT_API_PERS', label: 'Персональный' },
                { value: 'GIGACHAT_API_B2B', label: 'B2B' },
                { value: 'GIGACHAT_API_CORP', label: 'Корпоративный' },
              ].map(({ value, label }) => (
                <label className="auth-radio" key={value}>
                  <input
                    type="radio"
                    name="scope"
                    value={value}
                    checked={scope === value}
                    onChange={(e) => setScope(e.target.value as AuthCredentials['scope'])}
                    className="auth-radio-input"
                    disabled={isSubmitting}
                  />
                  <span className="auth-radio-label">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="auth-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Вход...' : 'Войти'}
          </Button>
        </form>
      </div>
    </div>
  );
};