# Implementation Plan: テスト基盤導入

**Branch**: `001-test-infrastructure` | **Date**: 2025-12-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-test-infrastructure/spec.md`

## Summary

Clefnote楽譜作成アプリにテスト基盤を導入する。Vitestでユニット/コンポーネントテスト、Playwrightでe2Eテストを実行できるようにする。純粋関数、Reducer、コンポーネントの動作を自動テストで担保し、今後の開発での回帰を防ぐ。

## Technical Context

**Language/Version**: TypeScript 5.8, React 19, Vite 7
**Primary Dependencies**: Vitest, @testing-library/react, Playwright
**Storage**: N/A
**Testing**: Vitest (unit/component), Playwright (E2E)
**Target Platform**: macOS/Windows/Linux (Tauri desktop app)
**Project Type**: Single project (Tauri + React)
**Performance Goals**: ユニットテスト30秒以内、E2E 2分以内
**Constraints**: VexFlow/Tone.jsのモックが必要
**Scale/Scope**: 8テストファイル（unit 4, component 3, integration 1） + E2E 3ファイル

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Constitution未設定のため、一般的なベストプラクティスに従う
- テストファーストの原則に従い、テスト可能な設計を維持

## Project Structure

### Documentation (this feature)

```text
specs/001-test-infrastructure/
├── spec.md              # 仕様書
├── plan.md              # 本ファイル
├── research.md          # 技術調査結果
├── tasks.md             # タスクリスト（/speckit.tasksで生成）
└── checklists/
    └── requirements.md  # 品質チェックリスト
```

### Source Code (repository root)

```text
src/
├── __tests__/                    # テストディレクトリ
│   ├── setup.ts                  # グローバルセットアップ
│   ├── utils/
│   │   └── test-utils.tsx        # カスタムrender関数
│   ├── unit/                     # ユニットテスト
│   │   ├── music.test.ts         # types/music.ts
│   │   ├── scoreReducer.test.ts  # ScoreContext reducer
│   │   ├── audioUtils.test.ts    # useAudioPlayer ユーティリティ
│   │   └── fileOperations.test.ts # fileOperations.ts
│   ├── components/               # コンポーネントテスト
│   │   ├── PianoKeyboard.test.tsx
│   │   ├── Toolbar.test.tsx
│   │   └── ScoreRenderer.test.tsx
│   └── integration/
│       └── ScoreEditor.test.tsx  # App統合テスト
├── utils/
│   ├── audioUtils.ts             # 新規: keyToNote等を抽出
│   └── vexflowUtils.ts           # 新規: getVexDuration等を抽出
└── ...existing files...

e2e/                              # E2Eテスト
├── playwright.config.ts
├── pages/                        # Page Objects
│   ├── ScoreEditorPage.ts
│   ├── ToolbarComponent.ts
│   └── PianoKeyboardComponent.ts
└── tests/
    ├── basic-flow.spec.ts
    ├── note-entry.spec.ts
    └── export.spec.ts
```

**Structure Decision**: 既存のsrc/ディレクトリ内に__tests__ディレクトリを作成。E2Eはプロジェクトルートのe2e/に配置。

## Dependencies to Add

### devDependencies

```json
{
  "vitest": "^3.0.0",
  "@testing-library/react": "^16.0.0",
  "@testing-library/jest-dom": "^6.6.0",
  "@testing-library/user-event": "^14.5.0",
  "jsdom": "^25.0.0",
  "@vitest/coverage-v8": "^3.0.0",
  "@playwright/test": "^1.49.0"
}
```

### npm scripts to Add

```json
{
  "test": "vitest",
  "test:run": "vitest run",
  "test:coverage": "vitest run --coverage",
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui"
}
```

## Configuration Files

### vitest.config.ts

Vite設定を拡張してVitest設定を追加。jsdom環境、setup.tsの読み込み、カバレッジ設定を含む。

### e2e/playwright.config.ts

- baseURL: http://localhost:1420
- webServer: npm run devを自動起動
- Chromiumのみでテスト

## Mocking Strategy

### VexFlow Mock

VexFlowはキャンバス/SVG描画ライブラリのため、レンダリング自体はモック。Renderer, Stave, StaveNote, Voice, Formatterをモック関数で置き換え。

### Tone.js Mock

Tone.jsは音声出力ライブラリのため、モック。PolySynth, start, getContext, nowをモック関数で置き換え。

### crypto.randomUUID Mock

テストで一貫したIDを生成するため、モック。

## Refactoring Required

### 1. audioUtils.ts の作成

`src/hooks/useAudioPlayer.ts` から以下を抽出:
- `keyToNote(key: string): string`
- `DURATION_TO_SECONDS` 定数

### 2. vexflowUtils.ts の作成

`src/components/ScoreRenderer.tsx` から以下を抽出:
- `getVexDuration(duration: string, dotted?: boolean): string`

### 3. fileOperations.ts の修正

`generateMusicXML` 関数をエクスポート（現在は内部関数）

## Test Coverage Targets

| モジュール | 対象関数 | カバレッジ目標 |
|-----------|---------|--------------|
| types/music.ts | isRest, createEmptyScore | 100% |
| context/ScoreContext.tsx | scoreReducer (17 actions) | 100% |
| utils/audioUtils.ts | keyToNote, DURATION_TO_SECONDS | 100% |
| utils/fileOperations.ts | generateMusicXML | 80% |
| components/*.tsx | イベントハンドリング | 70% |

## テストコーディング規約

### 1. テストケース名は日本語で仕様を表す

テストケース名（`it` / `test` の第一引数）は日本語で記述し、テスト対象の仕様・振る舞いを明確に表現する。

```typescript
// Good
describe('isRest', () => {
  it('Restオブジェクトの場合はtrueを返す', () => { ... });
  it('Noteオブジェクトの場合はfalseを返す', () => { ... });
});

// Bad
describe('isRest', () => {
  it('should return true for Rest', () => { ... });
});
```

### 2. AAAパターンのコメントを記述する

各テストケースには「準備（Arrange）」「実行（Act）」「検証（Assert）」のコメントを記述し、テストの構造を明確にする。

```typescript
it('Restオブジェクトの場合はtrueを返す', () => {
  // 準備
  const rest: Rest = { id: '1', duration: 'q', isRest: true };

  // 実行
  const result = isRest(rest);

  // 検証
  expect(result).toBe(true);
});
```

### 3. E2EテストはPage Object Modelを使用する

E2Eテストでは、ページ操作をPage Objectとして抽象化し、テストコードの可読性と保守性を向上させる。

```text
e2e/
├── pages/                        # Page Objects
│   ├── ScoreEditorPage.ts        # 楽譜エディタページ
│   ├── ToolbarComponent.ts       # ツールバーコンポーネント
│   └── PianoKeyboardComponent.ts # ピアノキーボードコンポーネント
├── playwright.config.ts
└── tests/
    └── *.spec.ts                 # Page Objectsを使用したテスト
```

```typescript
// e2e/pages/ScoreEditorPage.ts
export class ScoreEditorPage {
  constructor(private page: Page) {}

  async selectMeasure(index: number) { ... }
  async pressKey(note: string) { ... }
  async play() { ... }
  async stop() { ... }
}

// e2e/tests/basic-flow.spec.ts
test('音符を入力して再生できる', async ({ page }) => {
  // 準備
  const editor = new ScoreEditorPage(page);
  await editor.goto();

  // 実行
  await editor.selectMeasure(0);
  await editor.pressKey('C4');
  await editor.play();

  // 検証
  await expect(editor.isPlaying()).toBe(true);
});
```

## Complexity Tracking

該当なし（シンプルなテスト基盤導入のため）
