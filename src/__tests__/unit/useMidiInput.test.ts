import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useMidiInput } from '../../hooks/useMidiInput';

// MIDIInputのモック
function createMockMIDIInput(id: string, name: string): MIDIInput {
  return {
    id,
    name,
    manufacturer: 'Test Manufacturer',
    type: 'input',
    state: 'connected',
    connection: 'open',
    version: '1.0',
    onmidimessage: null,
    onstatechange: null,
    open: vi.fn().mockResolvedValue(undefined),
    close: vi.fn().mockResolvedValue(undefined),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn().mockReturnValue(true),
  } as unknown as MIDIInput;
}

// MIDIAccessのモック
function createMockMIDIAccess(inputs: MIDIInput[] = []): MIDIAccess {
  const inputsMap = new Map<string, MIDIInput>();
  inputs.forEach((input) => inputsMap.set(input.id, input));

  return {
    inputs: inputsMap,
    outputs: new Map(),
    onstatechange: null,
    sysexEnabled: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn().mockReturnValue(true),
  } as unknown as MIDIAccess;
}

describe('useMidiInput', () => {
  let onKeyPressMock: ReturnType<typeof vi.fn>;
  let originalRequestMIDIAccess: typeof navigator.requestMIDIAccess;

  beforeEach(() => {
    onKeyPressMock = vi.fn();
    originalRequestMIDIAccess = navigator.requestMIDIAccess;
  });

  afterEach(() => {
    vi.clearAllMocks();
    // navigator.requestMIDIAccessを復元
    if (originalRequestMIDIAccess) {
      Object.defineProperty(navigator, 'requestMIDIAccess', {
        value: originalRequestMIDIAccess,
        writable: true,
        configurable: true,
      });
    }
  });

  describe('Web MIDI API非対応', () => {
    it('requestMIDIAccessが存在しない場合isSupportedがfalseになる', () => {
      // 準備
      Object.defineProperty(navigator, 'requestMIDIAccess', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      // 実行
      const { result } = renderHook(() =>
        useMidiInput({ onKeyPress: onKeyPressMock, enabled: true })
      );

      // 検証
      expect(result.current.isSupported).toBe(false);
      expect(result.current.error).toBe(
        'Web MIDI API is not supported in this browser'
      );
    });
  });

  describe('Web MIDI API対応', () => {
    it('requestMIDIAccessが存在する場合isSupportedがtrueになる', async () => {
      // 準備
      const mockMIDIAccess = createMockMIDIAccess();
      Object.defineProperty(navigator, 'requestMIDIAccess', {
        value: vi.fn().mockResolvedValue(mockMIDIAccess),
        writable: true,
        configurable: true,
      });

      // 実行
      const { result } = renderHook(() =>
        useMidiInput({ onKeyPress: onKeyPressMock, enabled: true })
      );

      // 検証
      await waitFor(() => {
        expect(result.current.isSupported).toBe(true);
      });
    });

    it('MIDIアクセスが拒否された場合エラーが設定される', async () => {
      // 準備
      Object.defineProperty(navigator, 'requestMIDIAccess', {
        value: vi.fn().mockRejectedValue(new Error('Access denied')),
        writable: true,
        configurable: true,
      });

      // 実行
      const { result } = renderHook(() =>
        useMidiInput({ onKeyPress: onKeyPressMock, enabled: true })
      );

      // 検証
      await waitFor(() => {
        expect(result.current.error).toBe('MIDI access denied: Access denied');
      });
    });
  });

  describe('デバイス検出', () => {
    it('接続されたMIDIデバイスが検出される', async () => {
      // 準備
      const mockInput = createMockMIDIInput('device-1', 'Test MIDI Keyboard');
      const mockMIDIAccess = createMockMIDIAccess([mockInput]);
      Object.defineProperty(navigator, 'requestMIDIAccess', {
        value: vi.fn().mockResolvedValue(mockMIDIAccess),
        writable: true,
        configurable: true,
      });

      // 実行
      const { result } = renderHook(() =>
        useMidiInput({ onKeyPress: onKeyPressMock, enabled: true })
      );

      // 検証
      await waitFor(() => {
        expect(result.current.devices).toHaveLength(1);
        expect(result.current.devices[0].name).toBe('Test MIDI Keyboard');
      });
    });

    it('最初のデバイスが自動選択される', async () => {
      // 準備
      const mockInput = createMockMIDIInput('device-1', 'Test MIDI Keyboard');
      const mockMIDIAccess = createMockMIDIAccess([mockInput]);
      Object.defineProperty(navigator, 'requestMIDIAccess', {
        value: vi.fn().mockResolvedValue(mockMIDIAccess),
        writable: true,
        configurable: true,
      });

      // 実行
      const { result } = renderHook(() =>
        useMidiInput({ onKeyPress: onKeyPressMock, enabled: true })
      );

      // 検証
      await waitFor(() => {
        expect(result.current.selectedDeviceId).toBe('device-1');
      });
    });

    it('デバイスが接続されていない場合devicesは空配列', async () => {
      // 準備
      const mockMIDIAccess = createMockMIDIAccess([]);
      Object.defineProperty(navigator, 'requestMIDIAccess', {
        value: vi.fn().mockResolvedValue(mockMIDIAccess),
        writable: true,
        configurable: true,
      });

      // 実行
      const { result } = renderHook(() =>
        useMidiInput({ onKeyPress: onKeyPressMock, enabled: true })
      );

      // 検証
      await waitFor(() => {
        expect(result.current.devices).toHaveLength(0);
        expect(result.current.selectedDeviceId).toBeNull();
      });
    });
  });

  describe('有効/無効切り替え', () => {
    it('enabled=falseの場合はMIDI初期化が行われない', () => {
      // 準備
      const requestMIDIAccessMock = vi.fn();
      Object.defineProperty(navigator, 'requestMIDIAccess', {
        value: requestMIDIAccessMock,
        writable: true,
        configurable: true,
      });

      // 実行
      renderHook(() =>
        useMidiInput({ onKeyPress: onKeyPressMock, enabled: false })
      );

      // 検証
      expect(requestMIDIAccessMock).not.toHaveBeenCalled();
    });
  });
});

describe('MIDIノート変換', () => {
  // useMidiInput内のmidiNoteToVexFlow関数のテスト
  // この関数はモジュール内部にあるため、間接的にテストする

  it('MIDIノート60(中央C)がc/4に変換される', async () => {
    // 準備
    const onKeyPressMock = vi.fn();
    const mockInput = createMockMIDIInput('device-1', 'Test MIDI Keyboard');
    const mockMIDIAccess = createMockMIDIAccess([mockInput]);
    Object.defineProperty(navigator, 'requestMIDIAccess', {
      value: vi.fn().mockResolvedValue(mockMIDIAccess),
      writable: true,
      configurable: true,
    });

    // 実行
    const { result } = renderHook(() =>
      useMidiInput({ onKeyPress: onKeyPressMock, enabled: true })
    );

    // デバイス選択を待つ
    await waitFor(() => {
      expect(result.current.selectedDeviceId).toBe('device-1');
    });

    // MIDIメッセージをシミュレート（Note On: 0x90, note: 60, velocity: 100）
    act(() => {
      if (mockInput.onmidimessage) {
        const event = {
          data: new Uint8Array([0x90, 60, 100]),
        } as MIDIMessageEvent;
        mockInput.onmidimessage(event);
      }
    });

    // 検証
    expect(onKeyPressMock).toHaveBeenCalledWith('c/4');
  });

  it('MIDIノート72(C5)がc/5に変換される', async () => {
    // 準備
    const onKeyPressMock = vi.fn();
    const mockInput = createMockMIDIInput('device-1', 'Test MIDI Keyboard');
    const mockMIDIAccess = createMockMIDIAccess([mockInput]);
    Object.defineProperty(navigator, 'requestMIDIAccess', {
      value: vi.fn().mockResolvedValue(mockMIDIAccess),
      writable: true,
      configurable: true,
    });

    // 実行
    const { result } = renderHook(() =>
      useMidiInput({ onKeyPress: onKeyPressMock, enabled: true })
    );

    await waitFor(() => {
      expect(result.current.selectedDeviceId).toBe('device-1');
    });

    // MIDIメッセージをシミュレート（Note On: 0x90, note: 72, velocity: 100）
    act(() => {
      if (mockInput.onmidimessage) {
        const event = {
          data: new Uint8Array([0x90, 72, 100]),
        } as MIDIMessageEvent;
        mockInput.onmidimessage(event);
      }
    });

    // 検証
    expect(onKeyPressMock).toHaveBeenCalledWith('c/5');
  });

  it('velocity=0のNote Onメッセージは無視される', async () => {
    // 準備
    const onKeyPressMock = vi.fn();
    const mockInput = createMockMIDIInput('device-1', 'Test MIDI Keyboard');
    const mockMIDIAccess = createMockMIDIAccess([mockInput]);
    Object.defineProperty(navigator, 'requestMIDIAccess', {
      value: vi.fn().mockResolvedValue(mockMIDIAccess),
      writable: true,
      configurable: true,
    });

    // 実行
    const { result } = renderHook(() =>
      useMidiInput({ onKeyPress: onKeyPressMock, enabled: true })
    );

    await waitFor(() => {
      expect(result.current.selectedDeviceId).toBe('device-1');
    });

    // MIDIメッセージをシミュレート（Note On with velocity 0 = Note Off）
    act(() => {
      if (mockInput.onmidimessage) {
        const event = {
          data: new Uint8Array([0x90, 60, 0]),
        } as MIDIMessageEvent;
        mockInput.onmidimessage(event);
      }
    });

    // 検証
    expect(onKeyPressMock).not.toHaveBeenCalled();
  });

  it('Note Offメッセージ(0x80)は無視される', async () => {
    // 準備
    const onKeyPressMock = vi.fn();
    const mockInput = createMockMIDIInput('device-1', 'Test MIDI Keyboard');
    const mockMIDIAccess = createMockMIDIAccess([mockInput]);
    Object.defineProperty(navigator, 'requestMIDIAccess', {
      value: vi.fn().mockResolvedValue(mockMIDIAccess),
      writable: true,
      configurable: true,
    });

    // 実行
    const { result } = renderHook(() =>
      useMidiInput({ onKeyPress: onKeyPressMock, enabled: true })
    );

    await waitFor(() => {
      expect(result.current.selectedDeviceId).toBe('device-1');
    });

    // MIDIメッセージをシミュレート（Note Off: 0x80）
    act(() => {
      if (mockInput.onmidimessage) {
        const event = {
          data: new Uint8Array([0x80, 60, 64]),
        } as MIDIMessageEvent;
        mockInput.onmidimessage(event);
      }
    });

    // 検証
    expect(onKeyPressMock).not.toHaveBeenCalled();
  });
});
