// src/__mocks__/clipboard.js
const mockWriteText = jest.fn(() => Promise.resolve());

Object.defineProperty(global.navigator, 'clipboard', {
  value: {
    writeText: mockWriteText,
  },
  writable: true,
  configurable: true,
});

export { mockWriteText };