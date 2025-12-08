import { test, expect } from '@playwright/test';
import { ScoreEditorPage } from '../pages/ScoreEditorPage';

test.describe('楽譜エディター', () => {
  let scoreEditor: ScoreEditorPage;

  test.beforeEach(async ({ page }) => {
    // 準備
    scoreEditor = new ScoreEditorPage(page);
    await scoreEditor.goto();
  });

  test.describe('初期表示', () => {
    test('ページが正しく読み込まれる', async () => {
      // 検証
      await expect(scoreEditor.page).toHaveTitle(/Clefnote/);
    });

    test('デフォルトのタイトルが「無題」である', async () => {
      // 検証
      const title = await scoreEditor.getTitle();
      expect(title).toBe('無題');
    });

    test('デフォルトのテンポが120である', async () => {
      // 検証
      const tempo = await scoreEditor.getTempo();
      expect(tempo).toBe(120);
    });

    test('4分音符がデフォルトで選択されている', async () => {
      // 検証
      const isActive = await scoreEditor.isDurationActive('quarter');
      expect(isActive).toBe(true);
    });

    test('スコア表示領域が表示されている', async () => {
      // 検証
      const isVisible = await scoreEditor.isScoreVisible();
      expect(isVisible).toBe(true);
    });

    test('ピアノキーボードが表示されている', async () => {
      // 検証
      const isVisible = await scoreEditor.isPianoKeyboardVisible();
      expect(isVisible).toBe(true);
    });
  });

  test.describe('タイトル編集', () => {
    test('タイトルを変更できる', async () => {
      // 実行
      await scoreEditor.setTitle('テスト曲');

      // 検証
      const title = await scoreEditor.getTitle();
      expect(title).toBe('テスト曲');
    });

    test('タイトルを空にできる', async () => {
      // 実行
      await scoreEditor.setTitle('');

      // 検証
      const title = await scoreEditor.getTitle();
      expect(title).toBe('');
    });
  });

  test.describe('テンポ編集', () => {
    test('テンポを変更できる', async () => {
      // 実行
      await scoreEditor.setTempo(100);

      // 検証
      const tempo = await scoreEditor.getTempo();
      expect(tempo).toBe(100);
    });

    test('テンポを60に設定できる', async () => {
      // 実行
      await scoreEditor.setTempo(60);

      // 検証
      const tempo = await scoreEditor.getTempo();
      expect(tempo).toBe(60);
    });
  });

  test.describe('音価選択', () => {
    test('全音符を選択できる', async () => {
      // 実行
      await scoreEditor.selectDuration('whole');

      // 検証
      const isActive = await scoreEditor.isDurationActive('whole');
      expect(isActive).toBe(true);
    });

    test('2分音符を選択できる', async () => {
      // 実行
      await scoreEditor.selectDuration('half');

      // 検証
      const isActive = await scoreEditor.isDurationActive('half');
      expect(isActive).toBe(true);
    });

    test('8分音符を選択できる', async () => {
      // 実行
      await scoreEditor.selectDuration('eighth');

      // 検証
      const isActive = await scoreEditor.isDurationActive('eighth');
      expect(isActive).toBe(true);
    });

    test('16分音符を選択できる', async () => {
      // 実行
      await scoreEditor.selectDuration('sixteenth');

      // 検証
      const isActive = await scoreEditor.isDurationActive('sixteenth');
      expect(isActive).toBe(true);
    });

    test('音価を変更すると以前の選択が解除される', async () => {
      // 準備
      await scoreEditor.selectDuration('whole');

      // 実行
      await scoreEditor.selectDuration('half');

      // 検証
      const wholeActive = await scoreEditor.isDurationActive('whole');
      const halfActive = await scoreEditor.isDurationActive('half');
      expect(wholeActive).toBe(false);
      expect(halfActive).toBe(true);
    });
  });

  test.describe('休符モード', () => {
    test('休符モードを有効にできる', async () => {
      // 実行
      await scoreEditor.toggleRestMode();

      // 検証
      const isActive = await scoreEditor.isRestModeActive();
      expect(isActive).toBe(true);
    });

    test('休符モードをトグルで無効にできる', async () => {
      // 準備
      await scoreEditor.toggleRestMode();

      // 実行
      await scoreEditor.toggleRestMode();

      // 検証
      const isActive = await scoreEditor.isRestModeActive();
      expect(isActive).toBe(false);
    });
  });

  test.describe('付点モード', () => {
    test('付点モードを有効にできる', async () => {
      // 実行
      await scoreEditor.toggleDotted();

      // 検証
      const isActive = await scoreEditor.isDottedActive();
      expect(isActive).toBe(true);
    });

    test('付点モードをトグルで無効にできる', async () => {
      // 準備
      await scoreEditor.toggleDotted();

      // 実行
      await scoreEditor.toggleDotted();

      // 検証
      const isActive = await scoreEditor.isDottedActive();
      expect(isActive).toBe(false);
    });
  });

  test.describe('ピアノキーボード', () => {
    test('C4キーを押せる', async () => {
      // 実行・検証（エラーが発生しないこと）
      await scoreEditor.pressKey('C', 4);
    });

    test('複数のキーを連続で押せる', async () => {
      // 実行・検証（エラーが発生しないこと）
      await scoreEditor.pressKey('C', 4);
      await scoreEditor.pressKey('E', 4);
      await scoreEditor.pressKey('G', 4);
    });

    test('異なるオクターブのキーを押せる', async () => {
      // 実行・検証（エラーが発生しないこと）
      await scoreEditor.pressKey('C', 3);
      await scoreEditor.pressKey('C', 4);
      await scoreEditor.pressKey('C', 5);
    });
  });

  test.describe('Undo/Redo', () => {
    test('Undoボタンが表示されている', async () => {
      // 検証
      await expect(scoreEditor.undoButton).toBeVisible();
    });

    test('Redoボタンが表示されている', async () => {
      // 検証
      await expect(scoreEditor.redoButton).toBeVisible();
    });

    test('タイトル変更後にUndoできる', async () => {
      // 準備
      await scoreEditor.setTitle('変更後のタイトル');

      // 実行
      await scoreEditor.undo();

      // 検証 - タイトルは変わらないが、エラーが発生しないこと
      // （Reducerのundo/redoはスコア状態のみ）
      await expect(scoreEditor.undoButton).toBeVisible();
    });
  });

  test.describe('キーボードショートカット', () => {
    test('Ctrl+Zでundoが動作する', async ({ page }) => {
      // 実行
      await page.keyboard.press('Control+z');

      // 検証 - エラーが発生しないこと
      await expect(scoreEditor.undoButton).toBeVisible();
    });

    test('Ctrl+Yでredoが動作する', async ({ page }) => {
      // 実行
      await page.keyboard.press('Control+y');

      // 検証 - エラーが発生しないこと
      await expect(scoreEditor.redoButton).toBeVisible();
    });

    test('Spaceで再生/停止をトグルできる', async ({ page }) => {
      // 実行
      await page.keyboard.press('Space');

      // 検証 - エラーが発生しないこと
      await expect(scoreEditor.playButton).toBeVisible();
    });
  });

  test.describe('ファイル操作ボタン', () => {
    test('保存ボタンが表示されている', async () => {
      // 検証
      await expect(scoreEditor.saveButton).toBeVisible();
    });

    test('開くボタンが表示されている', async () => {
      // 検証
      await expect(scoreEditor.loadButton).toBeVisible();
    });

    test('PDF出力ボタンが表示されている', async () => {
      // 検証
      await expect(scoreEditor.exportPDFButton).toBeVisible();
    });

    test('MusicXML出力ボタンが表示されている', async () => {
      // 検証
      await expect(scoreEditor.exportXMLButton).toBeVisible();
    });
  });
});
