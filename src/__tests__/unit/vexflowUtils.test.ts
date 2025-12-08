import { describe, it, expect } from 'vitest';
import { getVexDuration } from '../../utils/vexflowUtils';

describe('getVexDuration', () => {
  it('付点なしの全音符はそのまま返す', () => {
    // 準備
    const duration = 'w';

    // 実行
    const result = getVexDuration(duration, false);

    // 検証
    expect(result).toBe('w');
  });

  it('付点なしの2分音符はそのまま返す', () => {
    // 準備
    const duration = 'h';

    // 実行
    const result = getVexDuration(duration, false);

    // 検証
    expect(result).toBe('h');
  });

  it('付点なしの4分音符はそのまま返す', () => {
    // 準備
    const duration = 'q';

    // 実行
    const result = getVexDuration(duration, false);

    // 検証
    expect(result).toBe('q');
  });

  it('付点なしの8分音符はそのまま返す', () => {
    // 準備
    const duration = '8';

    // 実行
    const result = getVexDuration(duration, false);

    // 検証
    expect(result).toBe('8');
  });

  it('付点なしの16分音符はそのまま返す', () => {
    // 準備
    const duration = '16';

    // 実行
    const result = getVexDuration(duration, false);

    // 検証
    expect(result).toBe('16');
  });

  it('付点ありの4分音符は末尾にdを付ける', () => {
    // 準備
    const duration = 'q';

    // 実行
    const result = getVexDuration(duration, true);

    // 検証
    expect(result).toBe('qd');
  });

  it('付点ありの2分音符は末尾にdを付ける', () => {
    // 準備
    const duration = 'h';

    // 実行
    const result = getVexDuration(duration, true);

    // 検証
    expect(result).toBe('hd');
  });

  it('付点ありの8分音符は末尾にdを付ける', () => {
    // 準備
    const duration = '8';

    // 実行
    const result = getVexDuration(duration, true);

    // 検証
    expect(result).toBe('8d');
  });

  it('付点ありの16分音符は末尾にdを付ける', () => {
    // 準備
    const duration = '16';

    // 実行
    const result = getVexDuration(duration, true);

    // 検証
    expect(result).toBe('16d');
  });

  it('dottedがundefinedの場合は付点なしとして扱う', () => {
    // 準備
    const duration = 'q';

    // 実行
    const result = getVexDuration(duration);

    // 検証
    expect(result).toBe('q');
  });
});
