import { useCallback, useEffect, useState, useRef } from 'react';

interface UseMidiInputOptions {
  onKeyPress: (key: string) => void;
  enabled?: boolean;
}

export interface MidiDevice {
  id: string;
  name: string;
  manufacturer: string;
}

// MIDIノート番号からVexFlow形式への変換
function midiNoteToVexFlow(midiNote: number): string {
  const noteNames = [
    'c',
    'c#',
    'd',
    'd#',
    'e',
    'f',
    'f#',
    'g',
    'g#',
    'a',
    'a#',
    'b',
  ];
  const octave = Math.floor(midiNote / 12) - 1;
  const noteIndex = midiNote % 12;
  return `${noteNames[noteIndex]}/${octave}`;
}

export function useMidiInput({
  onKeyPress,
  enabled = true,
}: UseMidiInputOptions) {
  const [midiAccess, setMidiAccess] = useState<MIDIAccess | null>(null);
  const [devices, setDevices] = useState<MidiDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<MIDIInput | null>(null);

  const updateDevices = useCallback(
    (access: MIDIAccess) => {
      const inputDevices: MidiDevice[] = [];
      access.inputs.forEach((input) => {
        inputDevices.push({
          id: input.id,
          name: input.name || 'Unknown Device',
          manufacturer: input.manufacturer || 'Unknown',
        });
      });
      setDevices(inputDevices);

      // 自動的に最初のデバイスを選択
      if (inputDevices.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(inputDevices[0].id);
      }
    },
    [selectedDeviceId]
  );

  // MIDI初期化
  useEffect(() => {
    if (!enabled) return;

    if (!navigator.requestMIDIAccess) {
      setIsSupported(false);
      setError('Web MIDI API is not supported in this browser');
      return;
    }

    setIsSupported(true);

    navigator
      .requestMIDIAccess()
      .then((access) => {
        setMidiAccess(access);
        updateDevices(access);

        // デバイス接続/切断の監視
        access.onstatechange = () => updateDevices(access);
      })
      .catch((err: Error) => {
        setError(`MIDI access denied: ${err.message}`);
      });
  }, [enabled, updateDevices]);

  // MIDIメッセージハンドラ
  const handleMidiMessage = useCallback(
    (event: MIDIMessageEvent) => {
      const data = event.data;
      if (!data || data.length < 3) return;

      const [status, note, velocity] = data;

      // Note On (0x90) かつ velocity > 0
      if ((status & 0xf0) === 0x90 && velocity > 0) {
        const vexflowKey = midiNoteToVexFlow(note);
        onKeyPress(vexflowKey);
      }
    },
    [onKeyPress]
  );

  // デバイス選択時の接続処理
  useEffect(() => {
    if (!midiAccess || !selectedDeviceId) return;

    // 既存の接続を解除
    if (inputRef.current) {
      inputRef.current.onmidimessage = null;
    }

    const input = midiAccess.inputs.get(selectedDeviceId);
    if (input) {
      input.onmidimessage = handleMidiMessage;
      inputRef.current = input;
    }

    return () => {
      if (inputRef.current) {
        inputRef.current.onmidimessage = null;
      }
    };
  }, [midiAccess, selectedDeviceId, handleMidiMessage]);

  return {
    isSupported,
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    error,
  };
}
