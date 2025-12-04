import { createContext, useContext, useReducer, ReactNode } from 'react';
import {
  Score,
  EditorState,
  NoteDuration,
  Accidental,
  Note,
  Rest,
  NoteOrRest,
  createEmptyScore,
} from '../types/music';

interface ScoreState {
  score: Score;
  editor: EditorState;
  history: Score[];
  historyIndex: number;
}

type ScoreAction =
  | { type: 'SET_SCORE'; payload: Score }
  | { type: 'ADD_NOTE'; payload: { measureId: string; note: Note } }
  | { type: 'ADD_REST'; payload: { measureId: string; rest: Rest } }
  | { type: 'DELETE_NOTE'; payload: { measureId: string; noteId: string } }
  | { type: 'SELECT_NOTE'; payload: string | null }
  | { type: 'SELECT_MEASURE'; payload: string | null }
  | { type: 'SET_DURATION'; payload: NoteDuration }
  | { type: 'SET_REST_MODE'; payload: boolean }
  | { type: 'SET_DOTTED'; payload: boolean }
  | { type: 'SET_ACCIDENTAL'; payload: Accidental }
  | { type: 'SET_TEMPO'; payload: number }
  | { type: 'SET_TIME_SIGNATURE'; payload: { beats: number; beatType: number } }
  | { type: 'SET_KEY_SIGNATURE'; payload: string }
  | { type: 'SET_TITLE'; payload: string }
  | { type: 'ADD_MEASURE'; payload: { staffId: string } }
  | { type: 'UNDO' }
  | { type: 'REDO' };

const initialState: ScoreState = {
  score: createEmptyScore(),
  editor: {
    selectedNoteId: null,
    selectedMeasureId: null,
    currentDuration: 'q',
    isRestMode: false,
    isDotted: false,
    currentAccidental: null,
  },
  history: [],
  historyIndex: -1,
};

function scoreReducer(state: ScoreState, action: ScoreAction): ScoreState {
  switch (action.type) {
    case 'SET_SCORE':
      return {
        ...state,
        score: action.payload,
        history: [action.payload],
        historyIndex: 0,
      };

    case 'ADD_NOTE': {
      const newScore = {
        ...state.score,
        staves: state.score.staves.map((staff) => ({
          ...staff,
          measures: staff.measures.map((measure) =>
            measure.id === action.payload.measureId
              ? { ...measure, notes: [...measure.notes, action.payload.note] }
              : measure
          ),
        })),
      };
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      return {
        ...state,
        score: newScore,
        history: [...newHistory, newScore],
        historyIndex: newHistory.length,
      };
    }

    case 'ADD_REST': {
      const newScore = {
        ...state.score,
        staves: state.score.staves.map((staff) => ({
          ...staff,
          measures: staff.measures.map((measure) =>
            measure.id === action.payload.measureId
              ? { ...measure, notes: [...measure.notes, action.payload.rest] }
              : measure
          ),
        })),
      };
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      return {
        ...state,
        score: newScore,
        history: [...newHistory, newScore],
        historyIndex: newHistory.length,
      };
    }

    case 'DELETE_NOTE': {
      const newScore = {
        ...state.score,
        staves: state.score.staves.map((staff) => ({
          ...staff,
          measures: staff.measures.map((measure) =>
            measure.id === action.payload.measureId
              ? {
                  ...measure,
                  notes: measure.notes.filter(
                    (n: NoteOrRest) => n.id !== action.payload.noteId
                  ),
                }
              : measure
          ),
        })),
      };
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      return {
        ...state,
        score: newScore,
        history: [...newHistory, newScore],
        historyIndex: newHistory.length,
        editor: {
          ...state.editor,
          selectedNoteId: null,
        },
      };
    }

    case 'SELECT_NOTE':
      return {
        ...state,
        editor: { ...state.editor, selectedNoteId: action.payload },
      };

    case 'SELECT_MEASURE':
      return {
        ...state,
        editor: { ...state.editor, selectedMeasureId: action.payload },
      };

    case 'SET_DURATION':
      return {
        ...state,
        editor: { ...state.editor, currentDuration: action.payload },
      };

    case 'SET_REST_MODE':
      return {
        ...state,
        editor: { ...state.editor, isRestMode: action.payload },
      };

    case 'SET_DOTTED':
      return {
        ...state,
        editor: { ...state.editor, isDotted: action.payload },
      };

    case 'SET_ACCIDENTAL':
      return {
        ...state,
        editor: { ...state.editor, currentAccidental: action.payload },
      };

    case 'SET_TEMPO':
      return {
        ...state,
        score: { ...state.score, tempo: action.payload },
      };

    case 'SET_TIME_SIGNATURE':
      return {
        ...state,
        score: { ...state.score, timeSignature: action.payload },
      };

    case 'SET_KEY_SIGNATURE':
      return {
        ...state,
        score: { ...state.score, keySignature: action.payload },
      };

    case 'SET_TITLE':
      return {
        ...state,
        score: { ...state.score, title: action.payload },
      };

    case 'ADD_MEASURE': {
      const newScore = {
        ...state.score,
        staves: state.score.staves.map((staff) =>
          staff.id === action.payload.staffId
            ? {
                ...staff,
                measures: [
                  ...staff.measures,
                  { id: crypto.randomUUID(), notes: [] },
                ],
              }
            : staff
        ),
      };
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      return {
        ...state,
        score: newScore,
        history: [...newHistory, newScore],
        historyIndex: newHistory.length,
      };
    }

    case 'UNDO':
      if (state.historyIndex > 0) {
        return {
          ...state,
          score: state.history[state.historyIndex - 1],
          historyIndex: state.historyIndex - 1,
        };
      }
      return state;

    case 'REDO':
      if (state.historyIndex < state.history.length - 1) {
        return {
          ...state,
          score: state.history[state.historyIndex + 1],
          historyIndex: state.historyIndex + 1,
        };
      }
      return state;

    default:
      return state;
  }
}

const ScoreContext = createContext<{
  state: ScoreState;
  dispatch: React.Dispatch<ScoreAction>;
} | null>(null);

export function ScoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(scoreReducer, initialState);

  return (
    <ScoreContext.Provider value={{ state, dispatch }}>
      {children}
    </ScoreContext.Provider>
  );
}

export function useScore() {
  const context = useContext(ScoreContext);
  if (!context) {
    throw new Error('useScore must be used within a ScoreProvider');
  }
  return context;
}
