import { describe, it, expect } from 'vitest';
import { generateMusicXML } from '../../utils/fileOperations';
import { createEmptyScore, Score, Note, Rest } from '../../types/music';

describe('generateMusicXML', () => {
  it('基本的なXML構造を生成する', () => {
    // 準備
    const score = createEmptyScore();

    // 実行
    const xml = generateMusicXML(score);

    // 検証
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<!DOCTYPE score-partwise');
    expect(xml).toContain('<score-partwise version="4.0">');
    expect(xml).toContain('</score-partwise>');
  });

  it('タイトルがwork-titleに含まれる', () => {
    // 準備
    const score = createEmptyScore();
    score.title = 'テスト曲';

    // 実行
    const xml = generateMusicXML(score);

    // 検証
    expect(xml).toContain('<work-title>テスト曲</work-title>');
  });

  it('作曲者がcreatorに含まれる', () => {
    // 準備
    const score = createEmptyScore();
    score.composer = '作曲者名';

    // 実行
    const xml = generateMusicXML(score);

    // 検証
    expect(xml).toContain('<creator type="composer">作曲者名</creator>');
  });

  it('ソフトウェア名がClefnoteとして記録される', () => {
    // 準備
    const score = createEmptyScore();

    // 実行
    const xml = generateMusicXML(score);

    // 検証
    expect(xml).toContain('<software>Clefnote</software>');
  });

  it('拍子記号が正しく出力される', () => {
    // 準備
    const score = createEmptyScore();
    score.timeSignature = { beats: 3, beatType: 4 };

    // 実行
    const xml = generateMusicXML(score);

    // 検証
    expect(xml).toContain('<beats>3</beats>');
    expect(xml).toContain('<beat-type>4</beat-type>');
  });

  it('テンポが正しく出力される', () => {
    // 準備
    const score = createEmptyScore();
    score.tempo = 100;

    // 実行
    const xml = generateMusicXML(score);

    // 検証
    expect(xml).toContain('<per-minute>100</per-minute>');
  });

  it('4分音符が正しく出力される', () => {
    // 準備
    const score = createEmptyScore();
    const note: Note = {
      id: 'note-1',
      keys: ['c/4'],
      duration: 'q',
    };
    score.staves[0].measures[0].notes = [note];

    // 実行
    const xml = generateMusicXML(score);

    // 検証
    expect(xml).toContain('<step>C</step>');
    expect(xml).toContain('<octave>4</octave>');
    expect(xml).toContain('<type>quarter</type>');
    expect(xml).toContain('<duration>4</duration>');
  });

  it('全音符が正しく出力される', () => {
    // 準備
    const score = createEmptyScore();
    const note: Note = {
      id: 'note-1',
      keys: ['c/4'],
      duration: 'w',
    };
    score.staves[0].measures[0].notes = [note];

    // 実行
    const xml = generateMusicXML(score);

    // 検証
    expect(xml).toContain('<type>whole</type>');
    expect(xml).toContain('<duration>16</duration>');
  });

  it('2分音符が正しく出力される', () => {
    // 準備
    const score = createEmptyScore();
    const note: Note = {
      id: 'note-1',
      keys: ['c/4'],
      duration: 'h',
    };
    score.staves[0].measures[0].notes = [note];

    // 実行
    const xml = generateMusicXML(score);

    // 検証
    expect(xml).toContain('<type>half</type>');
    expect(xml).toContain('<duration>8</duration>');
  });

  it('8分音符が正しく出力される', () => {
    // 準備
    const score = createEmptyScore();
    const note: Note = {
      id: 'note-1',
      keys: ['c/4'],
      duration: '8',
    };
    score.staves[0].measures[0].notes = [note];

    // 実行
    const xml = generateMusicXML(score);

    // 検証
    expect(xml).toContain('<type>eighth</type>');
    expect(xml).toContain('<duration>2</duration>');
  });

  it('16分音符が正しく出力される', () => {
    // 準備
    const score = createEmptyScore();
    const note: Note = {
      id: 'note-1',
      keys: ['c/4'],
      duration: '16',
    };
    score.staves[0].measures[0].notes = [note];

    // 実行
    const xml = generateMusicXML(score);

    // 検証
    expect(xml).toContain('<type>16th</type>');
    expect(xml).toContain('<duration>1</duration>');
  });

  it('シャープを含む音符が正しく出力される', () => {
    // 準備
    const score = createEmptyScore();
    const note: Note = {
      id: 'note-1',
      keys: ['c#/4'],
      duration: 'q',
    };
    score.staves[0].measures[0].notes = [note];

    // 実行
    const xml = generateMusicXML(score);

    // 検証
    expect(xml).toContain('<step>C</step>');
    expect(xml).toContain('<alter>1</alter>');
    expect(xml).toContain('<octave>4</octave>');
  });

  it('フラットを含む音符が正しく出力される', () => {
    // 準備
    const score = createEmptyScore();
    const note: Note = {
      id: 'note-1',
      keys: ['bb/4'],
      duration: 'q',
    };
    score.staves[0].measures[0].notes = [note];

    // 実行
    const xml = generateMusicXML(score);

    // 検証
    expect(xml).toContain('<step>B</step>');
    expect(xml).toContain('<alter>-1</alter>');
    expect(xml).toContain('<octave>4</octave>');
  });

  it('付点音符が正しく出力される', () => {
    // 準備
    const score = createEmptyScore();
    const note: Note = {
      id: 'note-1',
      keys: ['c/4'],
      duration: 'q',
      dotted: true,
    };
    score.staves[0].measures[0].notes = [note];

    // 実行
    const xml = generateMusicXML(score);

    // 検証
    expect(xml).toContain('<dot/>');
  });

  it('休符が正しく出力される', () => {
    // 準備
    const score = createEmptyScore();
    const rest: Rest = {
      id: 'rest-1',
      duration: 'q',
      isRest: true,
    };
    score.staves[0].measures[0].notes = [rest];

    // 実行
    const xml = generateMusicXML(score);

    // 検証
    expect(xml).toContain('<rest/>');
    expect(xml).toContain('<type>quarter</type>');
  });

  it('空の小節には全休符が挿入される', () => {
    // 準備
    const score = createEmptyScore();
    score.staves[0].measures[0].notes = [];

    // 実行
    const xml = generateMusicXML(score);

    // 検証
    expect(xml).toContain('<rest measure="yes"/>');
  });

  it('複数の音符を持つ小節が正しく出力される', () => {
    // 準備
    const score = createEmptyScore();
    const note1: Note = {
      id: 'note-1',
      keys: ['c/4'],
      duration: 'q',
    };
    const note2: Note = {
      id: 'note-2',
      keys: ['d/4'],
      duration: 'q',
    };
    score.staves[0].measures[0].notes = [note1, note2];

    // 実行
    const xml = generateMusicXML(score);

    // 検証
    expect(xml).toContain('<step>C</step>');
    expect(xml).toContain('<step>D</step>');
  });

  it('和音（複数キー）が正しく出力される', () => {
    // 準備
    const score = createEmptyScore();
    const chord: Note = {
      id: 'chord-1',
      keys: ['c/4', 'e/4', 'g/4'],
      duration: 'q',
    };
    score.staves[0].measures[0].notes = [chord];

    // 実行
    const xml = generateMusicXML(score);

    // 検証
    expect(xml).toContain('<step>C</step>');
    expect(xml).toContain('<step>E</step>');
    expect(xml).toContain('<step>G</step>');
    expect(xml).toContain('<chord/>');
  });

  it('複数の小節が正しく番号付けされる', () => {
    // 準備
    const score = createEmptyScore();

    // 実行
    const xml = generateMusicXML(score);

    // 検証
    expect(xml).toContain('<measure number="1">');
    expect(xml).toContain('<measure number="2">');
    expect(xml).toContain('<measure number="3">');
    expect(xml).toContain('<measure number="4">');
  });

  it('最初の小節にのみattributesが含まれる', () => {
    // 準備
    const score = createEmptyScore();

    // 実行
    const xml = generateMusicXML(score);

    // 検証
    const attributesMatches = xml.match(/<attributes>/g);
    expect(attributesMatches).toHaveLength(1);
  });

  it('divisions要素が4として設定される', () => {
    // 準備
    const score = createEmptyScore();

    // 実行
    const xml = generateMusicXML(score);

    // 検証
    expect(xml).toContain('<divisions>4</divisions>');
  });

  it('trebleクレフが正しく出力される', () => {
    // 準備
    const score = createEmptyScore();

    // 実行
    const xml = generateMusicXML(score);

    // 検証
    expect(xml).toContain('<clef>');
    expect(xml).toContain('<sign>G</sign>');
    expect(xml).toContain('<line>2</line>');
  });

  it('異なるオクターブの音符が正しく出力される', () => {
    // 準備
    const score = createEmptyScore();
    const notes: Note[] = [
      { id: 'n1', keys: ['c/3'], duration: 'q' },
      { id: 'n2', keys: ['c/5'], duration: 'q' },
      { id: 'n3', keys: ['c/6'], duration: 'q' },
    ];
    score.staves[0].measures[0].notes = notes;

    // 実行
    const xml = generateMusicXML(score);

    // 検証
    expect(xml).toContain('<octave>3</octave>');
    expect(xml).toContain('<octave>5</octave>');
    expect(xml).toContain('<octave>6</octave>');
  });

  it('全ての音名が正しく出力される', () => {
    // 準備
    const score = createEmptyScore();
    const notes: Note[] = [
      { id: 'n1', keys: ['c/4'], duration: 'q' },
      { id: 'n2', keys: ['d/4'], duration: 'q' },
      { id: 'n3', keys: ['e/4'], duration: 'q' },
      { id: 'n4', keys: ['f/4'], duration: 'q' },
    ];
    score.staves[0].measures[0].notes = notes;
    score.staves[0].measures[1].notes = [
      { id: 'n5', keys: ['g/4'], duration: 'q' },
      { id: 'n6', keys: ['a/4'], duration: 'q' },
      { id: 'n7', keys: ['b/4'], duration: 'q' },
    ];

    // 実行
    const xml = generateMusicXML(score);

    // 検証
    expect(xml).toContain('<step>C</step>');
    expect(xml).toContain('<step>D</step>');
    expect(xml).toContain('<step>E</step>');
    expect(xml).toContain('<step>F</step>');
    expect(xml).toContain('<step>G</step>');
    expect(xml).toContain('<step>A</step>');
    expect(xml).toContain('<step>B</step>');
  });
});
