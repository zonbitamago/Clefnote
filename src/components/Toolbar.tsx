import { ReactNode } from 'react';
import { useScore } from '../context/ScoreContext';
import { NoteDuration, Accidental, KeyboardInputMode } from '../types/music';
import { MIN_OCTAVE, MAX_OCTAVE } from '../constants/keyboardMappings';
import {
  WholeNoteIcon,
  HalfNoteIcon,
  QuarterNoteIcon,
  EighthNoteIcon,
  SixteenthNoteIcon,
  RestIcon,
} from './icons';
import styles from './Toolbar.module.css';

interface ToolbarProps {
  onPlay: () => void;
  onStop: () => void;
  onSave: () => void;
  onLoad: () => void;
  onExportPDF: () => void;
  onExportMusicXML: () => void;
  isPlaying: boolean;
}

export function Toolbar({
  onPlay,
  onStop,
  onSave,
  onLoad,
  onExportPDF,
  onExportMusicXML,
  isPlaying,
}: ToolbarProps) {
  const { state, dispatch } = useScore();
  const { editor, score } = state;

  const durations: { value: NoteDuration; label: string; icon: ReactNode }[] = [
    { value: 'w', label: '全音符', icon: <WholeNoteIcon size={18} /> },
    { value: 'h', label: '2分音符', icon: <HalfNoteIcon size={18} /> },
    { value: 'q', label: '4分音符', icon: <QuarterNoteIcon size={18} /> },
    { value: '8', label: '8分音符', icon: <EighthNoteIcon size={18} /> },
    { value: '16', label: '16分音符', icon: <SixteenthNoteIcon size={18} /> },
  ];

  const accidentals: { value: Accidental; label: string }[] = [
    { value: null, label: '♮' },
    { value: '#', label: '♯' },
    { value: 'b', label: '♭' },
  ];

  return (
    <div className={styles.toolbar}>
      <div className={styles.section}>
        <label className={styles.label}>タイトル:</label>
        <input
          type="text"
          value={score.title}
          onChange={(e) => dispatch({ type: 'SET_TITLE', payload: e.target.value })}
          className={styles.input}
        />
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <label className={styles.label}>音価:</label>
        <div className={styles.buttonGroup}>
          {durations.map((d) => (
            <button
              key={d.value}
              onClick={() => dispatch({ type: 'SET_DURATION', payload: d.value })}
              className={`${styles.button} ${editor.currentDuration === d.value ? styles.active : ''}`}
              title={d.label}
            >
              {d.icon}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <label className={styles.label}>臨時記号:</label>
        <div className={styles.buttonGroup}>
          {accidentals.map((a) => (
            <button
              key={a.value || 'natural'}
              onClick={() => dispatch({ type: 'SET_ACCIDENTAL', payload: a.value })}
              className={`${styles.button} ${editor.currentAccidental === a.value ? styles.active : ''}`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <button
          onClick={() => dispatch({ type: 'SET_REST_MODE', payload: !editor.isRestMode })}
          className={`${styles.button} ${editor.isRestMode ? styles.active : ''}`}
          title="休符モード"
        >
          <RestIcon size={18} />
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_DOTTED', payload: !editor.isDotted })}
          className={`${styles.button} ${editor.isDotted ? styles.active : ''}`}
          title="付点"
        >
          •
        </button>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <label className={styles.label}>オクターブ:</label>
        <div className={styles.buttonGroup}>
          <button
            onClick={() =>
              dispatch({
                type: 'SET_OCTAVE',
                payload: Math.max(MIN_OCTAVE, editor.currentOctave - 1),
              })
            }
            className={styles.button}
            disabled={editor.currentOctave <= MIN_OCTAVE}
            title="オクターブ下げる (↓)"
          >
            ↓
          </button>
          <span className={styles.octaveDisplay}>{editor.currentOctave}</span>
          <button
            onClick={() =>
              dispatch({
                type: 'SET_OCTAVE',
                payload: Math.min(MAX_OCTAVE, editor.currentOctave + 1),
              })
            }
            className={styles.button}
            disabled={editor.currentOctave >= MAX_OCTAVE}
            title="オクターブ上げる (↑)"
          >
            ↑
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <label className={styles.label}>入力:</label>
        <select
          value={editor.keyboardInputMode}
          onChange={(e) =>
            dispatch({
              type: 'SET_INPUT_MODE',
              payload: e.target.value as KeyboardInputMode,
            })
          }
          className={styles.select}
          title="キーボード入力モード"
        >
          <option value="noteName">音名 (C,D,E...)</option>
          <option value="pianoLayout">ピアノ配列</option>
        </select>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <label className={styles.label}>テンポ:</label>
        <input
          type="number"
          value={score.tempo}
          onChange={(e) => dispatch({ type: 'SET_TEMPO', payload: Number(e.target.value) })}
          className={styles.inputSmall}
          min={40}
          max={240}
        />
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <button
          onClick={() => dispatch({ type: 'UNDO' })}
          className={styles.button}
          title="元に戻す (Ctrl+Z)"
        >
          ↶
        </button>
        <button
          onClick={() => dispatch({ type: 'REDO' })}
          className={styles.button}
          title="やり直し (Ctrl+Y)"
        >
          ↷
        </button>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <button
          onClick={isPlaying ? onStop : onPlay}
          className={`${styles.button} ${styles.playButton}`}
        >
          {isPlaying ? '⏹' : '▶'}
        </button>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <button onClick={onSave} className={styles.button} title="保存">
          💾
        </button>
        <button onClick={onLoad} className={styles.button} title="開く">
          📂
        </button>
      </div>

      <div className={styles.section}>
        <button onClick={onExportPDF} className={styles.button} title="PDF出力">
          PDF
        </button>
        <button onClick={onExportMusicXML} className={styles.button} title="MusicXML出力">
          XML
        </button>
      </div>
    </div>
  );
}
