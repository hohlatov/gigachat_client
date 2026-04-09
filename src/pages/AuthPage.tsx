import React from 'react';
import { AuthForm } from '../components/auth/AuthForm';
import { AuthCredentials } from '../types';

interface AuthPageProps {
  onLogin: (credentials: AuthCredentials) => Promise<void>;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  return <AuthForm onLogin={onLogin} />;
};