import { describe, it, expect } from 'vitest';
import { scoreReducer } from '../../context/ScoreContext';
import { createEmptyScore, Note, Rest } from '../../types/music';

// Helper: 初期状態を作成
function createInitialState() {
  const score = createEmptyScore();
  return {
    score,
    editor: {
      selectedNoteId: null,
      selectedMeasureId: null,
      currentDuration: 'q' as const,
      isRestMode: false,
      isDotted: false,
      currentAccidental: null,
    },
    history: [],
    historyIndex: -1,
  };
}

// T018: SET_SCORE, ADD_NOTE, ADD_REST
describe('scoreReducer - SET_SCORE', () => {
  it('新しいスコアを設定するとhistoryが初期化される', () => {
    // 準備
    const initialState = createInitialState();
    const newScore = createEmptyScore();
    newScore.title = '新しい曲';

    // 実行
    const result = scoreReducer(initialState, {
      type: 'SET_SCORE',
      payload: newScore,
    });

    // 検証
    expect(result.score).toEqual(newScore);
    expect(result.history).toEqual([newScore]);
    expect(result.historyIndex).toBe(0);
  });

  it('スコアを設定すると以前の履歴は破棄される', () => {
    // 準備
    const initialState = createInitialState();
    initialState.history = [createEmptyScore(), createEmptyScore()];
    initialState.historyIndex = 1;
    const newScore = createEmptyScore();

    // 実行
    const result = scoreReducer(initialState, {
      type: 'SET_SCORE',
      payload: newScore,
    });

    // 検証
    expect(result.history).toHaveLength(1);
    expect(result.historyIndex).toBe(0);
  });
});

describe('scoreReducer - ADD_NOTE', () => {
  it('指定した小節にノートを追加する', () => {
    // 準備
    const initialState = createInitialState();
    const measureId = initialState.score.staves[0].measures[0].id;
    const note: Note = {
      id: 'note-1',
      keys: ['c/4'],
      duration: 'q',
    };

    // 実行
    const result = scoreReducer(initialState, {
      type: 'ADD_NOTE',
      payload: { measureId, note },
    });

    // 検証
    const measure = result.score.staves[0].measures[0];
    expect(measure.notes).toHaveLength(1);
    expect(measure.notes[0]).toEqual(note);
  });

  it('ノート追加後にhistoryが更新される', () => {
    // 準備
    const initialState = createInitialState();
    const measureId = initialState.score.staves[0].measures[0].id;
    const note: Note = {
      id: 'note-1',
      keys: ['c/4'],
      duration: 'q',
    };

    // 実行
    const result = scoreReducer(initialState, {
      type: 'ADD_NOTE',
      payload: { measureId, note },
    });

    // 検証
    expect(result.history).toHaveLength(1);
    expect(result.historyIndex).toBe(0);
  });

  it('存在しない小節IDの場合はノートが追加されない', () => {
    // 準備
    const initialState = createInitialState();
    const note: Note = {
      id: 'note-1',
      keys: ['c/4'],
      duration: 'q',
    };

    // 実行
    const result = scoreReducer(initialState, {
      type: 'ADD_NOTE',
      payload: { measureId: 'non-existent', note },
    });

    // 検証
    result.score.staves[0].measures.forEach((measure) => {
      expect(measure.notes).toHaveLength(0);
    });
  });
});

describe('scoreReducer - ADD_REST', () => {
  it('指定した小節に休符を追加する', () => {
    // 準備
    const initialState = createInitialState();
    const measureId = initialState.score.staves[0].measures[0].id;
    const rest: Rest = {
      id: 'rest-1',
      duration: 'q',
      isRest: true,
    };

    // 実行
    const result = scoreReducer(initialState, {
      type: 'ADD_REST',
      payload: { measureId, rest },
    });

    // 検証
    const measure = result.score.staves[0].measures[0];
    expect(measure.notes).toHaveLength(1);
    expect(measure.notes[0]).toEqual(rest);
  });

  it('休符追加後にhistoryが更新される', () => {
    // 準備
    const initialState = createInitialState();
    const measureId = initialState.score.staves[0].measures[0].id;
    const rest: Rest = {
      id: 'rest-1',
      duration: 'q',
      isRest: true,
    };

    // 実行
    const result = scoreReducer(initialState, {
      type: 'ADD_REST',
      payload: { measureId, rest },
    });

    // 検証
    expect(result.history).toHaveLength(1);
    expect(result.historyIndex).toBe(0);
  });
});

// T019: DELETE_NOTE, SELECT_NOTE, SELECT_MEASURE
describe('scoreReducer - DELETE_NOTE', () => {
  it('指定したノートを削除する', () => {
    // 準備
    const initialState = createInitialState();
    const measureId = initialState.score.staves[0].measures[0].id;
    const note: Note = {
      id: 'note-to-delete',
      keys: ['c/4'],
      duration: 'q',
    };
    // まずノートを追加
    const stateWithNote = scoreReducer(initialState, {
      type: 'ADD_NOTE',
      payload: { measureId, note },
    });

    // 実行
    const result = scoreReducer(stateWithNote, {
      type: 'DELETE_NOTE',
      payload: { measureId, noteId: 'note-to-delete' },
    });

    // 検証
    const measure = result.score.staves[0].measures[0];
    expect(measure.notes).toHaveLength(0);
  });

  it('ノート削除後にselectedNoteIdがnullになる', () => {
    // 準備
    const initialState = createInitialState();
    initialState.editor.selectedNoteId = 'note-to-delete';
    const measureId = initialState.score.staves[0].measures[0].id;

    // 実行
    const result = scoreReducer(initialState, {
      type: 'DELETE_NOTE',
      payload: { measureId, noteId: 'note-to-delete' },
    });

    // 検証
    expect(result.editor.selectedNoteId).toBeNull();
  });

  it('ノート削除後にhistoryが更新される', () => {
    // 準備
    const initialState = createInitialState();
    const measureId = initialState.score.staves[0].measures[0].id;

    // 実行
    const result = scoreReducer(initialState, {
      type: 'DELETE_NOTE',
      payload: { measureId, noteId: 'any-id' },
    });

    // 検証
    expect(result.history).toHaveLength(1);
  });
});

describe('scoreReducer - SELECT_NOTE', () => {
  it('ノートIDを選択状態に設定する', () => {
    // 準備
    const initialState = createInitialState();

    // 実行
    const result = scoreReducer(initialState, {
      type: 'SELECT_NOTE',
      payload: 'selected-note-id',
    });

    // 検証
    expect(result.editor.selectedNoteId).toBe('selected-note-id');
  });

  it('nullを設定して選択を解除できる', () => {
    // 準備
    const initialState = createInitialState();
    initialState.editor.selectedNoteId = 'some-note';

    // 実行
    const result = scoreReducer(initialState, {
      type: 'SELECT_NOTE',
      payload: null,
    });

    // 検証
    expect(result.editor.selectedNoteId).toBeNull();
  });
});

describe('scoreReducer - SELECT_MEASURE', () => {
  it('小節IDを選択状態に設定する', () => {
    // 準備
    const initialState = createInitialState();

    // 実行
    const result = scoreReducer(initialState, {
      type: 'SELECT_MEASURE',
      payload: 'selected-measure-id',
    });

    // 検証
    expect(result.editor.selectedMeasureId).toBe('selected-measure-id');
  });

  it('nullを設定して選択を解除できる', () => {
    // 準備
    const initialState = createInitialState();
    initialState.editor.selectedMeasureId = 'some-measure';

    // 実行
    const result = scoreReducer(initialState, {
      type: 'SELECT_MEASURE',
      payload: null,
    });

    // 検証
    expect(result.editor.selectedMeasureId).toBeNull();
  });
});

// T020: SET_DURATION, SET_REST_MODE, SET_DOTTED, SET_ACCIDENTAL
describe('scoreReducer - SET_DURATION', () => {
  it('音価を4分音符に設定する', () => {
    // 準備
    const initialState = createInitialState();

    // 実行
    const result = scoreReducer(initialState, {
      type: 'SET_DURATION',
      payload: 'q',
    });

    // 検証
    expect(result.editor.currentDuration).toBe('q');
  });

  it('音価を全音符に設定する', () => {
    // 準備
    const initialState = createInitialState();

    // 実行
    const result = scoreReducer(initialState, {
      type: 'SET_DURATION',
      payload: 'w',
    });

    // 検証
    expect(result.editor.currentDuration).toBe('w');
  });

  it('音価を16分音符に設定する', () => {
    // 準備
    const initialState = createInitialState();

    // 実行
    const result = scoreReducer(initialState, {
      type: 'SET_DURATION',
      payload: '16',
    });

    // 検証
    expect(result.editor.currentDuration).toBe('16');
  });
});

describe('scoreReducer - SET_REST_MODE', () => {
  it('休符モードを有効にする', () => {
    // 準備
    const initialState = createInitialState();

    // 実行
    const result = scoreReducer(initialState, {
      type: 'SET_REST_MODE',
      payload: true,
    });

    // 検証
    expect(result.editor.isRestMode).toBe(true);
  });

  it('休符モードを無効にする', () => {
    // 準備
    const initialState = createInitialState();
    initialState.editor.isRestMode = true;

    // 実行
    const result = scoreReducer(initialState, {
      type: 'SET_REST_MODE',
      payload: false,
    });

    // 検証
    expect(result.editor.isRestMode).toBe(false);
  });
});

describe('scoreReducer - SET_DOTTED', () => {
  it('付点モードを有効にする', () => {
    // 準備
    const initialState = createInitialState();

    // 実行
    const result = scoreReducer(initialState, {
      type: 'SET_DOTTED',
      payload: true,
    });

    // 検証
    expect(result.editor.isDotted).toBe(true);
  });

  it('付点モードを無効にする', () => {
    // 準備
    const initialState = createInitialState();
    initialState.editor.isDotted = true;

    // 実行
    const result = scoreReducer(initialState, {
      type: 'SET_DOTTED',
      payload: false,
    });

    // 検証
    expect(result.editor.isDotted).toBe(false);
  });
});

describe('scoreReducer - SET_ACCIDENTAL', () => {
  it('シャープを設定する', () => {
    // 準備
    const initialState = createInitialState();

    // 実行
    const result = scoreReducer(initialState, {
      type: 'SET_ACCIDENTAL',
      payload: '#',
    });

    // 検証
    expect(result.editor.currentAccidental).toBe('#');
  });

  it('フラットを設定する', () => {
    // 準備
    const initialState = createInitialState();

    // 実行
    const result = scoreReducer(initialState, {
      type: 'SET_ACCIDENTAL',
      payload: 'b',
    });

    // 検証
    expect(result.editor.currentAccidental).toBe('b');
  });

  it('臨時記号をnullに設定して解除する', () => {
    // 準備
    const initialState = createInitialState();
    initialState.editor.currentAccidental = '#';

    // 実行
    const result = scoreReducer(initialState, {
      type: 'SET_ACCIDENTAL',
      payload: null,
    });

    // 検証
    expect(result.editor.currentAccidental).toBeNull();
  });
});

// T021: SET_TEMPO, SET_TIME_SIGNATURE, SET_KEY_SIGNATURE, SET_TITLE
describe('scoreReducer - SET_TEMPO', () => {
  it('テンポを120に設定する', () => {
    // 準備
    const initialState = createInitialState();

    // 実行
    const result = scoreReducer(initialState, {
      type: 'SET_TEMPO',
      payload: 120,
    });

    // 検証
    expect(result.score.tempo).toBe(120);
  });

  it('テンポを60に設定する', () => {
    // 準備
    const initialState = createInitialState();

    // 実行
    const result = scoreReducer(initialState, {
      type: 'SET_TEMPO',
      payload: 60,
    });

    // 検証
    expect(result.score.tempo).toBe(60);
  });

  it('テンポを200に設定する', () => {
    // 準備
    const initialState = createInitialState();

    // 実行
    const result = scoreReducer(initialState, {
      type: 'SET_TEMPO',
      payload: 200,
    });

    // 検証
    expect(result.score.tempo).toBe(200);
  });
});

describe('scoreReducer - SET_TIME_SIGNATURE', () => {
  it('拍子を4/4に設定する', () => {
    // 準備
    const initialState = createInitialState();

    // 実行
    const result = scoreReducer(initialState, {
      type: 'SET_TIME_SIGNATURE',
      payload: { beats: 4, beatType: 4 },
    });

    // 検証
    expect(result.score.timeSignature).toEqual({ beats: 4, beatType: 4 });
  });

  it('拍子を3/4に設定する', () => {
    // 準備
    const initialState = createInitialState();

    // 実行
    const result = scoreReducer(initialState, {
      type: 'SET_TIME_SIGNATURE',
      payload: { beats: 3, beatType: 4 },
    });

    // 検証
    expect(result.score.timeSignature).toEqual({ beats: 3, beatType: 4 });
  });

  it('拍子を6/8に設定する', () => {
    // 準備
    const initialState = createInitialState();

    // 実行
    const result = scoreReducer(initialState, {
      type: 'SET_TIME_SIGNATURE',
      payload: { beats: 6, beatType: 8 },
    });

    // 検証
    expect(result.score.timeSignature).toEqual({ beats: 6, beatType: 8 });
  });
});

describe('scoreReducer - SET_KEY_SIGNATURE', () => {
  it('調性をCに設定する', () => {
    // 準備
    const initialState = createInitialState();

    // 実行
    const result = scoreReducer(initialState, {
      type: 'SET_KEY_SIGNATURE',
      payload: 'C',
    });

    // 検証
    expect(result.score.keySignature).toBe('C');
  });

  it('調性をGに設定する', () => {
    // 準備
    const initialState = createInitialState();

    // 実行
    const result = scoreReducer(initialState, {
      type: 'SET_KEY_SIGNATURE',
      payload: 'G',
    });

    // 検証
    expect(result.score.keySignature).toBe('G');
  });

  it('調性をFに設定する', () => {
    // 準備
    const initialState = createInitialState();

    // 実行
    const result = scoreReducer(initialState, {
      type: 'SET_KEY_SIGNATURE',
      payload: 'F',
    });

    // 検証
    expect(result.score.keySignature).toBe('F');
  });
});

describe('scoreReducer - SET_TITLE', () => {
  it('タイトルを設定する', () => {
    // 準備
    const initialState = createInitialState();

    // 実行
    const result = scoreReducer(initialState, {
      type: 'SET_TITLE',
      payload: 'テスト曲',
    });

    // 検証
    expect(result.score.title).toBe('テスト曲');
  });

  it('空のタイトルを設定できる', () => {
    // 準備
    const initialState = createInitialState();

    // 実行
    const result = scoreReducer(initialState, {
      type: 'SET_TITLE',
      payload: '',
    });

    // 検証
    expect(result.score.title).toBe('');
  });
});

// T022: ADD_MEASURE, UNDO, REDO
describe('scoreReducer - ADD_MEASURE', () => {
  it('指定したスタッフに小節を追加する', () => {
    // 準備
    const initialState = createInitialState();
    const staffId = initialState.score.staves[0].id;
    const initialMeasureCount = initialState.score.staves[0].measures.length;

    // 実行
    const result = scoreReducer(initialState, {
      type: 'ADD_MEASURE',
      payload: { staffId },
    });

    // 検証
    expect(result.score.staves[0].measures).toHaveLength(initialMeasureCount + 1);
  });

  it('追加された小節は空のノート配列を持つ', () => {
    // 準備
    const initialState = createInitialState();
    const staffId = initialState.score.staves[0].id;

    // 実行
    const result = scoreReducer(initialState, {
      type: 'ADD_MEASURE',
      payload: { staffId },
    });

    // 検証
    const lastMeasure = result.score.staves[0].measures.at(-1);
    expect(lastMeasure?.notes).toEqual([]);
  });

  it('追加された小節にはユニークなIDが付与される', () => {
    // 準備
    const initialState = createInitialState();
    const staffId = initialState.score.staves[0].id;

    // 実行
    const result = scoreReducer(initialState, {
      type: 'ADD_MEASURE',
      payload: { staffId },
    });

    // 検証
    const lastMeasure = result.score.staves[0].measures.at(-1);
    expect(lastMeasure?.id).toBeDefined();
    expect(lastMeasure?.id.length).toBeGreaterThan(0);
  });

  it('小節追加後にhistoryが更新される', () => {
    // 準備
    const initialState = createInitialState();
    const staffId = initialState.score.staves[0].id;

    // 実行
    const result = scoreReducer(initialState, {
      type: 'ADD_MEASURE',
      payload: { staffId },
    });

    // 検証
    expect(result.history).toHaveLength(1);
    expect(result.historyIndex).toBe(0);
  });
});

describe('scoreReducer - UNDO', () => {
  it('履歴がある場合は前の状態に戻る', () => {
    // 準備
    const initialState = createInitialState();
    const measureId = initialState.score.staves[0].measures[0].id;
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
    // 2つのノートを追加して履歴を作成
    const stateWithNote1 = scoreReducer(initialState, {
      type: 'ADD_NOTE',
      payload: { measureId, note: note1 },
    });
    const stateWithNote2 = scoreReducer(stateWithNote1, {
      type: 'ADD_NOTE',
      payload: { measureId, note: note2 },
    });

    // 実行
    const result = scoreReducer(stateWithNote2, { type: 'UNDO' });

    // 検証
    expect(result.historyIndex).toBe(stateWithNote2.historyIndex - 1);
    expect(result.score.staves[0].measures[0].notes).toHaveLength(1);
  });

  it('履歴インデックスが0の場合は状態が変わらない', () => {
    // 準備
    const initialState = createInitialState();
    initialState.historyIndex = 0;
    initialState.history = [initialState.score];

    // 実行
    const result = scoreReducer(initialState, { type: 'UNDO' });

    // 検証
    expect(result).toBe(initialState);
  });

  it('履歴が空の場合は状態が変わらない', () => {
    // 準備
    const initialState = createInitialState();

    // 実行
    const result = scoreReducer(initialState, { type: 'UNDO' });

    // 検証
    expect(result).toBe(initialState);
  });
});

describe('scoreReducer - REDO', () => {
  it('履歴に次の状態がある場合は進む', () => {
    // 準備
    const score1 = createEmptyScore();
    const score2 = createEmptyScore();
    score2.title = '変更後';
    const initialState = createInitialState();
    initialState.history = [score1, score2];
    initialState.historyIndex = 0;
    initialState.score = score1;

    // 実行
    const result = scoreReducer(initialState, { type: 'REDO' });

    // 検証
    expect(result.historyIndex).toBe(1);
    expect(result.score).toBe(score2);
  });

  it('履歴の最後にいる場合は状態が変わらない', () => {
    // 準備
    const score1 = createEmptyScore();
    const initialState = createInitialState();
    initialState.history = [score1];
    initialState.historyIndex = 0;

    // 実行
    const result = scoreReducer(initialState, { type: 'REDO' });

    // 検証
    expect(result).toBe(initialState);
  });

  it('履歴が空の場合は状態が変わらない', () => {
    // 準備
    const initialState = createInitialState();

    // 実行
    const result = scoreReducer(initialState, { type: 'REDO' });

    // 検証
    expect(result).toBe(initialState);
  });
});

describe('scoreReducer - unknown action', () => {
  it('未知のアクションの場合は状態が変わらない', () => {
    // 準備
    const initialState = createInitialState();

    // 実行
    // @ts-expect-error - 意図的に未知のアクションをテスト
    const result = scoreReducer(initialState, { type: 'UNKNOWN_ACTION' });

    // 検証
    expect(result).toBe(initialState);
  });
});
