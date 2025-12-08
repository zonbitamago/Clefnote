import { useCallback, useRef, useState } from 'react';
import * as Tone from 'tone';
import { Score, isRest, Note } from '../types/music';
import { DURATION_TO_SECONDS, keyToNote } from '../utils/audioUtils';

interface PlayEvent {
  time: number;
  notes: string[];
  duration: number;
}

export function useAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const timeoutIdsRef = useRef<number[]>([]);

  const initAudio = useCallback(async () => {
    if (Tone.getContext().state !== 'running') {
      await Tone.start();
    }
    if (!synthRef.current) {
      synthRef.current = new Tone.PolySynth(Tone.Synth).toDestination();
      synthRef.current.set({
        envelope: {
          attack: 0.02,
          decay: 0.1,
          sustain: 0.3,
          release: 0.8,
        },
      });
    }
  }, []);

  const play = useCallback(async (score: Score) => {
    await initAudio();
    if (!synthRef.current) return;

    // Clear any existing timeouts
    timeoutIdsRef.current.forEach((id) => clearTimeout(id));
    timeoutIdsRef.current = [];

    setIsPlaying(true);

    const events: PlayEvent[] = [];
    let currentTime = 0;

    score.staves.forEach((staff) => {
      staff.measures.forEach((measure) => {
        measure.notes.forEach((noteOrRest) => {
          const baseDuration = DURATION_TO_SECONDS[noteOrRest.duration] || 1;
          const duration = 'dotted' in noteOrRest && noteOrRest.dotted
            ? baseDuration * 1.5
            : baseDuration;

          if (!isRest(noteOrRest)) {
            const note = noteOrRest as Note;
            const toneNotes = note.keys.map(keyToNote);
            events.push({
              time: currentTime,
              notes: toneNotes,
              duration: duration * 0.9,
            });
          }
          currentTime += duration;
        });
      });
    });

    // Schedule all notes using setTimeout
    const beatDuration = 60 / score.tempo; // seconds per beat

    events.forEach((event) => {
      const timeMs = event.time * beatDuration * 1000;
      const id = window.setTimeout(() => {
        synthRef.current?.triggerAttackRelease(
          event.notes,
          event.duration * beatDuration,
          Tone.now()
        );
      }, timeMs);
      timeoutIdsRef.current.push(id);
    });

    // Auto-stop when finished
    const totalDuration = currentTime * beatDuration * 1000 + 500;
    const stopId = window.setTimeout(() => {
      setIsPlaying(false);
    }, totalDuration);
    timeoutIdsRef.current.push(stopId);
  }, [initAudio]);

  const stop = useCallback(() => {
    timeoutIdsRef.current.forEach((id) => clearTimeout(id));
    timeoutIdsRef.current = [];
    setIsPlaying(false);
  }, []);

  const playNote = useCallback(async (key: string) => {
    await initAudio();
    if (!synthRef.current) return;
    const toneNote = keyToNote(key);
    synthRef.current.triggerAttackRelease(toneNote, '8n');
  }, [initAudio]);

  return { isPlaying, play, stop, playNote };
}
