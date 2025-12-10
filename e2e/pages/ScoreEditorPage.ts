import { type Page, type Locator } from '@playwright/test';

/**
 * Score Editor Page Object
 * メインの楽譜エディター画面を表すPage Object
 */
export class ScoreEditorPage {
  readonly page: Page;

  // ツールバー要素
  readonly titleInput: Locator;
  readonly tempoInput: Locator;
  readonly playButton: Locator;
  readonly saveButton: Locator;
  readonly loadButton: Locator;
  readonly exportPDFButton: Locator;
  readonly exportXMLButton: Locator;
  readonly undoButton: Locator;
  readonly redoButton: Locator;

  // 音価ボタン
  readonly wholeNoteButton: Locator;
  readonly halfNoteButton: Locator;
  readonly quarterNoteButton: Locator;
  readonly eighthNoteButton: Locator;
  readonly sixteenthNoteButton: Locator;

  // 臨時記号ボタン
  readonly naturalButton: Locator;
  readonly sharpButton: Locator;
  readonly flatButton: Locator;

  // モードボタン
  readonly restModeButton: Locator;
  readonly dottedButton: Locator;

  // ピアノキーボード
  readonly pianoKeyboard: Locator;

  // スコア表示
  readonly scoreRenderer: Locator;

  constructor(page: Page) {
    this.page = page;

    // ツールバー
    this.titleInput = page.locator('input[type="text"]').first();
    this.tempoInput = page.locator('input[type="number"]').first();
    this.playButton = page.locator('button:has-text("▶"), button:has-text("⏹")');
    this.saveButton = page.locator('button[title="保存"]');
    this.loadButton = page.locator('button[title="開く"]');
    this.exportPDFButton = page.locator('button[title="PDF出力"]');
    this.exportXMLButton = page.locator('button[title="MusicXML出力"]');
    this.undoButton = page.locator('button[title*="元に戻す"]');
    this.redoButton = page.locator('button[title*="やり直し"]');

    // 音価ボタン
    this.wholeNoteButton = page.locator('button[title="全音符"]');
    this.halfNoteButton = page.locator('button[title="2分音符"]');
    this.quarterNoteButton = page.locator('button[title="4分音符"]');
    this.eighthNoteButton = page.locator('button[title="8分音符"]');
    this.sixteenthNoteButton = page.locator('button[title="16分音符"]');

    // 臨時記号
    this.naturalButton = page.locator('button:has-text("♮")');
    this.sharpButton = page.locator('button:has-text("♯")');
    this.flatButton = page.locator('button:has-text("♭")');

    // モード
    this.restModeButton = page.locator('button[title="休符モード"]');
    this.dottedButton = page.locator('button[title="付点"]');

    // ピアノキーボード（C3キーを含む要素の親コンテナ）
    this.pianoKeyboard = page.locator('button:has-text("C3")').locator('..');

    // スコア表示
    this.scoreRenderer = page.locator('svg').first();
  }

  /**
   * ページに移動
   */
  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * タイトルを設定
   */
  async setTitle(title: string) {
    await this.titleInput.clear();
    await this.titleInput.fill(title);
  }

  /**
   * タイトルを取得
   */
  async getTitle(): Promise<string> {
    return await this.titleInput.inputValue();
  }

  /**
   * テンポを設定
   */
  async setTempo(tempo: number) {
    await this.tempoInput.clear();
    await this.tempoInput.fill(tempo.toString());
  }

  /**
   * テンポを取得
   */
  async getTempo(): Promise<number> {
    const value = await this.tempoInput.inputValue();
    return parseInt(value, 10);
  }

  /**
   * 音価を選択
   */
  async selectDuration(duration: 'whole' | 'half' | 'quarter' | 'eighth' | 'sixteenth') {
    const buttons = {
      whole: this.wholeNoteButton,
      half: this.halfNoteButton,
      quarter: this.quarterNoteButton,
      eighth: this.eighthNoteButton,
      sixteenth: this.sixteenthNoteButton,
    };
    await buttons[duration].click();
  }

  /**
   * 臨時記号を選択
   */
  async selectAccidental(accidental: 'natural' | 'sharp' | 'flat') {
    const buttons = {
      natural: this.naturalButton,
      sharp: this.sharpButton,
      flat: this.flatButton,
    };
    await buttons[accidental].click();
  }

  /**
   * 休符モードを切り替え
   */
  async toggleRestMode() {
    await this.restModeButton.click();
  }

  /**
   * 付点モードを切り替え
   */
  async toggleDotted() {
    await this.dottedButton.click();
  }

  /**
   * ピアノキーを押す
   */
  async pressKey(note: string, octave: number) {
    const keyLabel = `${note.toUpperCase()}${octave}`;
    await this.page.locator(`button:has-text("${keyLabel}")`).click();
  }

  /**
   * 再生/停止ボタンをクリック
   */
  async togglePlay() {
    await this.playButton.click();
  }

  /**
   * 保存ボタンをクリック
   */
  async save() {
    await this.saveButton.click();
  }

  /**
   * 元に戻す
   */
  async undo() {
    await this.undoButton.click();
  }

  /**
   * やり直し
   */
  async redo() {
    await this.redoButton.click();
  }

  /**
   * スコアが表示されているか確認
   */
  async isScoreVisible(): Promise<boolean> {
    return await this.scoreRenderer.isVisible();
  }

  /**
   * ピアノキーボードが表示されているか確認
   */
  async isPianoKeyboardVisible(): Promise<boolean> {
    return await this.pianoKeyboard.isVisible();
  }

  /**
   * 音価ボタンがアクティブかどうか確認
   */
  async isDurationActive(duration: 'whole' | 'half' | 'quarter' | 'eighth' | 'sixteenth'): Promise<boolean> {
    const buttons = {
      whole: this.wholeNoteButton,
      half: this.halfNoteButton,
      quarter: this.quarterNoteButton,
      eighth: this.eighthNoteButton,
      sixteenth: this.sixteenthNoteButton,
    };
    const className = await buttons[duration].getAttribute('class');
    return className?.includes('active') ?? false;
  }

  /**
   * 休符モードがアクティブかどうか確認
   */
  async isRestModeActive(): Promise<boolean> {
    const className = await this.restModeButton.getAttribute('class');
    return className?.includes('active') ?? false;
  }

  /**
   * 付点モードがアクティブかどうか確認
   */
  async isDottedActive(): Promise<boolean> {
    const className = await this.dottedButton.getAttribute('class');
    return className?.includes('active') ?? false;
  }
}
