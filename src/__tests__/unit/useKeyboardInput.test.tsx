import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ReactNode } from 'react';
import { useKeyboardInput } from '../../hooks/useKeyboardInput';
import { ScoreProvider } from '../../context/ScoreContext';

// ScoreProviderでラップするwrapper
function wrapper({ children }: { children: ReactNode }) {
  return <ScoreProvider>{children}</ScoreProvider>;
}

// キーボードイベントをシミュレート
function fireKeyDown(key: string, options: Partial<KeyboardEventInit> = {}) {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    ...options,
  });
  window.dispatchEvent(event);
  return event;
}

describe('useKeyboardInput', () => {
  let onKeyPressMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onKeyPressMock = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('音名キーモード', () => {
    it('Cキーを押すとc/{currentOctave}で呼び出される', () => {
      // 準備
      renderHook(
        () => useKeyboardInput({ onKeyPress: onKeyPressMock, enabled: true }),
        { wrapper }
      );

      // 実行
      act(() => {
        fireKeyDown('c');
      });

      // 検証
      expect(onKeyPressMock).toHaveBeenCalledWith('c/4');
    });

    it('大文字Cキーでもc/{currentOctave}で呼び出される', () => {
      // 準備
      renderHook(
        () => useKeyboardInput({ onKeyPress: onKeyPressMock, enabled: true }),
        { wrapper }
      );

      // 実行
      act(() => {
        fireKeyDown('C');
      });

      // 検証
      expect(onKeyPressMock).toHaveBeenCalledWith('c/4');
    });

    it('すべての音名キー(C,D,E,F,G,A,B)が正しく変換される', () => {
      // 準備
      renderHook(
        () => useKeyboardInput({ onKeyPress: onKeyPressMock, enabled: true }),
        { wrapper }
      );

      // 実行・検証
      const notes = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
      notes.forEach((note) => {
        act(() => {
          fireKeyDown(note);
        });
        expect(onKeyPressMock).toHaveBeenCalledWith(`${note}/4`);
      });
    });

    it('無効なキーではコールバックが呼ばれない', () => {
      // 準備
      renderHook(
        () => useKeyboardInput({ onKeyPress: onKeyPressMock, enabled: true }),
        { wrapper }
      );

      // 実行
      act(() => {
        fireKeyDown('x');
      });

      // 検証
      expect(onKeyPressMock).not.toHaveBeenCalled();
    });
  });

  describe('競合回避', () => {
    it('Ctrl+キーではコールバックが呼ばれない', () => {
      // 準備
      renderHook(
        () => useKeyboardInput({ onKeyPress: onKeyPressMock, enabled: true }),
        { wrapper }
      );

      // 実行
      act(() => {
        fireKeyDown('c', { ctrlKey: true });
      });

      // 検証
      expect(onKeyPressMock).not.toHaveBeenCalled();
    });

    it('Meta+キーではコールバックが呼ばれない', () => {
      // 準備
      renderHook(
        () => useKeyboardInput({ onKeyPress: onKeyPressMock, enabled: true }),
        { wrapper }
      );

      // 実行
      act(() => {
        fireKeyDown('c', { metaKey: true });
      });

      // 検証
      expect(onKeyPressMock).not.toHaveBeenCalled();
    });

    it('Alt+キーではコールバックが呼ばれない', () => {
      // 準備
      renderHook(
        () => useKeyboardInput({ onKeyPress: onKeyPressMock, enabled: true }),
        { wrapper }
      );

      // 実行
      act(() => {
        fireKeyDown('c', { altKey: true });
      });

      // 検証
      expect(onKeyPressMock).not.toHaveBeenCalled();
    });

    it('Spaceキーではコールバックが呼ばれない', () => {
      // 準備
      renderHook(
        () => useKeyboardInput({ onKeyPress: onKeyPressMock, enabled: true }),
        { wrapper }
      );

      // 実行
      act(() => {
        fireKeyDown(' ');
      });

      // 検証
      expect(onKeyPressMock).not.toHaveBeenCalled();
    });

    it('Deleteキーではコールバックが呼ばれない', () => {
      // 準備
      renderHook(
        () => useKeyboardInput({ onKeyPress: onKeyPressMock, enabled: true }),
        { wrapper }
      );

      // 実行
      act(() => {
        fireKeyDown('Delete');
      });

      // 検証
      expect(onKeyPressMock).not.toHaveBeenCalled();
    });

    it('Backspaceキーではコールバックが呼ばれない', () => {
      // 準備
      renderHook(
        () => useKeyboardInput({ onKeyPress: onKeyPressMock, enabled: true }),
        { wrapper }
      );

      // 実行
      act(() => {
        fireKeyDown('Backspace');
      });

      // 検証
      expect(onKeyPressMock).not.toHaveBeenCalled();
    });
  });

  describe('有効/無効切り替え', () => {
    it('enabled=falseの場合はコールバックが呼ばれない', () => {
      // 準備
      renderHook(
        () => useKeyboardInput({ onKeyPress: onKeyPressMock, enabled: false }),
        { wrapper }
      );

      // 実行
      act(() => {
        fireKeyDown('c');
      });

      // 検証
      expect(onKeyPressMock).not.toHaveBeenCalled();
    });
  });

  describe('オクターブ制御', () => {
    it('ArrowUpキーでオクターブが上がる（コールバックは呼ばれない）', () => {
      // 準備
      renderHook(
        () => useKeyboardInput({ onKeyPress: onKeyPressMock, enabled: true }),
        { wrapper }
      );

      // 実行
      act(() => {
        fireKeyDown('ArrowUp');
      });

      // 検証：オクターブ変更時はコールバックが呼ばれない
      expect(onKeyPressMock).not.toHaveBeenCalled();
    });

    it('ArrowDownキーでオクターブが下がる（コールバックは呼ばれない）', () => {
      // 準備
      renderHook(
        () => useKeyboardInput({ onKeyPress: onKeyPressMock, enabled: true }),
        { wrapper }
      );

      // 実行
      act(() => {
        fireKeyDown('ArrowDown');
      });

      // 検証：オクターブ変更時はコールバックが呼ばれない
      expect(onKeyPressMock).not.toHaveBeenCalled();
    });

    it('ArrowUp後にCキーを押すと上がったオクターブで呼ばれる', () => {
      // 準備
      renderHook(
        () => useKeyboardInput({ onKeyPress: onKeyPressMock, enabled: true }),
        { wrapper }
      );

      // 実行
      act(() => {
        fireKeyDown('ArrowUp');
      });
      act(() => {
        fireKeyDown('c');
      });

      // 検証
      expect(onKeyPressMock).toHaveBeenCalledWith('c/5');
    });

    it('ArrowDown後にCキーを押すと下がったオクターブで呼ばれる', () => {
      // 準備
      renderHook(
        () => useKeyboardInput({ onKeyPress: onKeyPressMock, enabled: true }),
        { wrapper }
      );

      // 実行
      act(() => {
        fireKeyDown('ArrowDown');
      });
      act(() => {
        fireKeyDown('c');
      });

      // 検証
      expect(onKeyPressMock).toHaveBeenCalledWith('c/3');
    });
  });

  describe('戻り値', () => {
    it('currentOctaveが返される', () => {
      // 準備・実行
      const { result } = renderHook(
        () => useKeyboardInput({ onKeyPress: onKeyPressMock, enabled: true }),
        { wrapper }
      );

      // 検証
      expect(result.current.currentOctave).toBe(4);
    });

    it('keyboardInputModeが返される', () => {
      // 準備・実行
      const { result } = renderHook(
        () => useKeyboardInput({ onKeyPress: onKeyPressMock, enabled: true }),
        { wrapper }
      );

      // 検証
      expect(result.current.keyboardInputMode).toBe('noteName');
    });
  });
});
