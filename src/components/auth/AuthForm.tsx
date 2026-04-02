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
      setError('Введите client_id:client_secret или Base64 этой пары');
      return;
    }

    try {
      setIsSubmitting(true);
      await onLogin({ credentials: credentials.trim(), scope });
    } catch (loginError) {
      const message =
        loginError instanceof Error ? loginError.message : 'Не удалось получить токен';
      if (
        message === 'Failed to fetch' ||
        (loginError instanceof TypeError && message.toLowerCase().includes('fetch'))
      ) {
        setError(
          'Не удалось связаться с сервером (часто сеть или CORS). Перезапустите npm start — в разработке используется прокси. Проверьте VPN и доступ к интернету.'
        );
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
              Учётные данные OAuth (Basic)
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
            <p className="auth-hint">
              В личном кабинете GigaChat возьмите <code className="auth-hint-code">client_id</code> и{' '}
              <code className="auth-hint-code">client_secret</code>. Можно вставить строку{' '}
              <code className="auth-hint-code">client_id:client_secret</code> — приложение само
              закодирует её в Base64. Либо вставьте уже готовую Base64-строку (без префикса «Basic »).
              После входа будет получен <code className="auth-hint-code">access_token</code> по OAuth.
            </p>
            <p className="auth-hint auth-hint-secondary">
              Пример в Node.js:
              <code className="auth-hint-code auth-hint-code-block">
                {`Buffer.from('client_id:client_secret').toString('base64')`}
              </code>
            </p>
            <p className="auth-hint auth-hint-secondary">
              Локально запросы к GigaChat идут через прокси dev-сервера (иначе браузер блокирует их
              из‑за CORS). Не задавайте в <code className="auth-hint-code">.env</code> относительные
              пути вроде <code className="auth-hint-code">/api/v2/oauth</code> — оставьте переменные
              пустыми или укажите полный <code className="auth-hint-code">https://...</code>. Если
              видите «Failed to fetch», перезапустите <code className="auth-hint-code">npm start</code>
              и проверьте VPN/сеть.
            </p>
            {error && <ErrorMessage message={error} />}
          </div>

          <div className="auth-field">
            <label className="auth-label">Scope</label>
            <div className="auth-radio-group">
              <label className="auth-radio">
                <input
                  type="radio"
                  name="scope"
                  value="GIGACHAT_API_PERS"
                  checked={scope === 'GIGACHAT_API_PERS'}
                  onChange={(e) =>
                    setScope(e.target.value as AuthCredentials['scope'])
                  }
                  className="auth-radio-input"
                  disabled={isSubmitting}
                />
                <span className="auth-radio-label">Персональный</span>
              </label>
              <label className="auth-radio">
                <input
                  type="radio"
                  name="scope"
                  value="GIGACHAT_API_B2B"
                  checked={scope === 'GIGACHAT_API_B2B'}
                  onChange={(e) =>
                    setScope(e.target.value as AuthCredentials['scope'])
                  }
                  className="auth-radio-input"
                  disabled={isSubmitting}
                />
                <span className="auth-radio-label">B2B</span>
              </label>
              <label className="auth-radio">
                <input
                  type="radio"
                  name="scope"
                  value="GIGACHAT_API_CORP"
                  checked={scope === 'GIGACHAT_API_CORP'}
                  onChange={(e) =>
                    setScope(e.target.value as AuthCredentials['scope'])
                  }
                  className="auth-radio-input"
                  disabled={isSubmitting}
                />
                <span className="auth-radio-label">Корпоративный</span>
              </label>
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