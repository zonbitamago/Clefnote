import { describe, it, expect } from 'vitest';
import { isRest, createEmptyScore, Note, Rest, NoteOrRest } from '../../types/music';

describe('isRest', () => {
  it('Restオブジェクトの場合はtrueを返す', () => {
    // 準備
    const rest: Rest = { id: '1', duration: 'q', isRest: true };

    // 実行
    const result = isRest(rest);

    // 検証
    expect(result).toBe(true);
  });

  it('Noteオブジェクトの場合はfalseを返す', () => {
    // 準備
    const note: Note = { id: '1', keys: ['c/4'], duration: 'q' };

    // 実行
    const result = isRest(note);

    // 検証
    expect(result).toBe(false);
  });

  it('isRestプロパティがないオブジェクトの場合はfalseを返す', () => {
    // 準備
    const note = { id: '1', keys: ['c/4'], duration: 'q' } as NoteOrRest;

    // 実行
    const result = isRest(note);

    // 検証
    expect(result).toBe(false);
  });

  it('isRestプロパティがfalseの場合はfalseを返す', () => {
    // 準備
    const obj = { id: '1', duration: 'q', isRest: false } as unknown as NoteOrRest;

    // 実行
    const result = isRest(obj);

    // 検証
    expect(result).toBe(false);
  });
});

describe('createEmptyScore', () => {
  it('デフォルトのタイトルは「無題」である', () => {
    // 準備・実行
    const score = createEmptyScore();

    // 検証
    expect(score.title).toBe('無題');
  });

  it('デフォルトのテンポは120である', () => {
    // 準備・実行
    const score = createEmptyScore();

    // 検証
    expect(score.tempo).toBe(120);
  });

  it('デフォルトの拍子記号は4/4である', () => {
    // 準備・実行
    const score = createEmptyScore();

    // 検証
    expect(score.timeSignature).toEqual({ beats: 4, beatType: 4 });
  });

  it('デフォルトの調性記号はCである', () => {
    // 準備・実行
    const score = createEmptyScore();

    // 検証
    expect(score.keySignature).toBe('C');
  });

  it('1つのtrebleクレフスタッフを持つ', () => {
    // 準備・実行
    const score = createEmptyScore();

    // 検証
    expect(score.staves).toHaveLength(1);
    expect(score.staves[0].clef).toBe('treble');
  });

  it('4つの空の小節を持つ', () => {
    // 準備・実行
    const score = createEmptyScore();

    // 検証
    expect(score.staves[0].measures).toHaveLength(4);
    score.staves[0].measures.forEach((measure) => {
      expect(measure.notes).toHaveLength(0);
    });
  });

  it('ユニークなIDを生成する', () => {
    // 準備・実行
    const score1 = createEmptyScore();
    const score2 = createEmptyScore();

    // 検証
    expect(score1.id).not.toBe(score2.id);
  });

  it('スタッフとMeasureにもユニークなIDが付与される', () => {
    // 準備・実行
    const score = createEmptyScore();

    // 検証
    expect(score.staves[0].id).toBeDefined();
    expect(score.staves[0].id.length).toBeGreaterThan(0);

    const measureIds = score.staves[0].measures.map((m) => m.id);
    const uniqueIds = new Set(measureIds);
    expect(uniqueIds.size).toBe(measureIds.length);
  });
});
