import { useCallback, useEffect } from 'react';
import { useScore } from '../context/ScoreContext';
import {
  NOTE_NAME_KEY_MAP,
  PIANO_LAYOUT_KEY_MAP,
  OCTAVE_UP_KEYS,
  OCTAVE_DOWN_KEYS,
  MIN_OCTAVE,
  MAX_OCTAVE,
} from '../constants/keyboardMappings';

interface UseKeyboardInputOptions {
  onKeyPress: (key: string) => void;
  enabled?: boolean;
}

export function useKeyboardInput({
  onKeyPress,
  enabled = true,
}: UseKeyboardInputOptions) {
  const { state, dispatch } = useScore();
  const { editor } = state;
  const { currentOctave, keyboardInputMode } = editor;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // 修飾キーが押されている場合は既存ショートカットに任せる
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      // テキスト入力中は無視
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      // 既存ショートカットとの競合回避
      if (e.key === ' ' || e.key === 'Delete' || e.key === 'Backspace') return;

      // オクターブ制御
      if (OCTAVE_UP_KEYS.includes(e.key)) {
        e.preventDefault();
        if (currentOctave < MAX_OCTAVE) {
          dispatch({ type: 'SET_OCTAVE', payload: currentOctave + 1 });
        }
        return;
      }
      if (OCTAVE_DOWN_KEYS.includes(e.key)) {
        e.preventDefault();
        if (currentOctave > MIN_OCTAVE) {
          dispatch({ type: 'SET_OCTAVE', payload: currentOctave - 1 });
        }
        return;
      }

      // 音符入力
      let vexflowKey: string | null = null;

      if (keyboardInputMode === 'noteName') {
        const noteName = NOTE_NAME_KEY_MAP[e.key];
        if (noteName) {
          e.preventDefault();
          vexflowKey = `${noteName}/${currentOctave}`;
        }
      } else if (keyboardInputMode === 'pianoLayout') {
        const mapping = PIANO_LAYOUT_KEY_MAP[e.key.toLowerCase()];
        if (mapping) {
          e.preventDefault();
          const octave = currentOctave + mapping.octaveOffset;
          vexflowKey = `${mapping.note}/${octave}`;
        }
      }

      if (vexflowKey) {
        onKeyPress(vexflowKey);
      }
    },
    [currentOctave, keyboardInputMode, onKeyPress, dispatch]
  );

  useEffect(() => {
    if (!enabled) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, handleKeyDown]);

  return {
    currentOctave,
    keyboardInputMode,
  };
}
