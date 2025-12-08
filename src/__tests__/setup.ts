import '@testing-library/jest-dom';
import { vi } from 'vitest';

// crypto.randomUUID のモック
Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: () => `test-uuid-${Math.random().toString(36).substr(2, 9)}`,
  },
});

// VexFlow のモック
vi.mock('vexflow', () => ({
  Renderer: vi.fn().mockImplementation(() => ({
    resize: vi.fn(),
    getContext: vi.fn().mockReturnValue({
      setFont: vi.fn(),
      fillText: vi.fn(),
      setFillStyle: vi.fn(),
      fillRect: vi.fn(),
      clear: vi.fn(),
      scale: vi.fn(),
      svg: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
    }),
  })),
  Stave: vi.fn().mockImplementation(() => ({
    addClef: vi.fn().mockReturnThis(),
    addTimeSignature: vi.fn().mockReturnThis(),
    addKeySignature: vi.fn().mockReturnThis(),
    setContext: vi.fn().mockReturnThis(),
    draw: vi.fn(),
    getWidth: vi.fn().mockReturnValue(250),
    getX: vi.fn().mockReturnValue(0),
    getY: vi.fn().mockReturnValue(0),
  })),
  StaveNote: vi.fn().mockImplementation(() => ({
    addModifier: vi.fn().mockReturnThis(),
    setStyle: vi.fn().mockReturnThis(),
    getTickContext: vi.fn().mockReturnValue({ getX: vi.fn().mockReturnValue(0) }),
  })),
  Voice: vi.fn().mockImplementation(() => ({
    setStrict: vi.fn().mockReturnThis(),
    addTickables: vi.fn().mockReturnThis(),
    draw: vi.fn(),
  })),
  Formatter: vi.fn().mockImplementation(() => ({
    joinVoices: vi.fn().mockReturnThis(),
    format: vi.fn().mockReturnThis(),
  })),
  Accidental: vi.fn(),
  Dot: vi.fn().mockImplementation(() => ({
    setDotShiftY: vi.fn().mockReturnThis(),
  })),
}));

// Tone.js のモック
vi.mock('tone', () => ({
  start: vi.fn().mockResolvedValue(undefined),
  getContext: vi.fn().mockReturnValue({ state: 'running' }),
  now: vi.fn().mockReturnValue(0),
  PolySynth: vi.fn().mockImplementation(() => ({
    toDestination: vi.fn().mockReturnThis(),
    set: vi.fn(),
    triggerAttackRelease: vi.fn(),
  })),
  Synth: vi.fn(),
}));
