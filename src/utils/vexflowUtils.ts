/**
 * VexFlow関連のユーティリティ関数
 */

/**
 * 内部の音価形式をVexFlow形式に変換する
 * @param duration 音価（'w', 'h', 'q', '8', '16'）
 * @param dotted 付点かどうか
 * @returns VexFlow形式の音価文字列
 */
export function getVexDuration(duration: string, dotted?: boolean): string {
  const base = duration === '8' ? '8' : duration === '16' ? '16' : duration;
  return dotted ? base + 'd' : base;
}
