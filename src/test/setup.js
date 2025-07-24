import '@testing-library/jest-dom';

// Mock fetch globally for tests
global.fetch = vi.fn();

// Mock console.error to keep test output clean
global.console.error = vi.fn();

// Reset all mocks after each test
afterEach(() => {
  vi.clearAllMocks();
});