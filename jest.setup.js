import '@testing-library/jest-dom'

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  
  observe() {
    return null;
  }
  
  disconnect() {
    return null;
  }
  
  unobserve() {
    return null;
  }
};

// Mock HTMLAudioElement for sound tests
global.HTMLAudioElement = class MockAudio {
  constructor(src) {
    this.src = src;
    this.volume = 0.3;
    this.currentTime = 0;
    this.preload = 'auto';
    this.play = jest.fn().mockResolvedValue(undefined);
    this.pause = jest.fn();
    this.load = jest.fn();
  }
};

// Mock Audio constructor
global.Audio = jest.fn().mockImplementation((src) => new global.HTMLAudioElement(src));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => store[key] = value.toString()),
    removeItem: jest.fn((key) => delete store[key]),
    clear: jest.fn(() => store = {}),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });