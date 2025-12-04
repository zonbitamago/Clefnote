import { useScore } from '../context/ScoreContext';
import { NoteDuration, Accidental } from '../types/music';
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

  const durations: { value: NoteDuration; label: string; icon: string }[] = [
    { value: 'w', label: '全音符', icon: '𝅝' },
    { value: 'h', label: '2分音符', icon: '𝅗𝅥' },
    { value: 'q', label: '4分音符', icon: '♩' },
    { value: '8', label: '8分音符', icon: '♪' },
    { value: '16', label: '16分音符', icon: '𝅘𝅥𝅯' },
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
          𝄽
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
