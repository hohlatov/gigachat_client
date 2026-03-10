import React, { useState } from 'react';
import { AuthCredentials } from '../../types';
import { Button } from '../ui/Button';
import { ErrorMessage } from '../ui/ErrorMessage';
import './AuthForm.css';

interface AuthFormProps {
  onLogin: (credentials: AuthCredentials) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
  const [credentials, setCredentials] = useState('');
  const [scope, setScope] = useState<AuthCredentials['scope']>('GIGACHAT_API_PERS');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!credentials.trim()) {
      setError('Пожалуйста, введите пароль');
      return;
    }

    onLogin({ credentials: credentials.trim(), scope });
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
              Password
            </label>
            <input
              type="password"
              id="credentials"
              value={credentials}
              onChange={(e) => setCredentials(e.target.value)}
              className="auth-input"
              placeholder="Введите пароль"
              autoComplete="off"
            />
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
                />
                <span className="auth-radio-label">Корпоративный</span>
              </label>
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" className="auth-submit-btn">
            Войти
          </Button>
        </form>
      </div>
    </div>
  );
};