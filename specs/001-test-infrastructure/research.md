# Research: テスト基盤導入

## テストフレームワーク選定

### ユニット/コンポーネントテスト

**Decision**: Vitest + React Testing Library

**Rationale**:
- VitestはViteとネイティブ統合され、設定が最小限
- CLAUDE.mdでVitestが推奨されている
- React Testing Libraryはコンポーネントテストのデファクトスタンダード
- Jest互換APIで学習コストが低い

**Alternatives considered**:
- Jest: Viteとの統合に追加設定が必要
- Testing Library + Jest: 設定が複雑
- Mocha/Chai: React統合が弱い

### E2Eテスト

**Decision**: Playwright

**Rationale**:
- モダンで安定したE2Eフレームワーク
- 複数ブラウザ対応（今回はChromiumのみ使用）
- 開発サーバーとの連携が容易
- TypeScriptサポートが優秀

**Alternatives considered**:
- Cypress: Tauriとの相性が不明
- Puppeteer: E2E特化ではない
- tauri-driver: 設定が複雑、ブラウザテストで十分

## モック戦略

### VexFlow

**Decision**: 全体をモック

**Rationale**:
- キャンバス/SVG描画はjsdom環境で動作しない
- 描画結果の検証よりもロジックの検証が重要
- モックすることでテスト速度が向上

### Tone.js

**Decision**: 全体をモック

**Rationale**:
- Web Audio APIはjsdom環境で動作しない
- 音声出力の検証はE2Eテストで行う
- ユニットテストでは再生ロジックの検証に集中

### crypto.randomUUID

**Decision**: 予測可能なIDを返すモック

**Rationale**:
- テストの再現性を確保
- スナップショットテストでの一貫性

## リファクタリング方針

### 関数の抽出

**Decision**: 純粋関数を別ファイルに抽出

**Rationale**:
- テスト容易性の向上
- 関心の分離
- 再利用性の向上

**対象関数**:
1. `keyToNote()` - useAudioPlayer.ts → audioUtils.ts
2. `getVexDuration()` - ScoreRenderer.tsx → vexflowUtils.ts
3. `generateMusicXML()` - 既存ファイルでエクスポート追加

## ディレクトリ構成

**Decision**: src/__tests__/ + e2e/

**Rationale**:
- ユニット/コンポーネントテストはソースに近い場所に配置
- E2Eテストはプロジェクトルートに分離
- Playwrightの標準的な配置に従う
