import { useCallback, useRef, useEffect } from 'react';
import { ScoreProvider, useScore } from './context/ScoreContext';
import { ScoreRenderer } from './components/ScoreRenderer';
import { Toolbar } from './components/Toolbar';
import { PianoKeyboard } from './components/PianoKeyboard';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useKeyboardInput } from './hooks/useKeyboardInput';
import { useMidiInput } from './hooks/useMidiInput';
import { saveScore, loadScore, exportToPDF, exportToMusicXML } from './utils/fileOperations';
import './App.css';

function ScoreEditor() {
  const { state, dispatch } = useScore();
  const { score, editor } = state;
  const { isPlaying, play, stop, playNote } = useAudioPlayer();
  const scoreContainerRef = useRef<HTMLDivElement>(null);

  const handleMeasureClick = useCallback((measureId: string) => {
    dispatch({ type: 'SELECT_MEASURE', payload: measureId });
  }, [dispatch]);

  const handleKeyPress = useCallback((key: string) => {
    playNote(key);

    if (!editor.selectedMeasureId) {
      // Select first measure if none selected
      const firstMeasure = score.staves[0]?.measures[0];
      if (firstMeasure) {
        dispatch({ type: 'SELECT_MEASURE', payload: firstMeasure.id });
      }
      return;
    }

    if (editor.isRestMode) {
      dispatch({
        type: 'ADD_REST',
        payload: {
          measureId: editor.selectedMeasureId,
          rest: {
            id: crypto.randomUUID(),
            duration: editor.currentDuration,
            isRest: true,
          },
        },
      });
    } else {
      const accidentals = editor.currentAccidental
        ? [editor.currentAccidental]
        : undefined;

      dispatch({
        type: 'ADD_NOTE',
        payload: {
          measureId: editor.selectedMeasureId,
          note: {
            id: crypto.randomUUID(),
            keys: [key],
            duration: editor.currentDuration,
            accidentals,
            dotted: editor.isDotted,
          },
        },
      });
    }
  }, [dispatch, editor, playNote, score.staves]);

  // PCキーボード入力フック
  useKeyboardInput({
    onKeyPress: handleKeyPress,
    enabled: true,
  });

  // MIDIキーボード入力フック
  const {
    isSupported: midiSupported,
    devices: midiDevices,
    selectedDeviceId: midiSelectedDeviceId,
    error: midiError,
  } = useMidiInput({
    onKeyPress: handleKeyPress,
    enabled: true,
  });

  const handlePlay = useCallback(() => {
    play(score);
  }, [play, score]);

  const handleSave = useCallback(async () => {
    await saveScore(score);
  }, [score]);

  const handleLoad = useCallback(async () => {
    const loadedScore = await loadScore();
    if (loadedScore) {
      dispatch({ type: 'SET_SCORE', payload: loadedScore });
    }
  }, [dispatch]);

  const handleExportPDF = useCallback(async () => {
    const svg = scoreContainerRef.current?.querySelector('svg');
    await exportToPDF(score, svg || null);
  }, [score]);

  const handleExportMusicXML = useCallback(() => {
    exportToMusicXML(score);
  }, [score]);

  const handleAddMeasure = useCallback(() => {
    const staffId = score.staves[0]?.id;
    if (staffId) {
      dispatch({ type: 'ADD_MEASURE', payload: { staffId } });
    }
  }, [dispatch, score.staves]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            dispatch({ type: 'UNDO' });
            break;
          case 'y':
            e.preventDefault();
            dispatch({ type: 'REDO' });
            break;
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'o':
            e.preventDefault();
            handleLoad();
            break;
        }
      } else {
        switch (e.key) {
          case 'Delete':
          case 'Backspace':
            if (editor.selectedNoteId && editor.selectedMeasureId) {
              dispatch({
                type: 'DELETE_NOTE',
                payload: {
                  measureId: editor.selectedMeasureId,
                  noteId: editor.selectedNoteId,
                },
              });
            }
            break;
          case ' ':
            e.preventDefault();
            if (isPlaying) {
              stop();
            } else {
              handlePlay();
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, editor, handleLoad, handlePlay, handleSave, isPlaying, stop]);

  return (
    <div className="app">
      <Toolbar
        onPlay={handlePlay}
        onStop={stop}
        onSave={handleSave}
        onLoad={handleLoad}
        onExportPDF={handleExportPDF}
        onExportMusicXML={handleExportMusicXML}
        isPlaying={isPlaying}
      />

      <div className="main-content">
        <div className="score-container" ref={scoreContainerRef}>
          <ScoreRenderer
            onMeasureClick={handleMeasureClick}
          />
          <div className="score-actions">
            <button onClick={handleAddMeasure} className="add-measure-btn">
              + 小節を追加
            </button>
          </div>
        </div>

        <div className="keyboard-container">
          <div className="keyboard-header">
            <span>クリック・タップ・PCキーボードで音符を入力</span>
            <span className="hint">
              {editor.selectedMeasureId
                ? `オクターブ: ${editor.currentOctave} | ${editor.keyboardInputMode === 'noteName' ? 'C,D,E,F,G,A,Bキー' : 'ピアノ配列(A,S,D...)'}`
                : '小節をクリックして選択してください'}
            </span>
            {midiSupported && midiDevices.length > 0 && (
              <span className="midi-status">
                MIDI: {midiDevices.find(d => d.id === midiSelectedDeviceId)?.name || '未選択'}
              </span>
            )}
            {midiError && <span className="midi-error">{midiError}</span>}
          </div>
          <PianoKeyboard onKeyPress={handleKeyPress} />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ScoreProvider>
      <ScoreEditor />
    </ScoreProvider>
  );
}

export default App;
