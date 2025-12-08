import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../utils/test-utils';
import { Toolbar } from '../../components/Toolbar';

// デフォルトのpropsを作成するヘルパー
function createDefaultProps() {
  return {
    onPlay: vi.fn(),
    onStop: vi.fn(),
    onSave: vi.fn(),
    onLoad: vi.fn(),
    onExportPDF: vi.fn(),
    onExportMusicXML: vi.fn(),
    isPlaying: false,
  };
}

describe('Toolbar', () => {
  describe('レンダリング', () => {
    it('タイトル入力フィールドを表示する', () => {
      // 準備
      const props = createDefaultProps();

      // 実行
      render(<Toolbar {...props} />);

      // 検証 - デフォルトのタイトル「無題」が表示されている
      expect(screen.getByDisplayValue('無題')).toBeInTheDocument();
      expect(screen.getByText('タイトル:')).toBeInTheDocument();
    });

    it('音価ボタンを5つ表示する', () => {
      // 準備
      const props = createDefaultProps();

      // 実行
      render(<Toolbar {...props} />);

      // 検証
      expect(screen.getByTitle('全音符')).toBeInTheDocument();
      expect(screen.getByTitle('2分音符')).toBeInTheDocument();
      expect(screen.getByTitle('4分音符')).toBeInTheDocument();
      expect(screen.getByTitle('8分音符')).toBeInTheDocument();
      expect(screen.getByTitle('16分音符')).toBeInTheDocument();
    });

    it('臨時記号ボタンを3つ表示する', () => {
      // 準備
      const props = createDefaultProps();

      // 実行
      render(<Toolbar {...props} />);

      // 検証
      expect(screen.getByText('♮')).toBeInTheDocument();
      expect(screen.getByText('♯')).toBeInTheDocument();
      expect(screen.getByText('♭')).toBeInTheDocument();
    });

    it('休符モードボタンを表示する', () => {
      // 準備
      const props = createDefaultProps();

      // 実行
      render(<Toolbar {...props} />);

      // 検証
      expect(screen.getByTitle('休符モード')).toBeInTheDocument();
    });

    it('付点ボタンを表示する', () => {
      // 準備
      const props = createDefaultProps();

      // 実行
      render(<Toolbar {...props} />);

      // 検証
      expect(screen.getByTitle('付点')).toBeInTheDocument();
    });

    it('テンポ入力フィールドを表示する', () => {
      // 準備
      const props = createDefaultProps();

      // 実行
      render(<Toolbar {...props} />);

      // 検証 - デフォルトのテンポ120が表示されている
      expect(screen.getByDisplayValue('120')).toBeInTheDocument();
      expect(screen.getByText('テンポ:')).toBeInTheDocument();
    });

    it('Undo/Redoボタンを表示する', () => {
      // 準備
      const props = createDefaultProps();

      // 実行
      render(<Toolbar {...props} />);

      // 検証
      expect(screen.getByTitle(/元に戻す/)).toBeInTheDocument();
      expect(screen.getByTitle(/やり直し/)).toBeInTheDocument();
    });

    it('再生ボタンを表示する（停止中）', () => {
      // 準備
      const props = createDefaultProps();
      props.isPlaying = false;

      // 実行
      render(<Toolbar {...props} />);

      // 検証
      expect(screen.getByText('▶')).toBeInTheDocument();
    });

    it('停止ボタンを表示する（再生中）', () => {
      // 準備
      const props = createDefaultProps();
      props.isPlaying = true;

      // 実行
      render(<Toolbar {...props} />);

      // 検証
      expect(screen.getByText('⏹')).toBeInTheDocument();
    });

    it('保存/読み込みボタンを表示する', () => {
      // 準備
      const props = createDefaultProps();

      // 実行
      render(<Toolbar {...props} />);

      // 検証
      expect(screen.getByTitle('保存')).toBeInTheDocument();
      expect(screen.getByTitle('開く')).toBeInTheDocument();
    });

    it('エクスポートボタンを表示する', () => {
      // 準備
      const props = createDefaultProps();

      // 実行
      render(<Toolbar {...props} />);

      // 検証
      expect(screen.getByTitle('PDF出力')).toBeInTheDocument();
      expect(screen.getByTitle('MusicXML出力')).toBeInTheDocument();
    });
  });

  describe('タイトル入力', () => {
    it('タイトルを変更できる', () => {
      // 準備
      const props = createDefaultProps();
      render(<Toolbar {...props} />);
      const input = screen.getByDisplayValue('無題') as HTMLInputElement;

      // 実行
      fireEvent.change(input, { target: { value: '新しいタイトル' } });

      // 検証
      expect(input.value).toBe('新しいタイトル');
    });
  });

  describe('テンポ入力', () => {
    it('テンポを変更できる', () => {
      // 準備
      const props = createDefaultProps();
      render(<Toolbar {...props} />);
      const input = screen.getByDisplayValue('120') as HTMLInputElement;

      // 実行
      fireEvent.change(input, { target: { value: '100' } });

      // 検証
      expect(input.value).toBe('100');
    });

    it('テンポの最小値が40に設定されている', () => {
      // 準備
      const props = createDefaultProps();
      render(<Toolbar {...props} />);

      // 実行
      const input = screen.getByDisplayValue('120') as HTMLInputElement;

      // 検証
      expect(input.min).toBe('40');
    });

    it('テンポの最大値が240に設定されている', () => {
      // 準備
      const props = createDefaultProps();
      render(<Toolbar {...props} />);

      // 実行
      const input = screen.getByDisplayValue('120') as HTMLInputElement;

      // 検証
      expect(input.max).toBe('240');
    });
  });

  describe('再生/停止操作', () => {
    it('停止中に再生ボタンをクリックするとonPlayが呼ばれる', () => {
      // 準備
      const props = createDefaultProps();
      props.isPlaying = false;
      render(<Toolbar {...props} />);

      // 実行
      fireEvent.click(screen.getByText('▶'));

      // 検証
      expect(props.onPlay).toHaveBeenCalledTimes(1);
    });

    it('再生中に停止ボタンをクリックするとonStopが呼ばれる', () => {
      // 準備
      const props = createDefaultProps();
      props.isPlaying = true;
      render(<Toolbar {...props} />);

      // 実行
      fireEvent.click(screen.getByText('⏹'));

      // 検証
      expect(props.onStop).toHaveBeenCalledTimes(1);
    });
  });

  describe('ファイル操作', () => {
    it('保存ボタンをクリックするとonSaveが呼ばれる', () => {
      // 準備
      const props = createDefaultProps();
      render(<Toolbar {...props} />);

      // 実行
      fireEvent.click(screen.getByTitle('保存'));

      // 検証
      expect(props.onSave).toHaveBeenCalledTimes(1);
    });

    it('開くボタンをクリックするとonLoadが呼ばれる', () => {
      // 準備
      const props = createDefaultProps();
      render(<Toolbar {...props} />);

      // 実行
      fireEvent.click(screen.getByTitle('開く'));

      // 検証
      expect(props.onLoad).toHaveBeenCalledTimes(1);
    });

    it('PDFボタンをクリックするとonExportPDFが呼ばれる', () => {
      // 準備
      const props = createDefaultProps();
      render(<Toolbar {...props} />);

      // 実行
      fireEvent.click(screen.getByTitle('PDF出力'));

      // 検証
      expect(props.onExportPDF).toHaveBeenCalledTimes(1);
    });

    it('XMLボタンをクリックするとonExportMusicXMLが呼ばれる', () => {
      // 準備
      const props = createDefaultProps();
      render(<Toolbar {...props} />);

      // 実行
      fireEvent.click(screen.getByTitle('MusicXML出力'));

      // 検証
      expect(props.onExportMusicXML).toHaveBeenCalledTimes(1);
    });
  });

  describe('音価選択', () => {
    it('4分音符ボタンをクリックすると音価が変更される', () => {
      // 準備
      const props = createDefaultProps();
      render(<Toolbar {...props} />);

      // 実行
      fireEvent.click(screen.getByTitle('4分音符'));

      // 検証 - ボタンがアクティブ状態かどうかをクラスで確認
      const button = screen.getByTitle('4分音符');
      expect(button.className).toContain('active');
    });

    it('全音符ボタンをクリックすると音価が変更される', () => {
      // 準備
      const props = createDefaultProps();
      render(<Toolbar {...props} />);

      // 実行
      fireEvent.click(screen.getByTitle('全音符'));

      // 検証
      const button = screen.getByTitle('全音符');
      expect(button.className).toContain('active');
    });
  });

  describe('休符モード', () => {
    it('休符モードボタンをクリックするとトグルされる', () => {
      // 準備
      const props = createDefaultProps();
      render(<Toolbar {...props} />);
      const button = screen.getByTitle('休符モード');

      // 実行
      fireEvent.click(button);

      // 検証 - クリック後にアクティブ状態になる
      expect(button.className).toContain('active');
    });
  });

  describe('付点モード', () => {
    it('付点ボタンをクリックするとトグルされる', () => {
      // 準備
      const props = createDefaultProps();
      render(<Toolbar {...props} />);
      const button = screen.getByTitle('付点');

      // 実行
      fireEvent.click(button);

      // 検証 - クリック後にアクティブ状態になる
      expect(button.className).toContain('active');
    });
  });

  describe('臨時記号選択', () => {
    it('シャープボタンをクリックすると選択される', () => {
      // 準備
      const props = createDefaultProps();
      render(<Toolbar {...props} />);

      // 実行
      fireEvent.click(screen.getByText('♯'));

      // 検証
      const button = screen.getByText('♯');
      expect(button.className).toContain('active');
    });

    it('フラットボタンをクリックすると選択される', () => {
      // 準備
      const props = createDefaultProps();
      render(<Toolbar {...props} />);

      // 実行
      fireEvent.click(screen.getByText('♭'));

      // 検証
      const button = screen.getByText('♭');
      expect(button.className).toContain('active');
    });

    it('ナチュラルボタンをクリックすると臨時記号が解除される', () => {
      // 準備
      const props = createDefaultProps();
      render(<Toolbar {...props} />);

      // まずシャープを選択
      fireEvent.click(screen.getByText('♯'));

      // 実行
      fireEvent.click(screen.getByText('♮'));

      // 検証
      const button = screen.getByText('♮');
      expect(button.className).toContain('active');
    });
  });
});
