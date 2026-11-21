import '@testing-library/jest-dom/vitest';

// Polyfill window.scrollTo if needed in jsdom
if (typeof window !== 'undefined') {
  window.scrollTo = () => {};
}
