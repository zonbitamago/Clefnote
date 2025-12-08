import { Score, isRest, Note } from '../types/music';
import { jsPDF } from 'jspdf';

export async function saveScore(score: Score): Promise<void> {
  const json = JSON.stringify(score, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${score.title || 'untitled'}.clefnote`;
  a.click();

  URL.revokeObjectURL(url);
}

export async function loadScore(): Promise<Score | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.clefnote,.json';

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        resolve(null);
        return;
      }

      try {
        const text = await file.text();
        const score = JSON.parse(text) as Score;
        resolve(score);
      } catch (error) {
        console.error('Failed to load score:', error);
        resolve(null);
      }
    };

    input.click();
  });
}

export async function exportToPDF(score: Score, svgElement: SVGElement | null): Promise<void> {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  // Add title
  pdf.setFontSize(24);
  pdf.text(score.title, 148, 20, { align: 'center' });

  if (score.composer) {
    pdf.setFontSize(12);
    pdf.text(score.composer, 270, 25, { align: 'right' });
  }

  // Convert SVG to image and add to PDF
  if (svgElement) {
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    await new Promise<void>((resolve) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = 277; // A4 landscape width - margins
        const pdfHeight = (img.height / img.width) * pdfWidth;

        pdf.addImage(imgData, 'PNG', 10, 35, pdfWidth, pdfHeight);
        resolve();
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    });
  }

  pdf.save(`${score.title || 'untitled'}.pdf`);
}

export function exportToMusicXML(score: Score): void {
  const xml = generateMusicXML(score);
  const blob = new Blob([xml], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${score.title || 'untitled'}.musicxml`;
  a.click();

  URL.revokeObjectURL(url);
}

export function generateMusicXML(score: Score): string {
  const durationMap: Record<string, { type: string; divisions: number }> = {
    w: { type: 'whole', divisions: 4 },
    h: { type: 'half', divisions: 2 },
    q: { type: 'quarter', divisions: 1 },
    '8': { type: 'eighth', divisions: 0.5 },
    '16': { type: '16th', divisions: 0.25 },
  };

  let measuresXML = '';

  score.staves.forEach((staff) => {
    staff.measures.forEach((measure, measureIndex) => {
      let notesXML = '';

      measure.notes.forEach((noteOrRest) => {
        const durInfo = durationMap[noteOrRest.duration] || durationMap['q'];
        const duration = Math.round(durInfo.divisions * 4);

        if (isRest(noteOrRest)) {
          notesXML += `
        <note>
          <rest/>
          <duration>${duration}</duration>
          <type>${durInfo.type}</type>
        </note>`;
        } else {
          const note = noteOrRest as Note;
          note.keys.forEach((key, keyIndex) => {
            const [pitch, octave] = key.split('/');
            const step = pitch[0].toUpperCase();
            const alter = pitch.includes('#') ? 1 : pitch.includes('b') ? -1 : 0;

            notesXML += `
        <note>
          ${keyIndex > 0 ? '<chord/>' : ''}
          <pitch>
            <step>${step}</step>
            ${alter !== 0 ? `<alter>${alter}</alter>` : ''}
            <octave>${octave}</octave>
          </pitch>
          <duration>${duration}</duration>
          <type>${durInfo.type}</type>
          ${note.dotted ? '<dot/>' : ''}
        </note>`;
          });
        }
      });

      measuresXML += `
    <measure number="${measureIndex + 1}">
      ${measureIndex === 0 ? `
      <attributes>
        <divisions>4</divisions>
        <key>
          <fifths>0</fifths>
        </key>
        <time>
          <beats>${score.timeSignature.beats}</beats>
          <beat-type>${score.timeSignature.beatType}</beat-type>
        </time>
        <clef>
          <sign>G</sign>
          <line>2</line>
        </clef>
      </attributes>
      <direction placement="above">
        <direction-type>
          <metronome>
            <beat-unit>quarter</beat-unit>
            <per-minute>${score.tempo}</per-minute>
          </metronome>
        </direction-type>
      </direction>` : ''}
      ${notesXML || `
      <note>
        <rest measure="yes"/>
        <duration>16</duration>
      </note>`}
    </measure>`;
    });
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="4.0">
  <work>
    <work-title>${score.title}</work-title>
  </work>
  <identification>
    <creator type="composer">${score.composer}</creator>
    <encoding>
      <software>Clefnote</software>
      <encoding-date>${new Date().toISOString().split('T')[0]}</encoding-date>
    </encoding>
  </identification>
  <part-list>
    <score-part id="P1">
      <part-name>Music</part-name>
    </score-part>
  </part-list>
  <part id="P1">${measuresXML}
  </part>
</score-partwise>`;
}
