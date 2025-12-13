import { describe, it, expect } from 'vitest';
import {
  NOTE_NAME_KEY_MAP,
  PIANO_LAYOUT_KEY_MAP,
  OCTAVE_UP_KEYS,
  OCTAVE_DOWN_KEYS,
  MIN_OCTAVE,
  MAX_OCTAVE,
} from '../../constants/keyboardMappings';

describe('NOTE_NAME_KEY_MAP', () => {
  it('小文字のCキーがcにマッピングされる', () => {
    expect(NOTE_NAME_KEY_MAP['c']).toBe('c');
  });

  it('大文字のCキーがcにマッピングされる', () => {
    expect(NOTE_NAME_KEY_MAP['C']).toBe('c');
  });

  it('すべての音名キーがマッピングされている', () => {
    const expectedNotes = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
    expectedNotes.forEach((note) => {
      expect(NOTE_NAME_KEY_MAP[note]).toBe(note);
      expect(NOTE_NAME_KEY_MAP[note.toUpperCase()]).toBe(note);
    });
  });

  it('無効なキーはundefinedを返す', () => {
    expect(NOTE_NAME_KEY_MAP['x']).toBeUndefined();
    expect(NOTE_NAME_KEY_MAP['1']).toBeUndefined();
  });
});

describe('PIANO_LAYOUT_KEY_MAP', () => {
  describe('白鍵マッピング', () => {
    it('Aキーがc（オクターブオフセット0）にマッピングされる', () => {
      expect(PIANO_LAYOUT_KEY_MAP['a']).toEqual({ note: 'c', octaveOffset: 0 });
    });

    it('Sキーがd（オクターブオフセット0）にマッピングされる', () => {
      expect(PIANO_LAYOUT_KEY_MAP['s']).toEqual({ note: 'd', octaveOffset: 0 });
    });

    it('Kキーがc（オクターブオフセット1）にマッピングされる', () => {
      expect(PIANO_LAYOUT_KEY_MAP['k']).toEqual({ note: 'c', octaveOffset: 1 });
    });

    it('すべての白鍵がマッピングされている', () => {
      const whiteKeys = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'];
      whiteKeys.forEach((key) => {
        expect(PIANO_LAYOUT_KEY_MAP[key]).toBeDefined();
        expect(PIANO_LAYOUT_KEY_MAP[key].note).not.toContain('#');
      });
    });
  });

  describe('黒鍵マッピング', () => {
    it('Wキーがc#（オクターブオフセット0）にマッピングされる', () => {
      expect(PIANO_LAYOUT_KEY_MAP['w']).toEqual({ note: 'c#', octaveOffset: 0 });
    });

    it('Eキーがd#（オクターブオフセット0）にマッピングされる', () => {
      expect(PIANO_LAYOUT_KEY_MAP['e']).toEqual({ note: 'd#', octaveOffset: 0 });
    });

    it('すべての黒鍵がマッピングされている', () => {
      const blackKeys = ['w', 'e', 't', 'y', 'u', 'o', 'p'];
      blackKeys.forEach((key) => {
        expect(PIANO_LAYOUT_KEY_MAP[key]).toBeDefined();
        expect(PIANO_LAYOUT_KEY_MAP[key].note).toContain('#');
      });
    });
  });

  it('無効なキーはundefinedを返す', () => {
    expect(PIANO_LAYOUT_KEY_MAP['x']).toBeUndefined();
    expect(PIANO_LAYOUT_KEY_MAP['1']).toBeUndefined();
  });
});

describe('オクターブ制御キー', () => {
  it('OCTAVE_UP_KEYSにArrowUpが含まれる', () => {
    expect(OCTAVE_UP_KEYS).toContain('ArrowUp');
  });

  it('OCTAVE_DOWN_KEYSにArrowDownが含まれる', () => {
    expect(OCTAVE_DOWN_KEYS).toContain('ArrowDown');
  });
});

describe('オクターブ範囲', () => {
  it('MIN_OCTAVEが1である', () => {
    expect(MIN_OCTAVE).toBe(1);
  });

  it('MAX_OCTAVEが7である', () => {
    expect(MAX_OCTAVE).toBe(7);
  });

  it('MIN_OCTAVEがMAX_OCTAVEより小さい', () => {
    expect(MIN_OCTAVE).toBeLessThan(MAX_OCTAVE);
  });
});
