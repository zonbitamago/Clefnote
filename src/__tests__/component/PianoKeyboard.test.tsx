import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../utils/test-utils';
import { PianoKeyboard } from '../../components/PianoKeyboard';

describe('PianoKeyboard', () => {
  describe('レンダリング', () => {
    it('3オクターブ分の鍵盤を表示する', () => {
      // 準備
      const onKeyPress = vi.fn();

      // 実行
      render(<PianoKeyboard onKeyPress={onKeyPress} />);

      // 検証 - 各オクターブのCキーがあることを確認
      expect(screen.getByText('C3')).toBeInTheDocument();
      expect(screen.getByText('C4')).toBeInTheDocument();
      expect(screen.getByText('C5')).toBeInTheDocument();
    });

    it('白鍵が7つ × 3オクターブ = 21個表示される', () => {
      // 準備
      const onKeyPress = vi.fn();

      // 実行
      render(<PianoKeyboard onKeyPress={onKeyPress} />);

      // 検証
      const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
      const octaves = [3, 4, 5];

      whiteKeys.forEach(key => {
        octaves.forEach(octave => {
          expect(screen.getByText(`${key}${octave}`)).toBeInTheDocument();
        });
      });
    });

    it('黒鍵ボタンが存在する', () => {
      // 準備
      const onKeyPress = vi.fn();

      // 実行
      const { container } = render(<PianoKeyboard onKeyPress={onKeyPress} />);

      // 検証 - 黒鍵は5つ × 3オクターブ = 15個
      const blackKeys = container.querySelectorAll('[class*="blackKey"]');
      expect(blackKeys.length).toBe(15);
    });
  });

  describe('キーボード操作', () => {
    it('白鍵をクリックするとonKeyPressが呼ばれる', () => {
      // 準備
      const onKeyPress = vi.fn();
      render(<PianoKeyboard onKeyPress={onKeyPress} />);

      // 実行
      fireEvent.click(screen.getByText('C4'));

      // 検証
      expect(onKeyPress).toHaveBeenCalledWith('c/4');
    });

    it('D4キーをクリックするとd/4形式で呼ばれる', () => {
      // 準備
      const onKeyPress = vi.fn();
      render(<PianoKeyboard onKeyPress={onKeyPress} />);

      // 実行
      fireEvent.click(screen.getByText('D4'));

      // 検証
      expect(onKeyPress).toHaveBeenCalledWith('d/4');
    });

    it('異なるオクターブの同じ音をクリックすると正しいオクターブで呼ばれる', () => {
      // 準備
      const onKeyPress = vi.fn();
      render(<PianoKeyboard onKeyPress={onKeyPress} />);

      // 実行
      fireEvent.click(screen.getByText('C3'));
      fireEvent.click(screen.getByText('C5'));

      // 検証
      expect(onKeyPress).toHaveBeenCalledWith('c/3');
      expect(onKeyPress).toHaveBeenCalledWith('c/5');
    });

    it('黒鍵をクリックするとシャープ付きで呼ばれる', () => {
      // 準備
      const onKeyPress = vi.fn();
      const { container } = render(<PianoKeyboard onKeyPress={onKeyPress} />);

      // 実行 - 最初の黒鍵（C#3）をクリック
      const blackKeys = container.querySelectorAll('[class*="blackKey"]');
      fireEvent.click(blackKeys[0]);

      // 検証
      expect(onKeyPress).toHaveBeenCalledWith('c#/3');
    });

    it('複数回クリックすると複数回呼ばれる', () => {
      // 準備
      const onKeyPress = vi.fn();
      render(<PianoKeyboard onKeyPress={onKeyPress} />);

      // 実行
      fireEvent.click(screen.getByText('C4'));
      fireEvent.click(screen.getByText('E4'));
      fireEvent.click(screen.getByText('G4'));

      // 検証
      expect(onKeyPress).toHaveBeenCalledTimes(3);
      expect(onKeyPress).toHaveBeenCalledWith('c/4');
      expect(onKeyPress).toHaveBeenCalledWith('e/4');
      expect(onKeyPress).toHaveBeenCalledWith('g/4');
    });

    it('全ての白鍵が正しいVexFlow形式でキーを送信する', () => {
      // 準備
      const onKeyPress = vi.fn();
      render(<PianoKeyboard onKeyPress={onKeyPress} />);

      // 実行
      const whiteKeyLabels = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
      whiteKeyLabels.forEach(label => {
        fireEvent.click(screen.getByText(`${label}4`));
      });

      // 検証
      expect(onKeyPress).toHaveBeenCalledWith('c/4');
      expect(onKeyPress).toHaveBeenCalledWith('d/4');
      expect(onKeyPress).toHaveBeenCalledWith('e/4');
      expect(onKeyPress).toHaveBeenCalledWith('f/4');
      expect(onKeyPress).toHaveBeenCalledWith('g/4');
      expect(onKeyPress).toHaveBeenCalledWith('a/4');
      expect(onKeyPress).toHaveBeenCalledWith('b/4');
    });
  });

  describe('黒鍵の配置', () => {
    it('E音とB音の隣には黒鍵がない', () => {
      // 準備
      const onKeyPress = vi.fn();
      const { container } = render(<PianoKeyboard onKeyPress={onKeyPress} />);

      // 実行 - 全ての黒鍵をクリック
      const blackKeys = container.querySelectorAll('[class*="blackKey"]');
      blackKeys.forEach(key => {
        fireEvent.click(key);
      });

      // 検証 - e#とb#は存在しない
      const calls = onKeyPress.mock.calls.map(call => call[0]);
      expect(calls).not.toContain('e#/3');
      expect(calls).not.toContain('e#/4');
      expect(calls).not.toContain('e#/5');
      expect(calls).not.toContain('b#/3');
      expect(calls).not.toContain('b#/4');
      expect(calls).not.toContain('b#/5');
    });

    it('黒鍵はc#, d#, f#, g#, a#の5種類のみ存在する', () => {
      // 準備
      const onKeyPress = vi.fn();
      const { container } = render(<PianoKeyboard onKeyPress={onKeyPress} />);

      // 実行 - オクターブ4の全ての黒鍵をクリック
      const blackKeys = container.querySelectorAll('[class*="blackKey"]');
      // オクターブ4は2番目のオクターブ（インデックス5-9）
      [5, 6, 7, 8, 9].forEach(i => {
        fireEvent.click(blackKeys[i]);
      });

      // 検証
      expect(onKeyPress).toHaveBeenCalledWith('c#/4');
      expect(onKeyPress).toHaveBeenCalledWith('d#/4');
      expect(onKeyPress).toHaveBeenCalledWith('f#/4');
      expect(onKeyPress).toHaveBeenCalledWith('g#/4');
      expect(onKeyPress).toHaveBeenCalledWith('a#/4');
    });
  });
});
