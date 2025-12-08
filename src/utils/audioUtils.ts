/**
 * 音声関連のユーティリティ関数
 */

/**
 * 音価から秒数へのマッピング（4分音符 = 1秒基準）
 */
export const DURATION_TO_SECONDS: Record<string, number> = {
  w: 4,      // 全音符
  h: 2,      // 2分音符
  q: 1,      // 4分音符
  '8': 0.5,  // 8分音符
  '16': 0.25, // 16分音符
};

/**
 * VexFlow形式のキー（例: 'c/4'）をTone.js形式（例: 'C4'）に変換する
 * @param key VexFlow形式のキー
 * @returns Tone.js形式のノート
 */
export function keyToNote(key: string): string {
  const [note, octave] = key.split('/');
  return note.toUpperCase() + octave;
}
