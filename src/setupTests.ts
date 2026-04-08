import '@testing-library/jest-dom';

// Мок для react-markdown
jest.mock('react-markdown', () => {
  const React = require('react');
  return function MockReactMarkdown({ children }: { children: string }) {
    return React.createElement('div', { 'data-testid': 'mock-markdown' }, children);
  };
});

// Мок для rehype-highlight
jest.mock('rehype-highlight', () => () => {});

// Мок для window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});