import { useEffect, useRef, useCallback } from 'react';
import { Renderer, Stave, StaveNote, Voice, Formatter, Accidental } from 'vexflow';
import { useScore } from '../context/ScoreContext';
import { Note, NoteOrRest, isRest } from '../types/music';

interface ScoreRendererProps {
  onNoteClick?: (measureId: string, noteId: string) => void;
  onMeasureClick?: (measureId: string, clickY: number) => void;
}

const STAVE_WIDTH = 250;
const STAVE_HEIGHT = 150;
const STAVES_PER_LINE = 4;
const LEFT_MARGIN = 50;
const TOP_MARGIN = 80;

export function ScoreRenderer({ onMeasureClick }: ScoreRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { state } = useScore();
  const { score, editor } = state;

  const getVexDuration = (duration: string, dotted?: boolean): string => {
    const base = duration === '8' ? '8' : duration === '16' ? '16' : duration;
    return dotted ? base + 'd' : base;
  };

  const render = useCallback(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';

    const totalMeasures = score.staves[0]?.measures.length || 0;
    const lines = Math.ceil(totalMeasures / STAVES_PER_LINE);
    const width = STAVES_PER_LINE * STAVE_WIDTH + LEFT_MARGIN * 2;
    const height = lines * STAVE_HEIGHT + TOP_MARGIN + 50;

    const renderer = new Renderer(
      containerRef.current,
      Renderer.Backends.SVG
    );
    renderer.resize(width, height);
    const context = renderer.getContext();

    // Draw title
    context.setFont('Arial', 24, 'bold');
    context.fillText(score.title, width / 2 - 50, 40);

    if (score.composer) {
      context.setFont('Arial', 14, 'normal');
      context.fillText(score.composer, width - 150, 60);
    }

    score.staves.forEach((staff) => {
      staff.measures.forEach((measure, measureIndex) => {
        const lineIndex = Math.floor(measureIndex / STAVES_PER_LINE);
        const posInLine = measureIndex % STAVES_PER_LINE;
        const x = LEFT_MARGIN + posInLine * STAVE_WIDTH;
        const y = TOP_MARGIN + lineIndex * STAVE_HEIGHT;

        const stave = new Stave(x, y, STAVE_WIDTH);

        // Add clef and time signature for first measure of each line
        if (posInLine === 0) {
          stave.addClef(staff.clef);
          if (measureIndex === 0) {
            stave.addTimeSignature(
              `${score.timeSignature.beats}/${score.timeSignature.beatType}`
            );
            stave.addKeySignature(score.keySignature);
          }
        }

        // Highlight selected measure
        if (measure.id === editor.selectedMeasureId) {
          context.setFillStyle('rgba(100, 149, 237, 0.1)');
          context.fillRect(x, y, STAVE_WIDTH, 100);
          context.setFillStyle('#000');
        }

        stave.setContext(context).draw();

        // Draw notes
        if (measure.notes.length > 0) {
          const vexNotes = measure.notes.map((noteOrRest: NoteOrRest) => {
            if (isRest(noteOrRest)) {
              return new StaveNote({
                keys: ['b/4'],
                duration: getVexDuration(noteOrRest.duration) + 'r',
              });
            } else {
              const note = noteOrRest as Note;
              const staveNote = new StaveNote({
                keys: note.keys,
                duration: getVexDuration(note.duration, note.dotted),
              });

              // Add accidentals
              if (note.accidentals) {
                note.accidentals.forEach((acc, i) => {
                  if (acc) {
                    staveNote.addModifier(new Accidental(acc), i);
                  }
                });
              }

              // Highlight selected note
              if (note.id === editor.selectedNoteId) {
                staveNote.setStyle({ fillStyle: 'cornflowerblue', strokeStyle: 'cornflowerblue' });
              }

              return staveNote;
            }
          });

          try {
            const voice = new Voice({
              numBeats: score.timeSignature.beats,
              beatValue: score.timeSignature.beatType,
            }).setStrict(false);
            voice.addTickables(vexNotes);

            new Formatter().joinVoices([voice]).format([voice], STAVE_WIDTH - 50);
            voice.draw(context, stave);
          } catch (e) {
            console.warn('Voice formatting error:', e);
          }
        }
      });
    });
  }, [score, editor.selectedMeasureId, editor.selectedNoteId]);

  useEffect(() => {
    render();
  }, [render]);

  const handleClick = (e: React.MouseEvent) => {
    if (!containerRef.current || !onMeasureClick) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Determine which measure was clicked
    const staff = score.staves[0];
    if (!staff) return;

    for (let i = 0; i < staff.measures.length; i++) {
      const lineIndex = Math.floor(i / STAVES_PER_LINE);
      const posInLine = i % STAVES_PER_LINE;
      const staveX = LEFT_MARGIN + posInLine * STAVE_WIDTH;
      const staveY = TOP_MARGIN + lineIndex * STAVE_HEIGHT;

      if (
        x >= staveX &&
        x <= staveX + STAVE_WIDTH &&
        y >= staveY &&
        y <= staveY + 100
      ) {
        onMeasureClick(staff.measures[i].id, y - staveY);
        return;
      }
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      style={{
        background: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        minHeight: '400px',
      }}
    />
  );
}
