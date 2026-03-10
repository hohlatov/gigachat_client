import React, { useState, useEffect } from 'react';
import { Settings } from '../../types';
import { Button } from '../ui/Button';
import { Toggle } from '../ui/Toggle';
import { Slider } from '../ui/Slider';
import './SettingsPanel.css';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSave: (settings: Settings) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [localSettings, setLocalSettings] = useState<Settings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const handleReset = () => {
    setLocalSettings({
      model: 'GIGACHAT',
      temperature: 0.7,
      topP: 1,
      maxTokens: 1000,
      systemPrompt: '',
      theme: 'light',
    });
  };

  const handleChange = <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <div className="settings-overlay" onClick={onClose}></div>
      <div className="settings-panel">
        <header className="settings-header">
          <h2 className="settings-title">Настройки</h2>
          <button className="settings-close-btn" onClick={onClose}>
            <svg viewBox="0 0 20 20" fill="currentColor" width="24" height="24">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </header>
        <div className="settings-content">
          <div className="settings-section">
            <h3 className="settings-section-title">Модель</h3>
            <select
              value={localSettings.model}
              onChange={(e) =>
                handleChange('model', e.target.value as Settings['model'])
              }
              className="settings-select"
            >
              <option value="GIGACHAT">GigaChat</option>
              <option value="GIGACHAT_PLUS">GigaChat-Plus</option>
              <option value="GIGACHAT_PRO">GigaChat-Pro</option>
              <option value="GIGACHAT_MAX">GigaChat-Max</option>
            </select>
          </div>

          <div className="settings-section">
            <h3 className="settings-section-title">Параметры генерации</h3>
            <Slider
              label="Temperature"
              value={localSettings.temperature}
              min={0}
              max={2}
              step={0.1}
              onChange={(value) => handleChange('temperature', value)}
            />
            <Slider
              label="Top-P"
              value={localSettings.topP}
              min={0}
              max={1}
              step={0.01}
              onChange={(value) => handleChange('topP', value)}
            />
            <div className="settings-input-group">
              <label className="settings-label">Max Tokens</label>
              <input
                type="number"
                value={localSettings.maxTokens}
                onChange={(e) =>
                  handleChange('maxTokens', parseInt(e.target.value) || 0)
                }
                className="settings-input"
                min={1}
                max={4000}
              />
            </div>
          </div>

          <div className="settings-section">
            <h3 className="settings-section-title">System Prompt</h3>
            <textarea
              value={localSettings.systemPrompt}
              onChange={(e) => handleChange('systemPrompt', e.target.value)}
              placeholder="Введите системный промпт..."
              className="settings-textarea"
              rows={4}
            />
          </div>

          <div className="settings-section">
            <h3 className="settings-section-title">Тема</h3>
            <Toggle
              label={localSettings.theme === 'dark' ? 'Тёмная' : 'Светлая'}
              checked={localSettings.theme === 'dark'}
              onChange={(checked) =>
                handleChange('theme', checked ? 'dark' : 'light')
              }
            />
          </div>
        </div>
        <footer className="settings-footer">
          <Button onClick={handleReset} variant="secondary">
            Сбросить
          </Button>
          <Button onClick={handleSave} variant="primary">
            Сохранить
          </Button>
        </footer>
      </div>
    </>
  );
};