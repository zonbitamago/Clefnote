export type NoteDuration = 'w' | 'h' | 'q' | '8' | '16';
export type Accidental = '#' | 'b' | 'n' | null;
export type KeyboardInputMode = 'noteName' | 'pianoLayout';

export interface Note {
  id: string;
  keys: string[]; // e.g., ['c/4', 'e/4', 'g/4'] for chord
  duration: NoteDuration;
  accidentals?: (Accidental | null)[];
  dotted?: boolean;
  tied?: boolean;
}

export interface Rest {
  id: string;
  duration: NoteDuration;
  isRest: true;
}

export type NoteOrRest = Note | Rest;

export interface Measure {
  id: string;
  notes: NoteOrRest[];
  timeSignature?: { beats: number; beatType: number };
  keySignature?: string;
  clef?: 'treble' | 'bass' | 'alto' | 'tenor';
}

export interface Staff {
  id: string;
  measures: Measure[];
  clef: 'treble' | 'bass' | 'alto' | 'tenor';
}

export interface Score {
  id: string;
  title: string;
  composer: string;
  tempo: number;
  timeSignature: { beats: number; beatType: number };
  keySignature: string;
  staves: Staff[];
}

export interface EditorState {
  selectedNoteId: string | null;
  selectedMeasureId: string | null;
  currentDuration: NoteDuration;
  isRestMode: boolean;
  isDotted: boolean;
  currentAccidental: Accidental;
  currentOctave: number;
  keyboardInputMode: KeyboardInputMode;
}

export function isRest(noteOrRest: NoteOrRest): noteOrRest is Rest {
  return 'isRest' in noteOrRest && noteOrRest.isRest === true;
}

export function createEmptyScore(): Score {
  return {
    id: crypto.randomUUID(),
    title: '無題',
    composer: '',
    tempo: 120,
    timeSignature: { beats: 4, beatType: 4 },
    keySignature: 'C',
    staves: [
      {
        id: crypto.randomUUID(),
        clef: 'treble',
        measures: [
          {
            id: crypto.randomUUID(),
            notes: [],
          },
          {
            id: crypto.randomUUID(),
            notes: [],
          },
          {
            id: crypto.randomUUID(),
            notes: [],
          },
          {
            id: crypto.randomUUID(),
            notes: [],
          },
        ],
      },
    ],
  };
}
