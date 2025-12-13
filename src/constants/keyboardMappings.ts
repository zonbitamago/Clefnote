// 音名キーモード: C,D,E,F,G,A,B -> 対応する音名
export const NOTE_NAME_KEY_MAP: Record<string, string> = {
  c: 'c',
  C: 'c',
  d: 'd',
  D: 'd',
  e: 'e',
  E: 'e',
  f: 'f',
  F: 'f',
  g: 'g',
  G: 'g',
  a: 'a',
  A: 'a',
  b: 'b',
  B: 'b',
};

// ピアノ配列モード: PCキーボードをピアノ鍵盤に見立てる
// 下段(白鍵): A S D F G H J K L ; (ド レ ミ ファ ソ ラ シ ド レ ミ)
// 上段(黒鍵): W E   T Y U   O P  (ド# レ#   ファ# ソ# ラ#   ド# レ#)
export const PIANO_LAYOUT_KEY_MAP: Record<
  string,
  { note: string; octaveOffset: number }
> = {
  // 白鍵（下段）
  a: { note: 'c', octaveOffset: 0 },
  s: { note: 'd', octaveOffset: 0 },
  d: { note: 'e', octaveOffset: 0 },
  f: { note: 'f', octaveOffset: 0 },
  g: { note: 'g', octaveOffset: 0 },
  h: { note: 'a', octaveOffset: 0 },
  j: { note: 'b', octaveOffset: 0 },
  k: { note: 'c', octaveOffset: 1 },
  l: { note: 'd', octaveOffset: 1 },
  ';': { note: 'e', octaveOffset: 1 },
  // 黒鍵（上段）
  w: { note: 'c#', octaveOffset: 0 },
  e: { note: 'd#', octaveOffset: 0 },
  t: { note: 'f#', octaveOffset: 0 },
  y: { note: 'g#', octaveOffset: 0 },
  u: { note: 'a#', octaveOffset: 0 },
  o: { note: 'c#', octaveOffset: 1 },
  p: { note: 'd#', octaveOffset: 1 },
};

// 特殊キー
export const OCTAVE_UP_KEYS = ['ArrowUp'];
export const OCTAVE_DOWN_KEYS = ['ArrowDown'];

// オクターブの範囲
export const MIN_OCTAVE = 1;
export const MAX_OCTAVE = 7;
