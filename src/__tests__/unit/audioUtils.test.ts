import { describe, it, expect } from 'vitest';
import { keyToNote, DURATION_TO_SECONDS } from '../../utils/audioUtils';

describe('keyToNote', () => {
  it('VexFlow形式のキーをTone.js形式に変換する（小文字→大文字）', () => {
    // 準備
    const vexKey = 'c/4';

    // 実行
    const result = keyToNote(vexKey);

    // 検証
    expect(result).toBe('C4');
  });

  it('シャープを含むキーを正しく変換する', () => {
    // 準備
    const vexKey = 'c#/4';

    // 実行
    const result = keyToNote(vexKey);

    // 検証
    expect(result).toBe('C#4');
  });

  it('フラットを含むキーを正しく変換する', () => {
    // 準備
    const vexKey = 'bb/3';

    // 実行
    const result = keyToNote(vexKey);

    // 検証
    expect(result).toBe('BB3');
  });

  it('異なるオクターブを正しく処理する', () => {
    // 準備
    const keys = ['c/2', 'd/3', 'e/4', 'f/5', 'g/6'];

    // 実行・検証
    expect(keyToNote(keys[0])).toBe('C2');
    expect(keyToNote(keys[1])).toBe('D3');
    expect(keyToNote(keys[2])).toBe('E4');
    expect(keyToNote(keys[3])).toBe('F5');
    expect(keyToNote(keys[4])).toBe('G6');
  });

  it('すべての音名を正しく変換する', () => {
    // 準備
    const noteNames = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];

    // 実行・検証
    noteNames.forEach((noteName) => {
      const result = keyToNote(`${noteName}/4`);
      expect(result).toBe(`${noteName.toUpperCase()}4`);
    });
  });
});

describe('DURATION_TO_SECONDS', () => {
  it('全音符は4拍である', () => {
    // 検証
    expect(DURATION_TO_SECONDS['w']).toBe(4);
  });

  it('2分音符は2拍である', () => {
    // 検証
    expect(DURATION_TO_SECONDS['h']).toBe(2);
  });

  it('4分音符は1拍である', () => {
    // 検証
    expect(DURATION_TO_SECONDS['q']).toBe(1);
  });

  it('8分音符は0.5拍である', () => {
    // 検証
    expect(DURATION_TO_SECONDS['8']).toBe(0.5);
  });

  it('16分音符は0.25拍である', () => {
    // 検証
    expect(DURATION_TO_SECONDS['16']).toBe(0.25);
  });

  it('付点音符の計算に使用できる（1.5倍）', () => {
    // 準備
    const baseDuration = DURATION_TO_SECONDS['q'];

    // 実行
    const dottedDuration = baseDuration * 1.5;

    // 検証
    expect(dottedDuration).toBe(1.5);
  });
});
