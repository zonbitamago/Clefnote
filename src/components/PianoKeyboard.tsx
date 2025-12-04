import styles from './PianoKeyboard.module.css';

interface PianoKeyboardProps {
  onKeyPress: (key: string) => void;
}

const OCTAVES = [3, 4, 5];
const WHITE_KEYS = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
const BLACK_KEYS: Record<string, string> = {
  c: 'c#',
  d: 'd#',
  f: 'f#',
  g: 'g#',
  a: 'a#',
};

export function PianoKeyboard({ onKeyPress }: PianoKeyboardProps) {
  return (
    <div className={styles.container}>
      <div className={styles.keyboard}>
        {OCTAVES.map((octave) => (
          <div key={octave} className={styles.octave}>
            {WHITE_KEYS.map((note) => (
              <div key={`${note}${octave}`} className={styles.whiteKeyWrapper}>
                <button
                  className={styles.whiteKey}
                  onClick={() => onKeyPress(`${note}/${octave}`)}
                >
                  <span className={styles.keyLabel}>
                    {note.toUpperCase()}
                    {octave}
                  </span>
                </button>
                {BLACK_KEYS[note] && (
                  <button
                    className={styles.blackKey}
                    onClick={() => onKeyPress(`${BLACK_KEYS[note]}/${octave}`)}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
