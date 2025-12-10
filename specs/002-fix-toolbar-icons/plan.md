# Implementation Plan: ツールバーアイコンのフォント問題修正

**Branch**: `002-fix-toolbar-icons` | **Date**: 2025-12-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-fix-toolbar-icons/spec.md`

## Summary

ツールバーの音価ボタンと休符モードボタンで使用されているUnicode Musical Symbols（U+1D100–U+1D1FF）が標準フォントでサポートされていないため「豆腐」として表示される問題を、SVGアイコンコンポーネントに置き換えることで修正する。

## Technical Context

**Language/Version**: TypeScript 5.8, React 19, Vite 7
**Primary Dependencies**: React（SVGコンポーネント）
**Storage**: N/A
**Testing**: Vitest（ユニット/コンポーネントテスト）, Playwright（E2E）
**Target Platform**: macOS, Windows, Linux（Tauri 2.x）
**Project Type**: Single project（Tauri + React）
**Performance Goals**: N/A（UIコンポーネントのみ）
**Constraints**: SVGアイコンは36x36pxボタンに収まること
**Scale/Scope**: 6つのSVGアイコン、1ファイル修正

## Constitution Check

*GATE: 既存のプロジェクト構造に従う*

- 新規ファイルは `src/components/icons/` に配置
- 既存の `Toolbar.tsx` を修正
- 追加の依存関係なし

## Project Structure

### Documentation (this feature)

```text
specs/002-fix-toolbar-icons/
├── spec.md              # 機能仕様
├── plan.md              # このファイル
└── tasks.md             # タスクリスト
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── icons/           # 新規作成
│   │   ├── NoteIcons.tsx    # 音符・休符SVGコンポーネント
│   │   └── index.ts         # エクスポート
│   ├── Toolbar.tsx          # 修正対象
│   └── Toolbar.module.css   # 必要に応じて修正
└── __tests__/
    └── component/
        └── Toolbar.test.tsx # テスト更新（必要に応じて）
```

**Structure Decision**: 既存の `src/components/` 内にアイコン用のサブディレクトリ `icons/` を作成し、再利用可能なSVGコンポーネントを配置する。

## Implementation Details

### SVGアイコン設計

各アイコンは以下の特性を持つReactコンポーネントとして実装：

```tsx
interface IconProps {
  size?: number;      // デフォルト: 20
  className?: string; // カスタムスタイル用
}
```

### アイコン一覧

| コンポーネント | 説明 | SVG要素 |
|--------------|------|--------|
| `WholeNoteIcon` | 全音符 | 白抜き楕円 |
| `HalfNoteIcon` | 2分音符 | 白抜き楕円 + 符幹 |
| `QuarterNoteIcon` | 4分音符 | 黒塗り楕円 + 符幹 |
| `EighthNoteIcon` | 8分音符 | 黒塗り楕円 + 符幹 + 旗1本 |
| `SixteenthNoteIcon` | 16分音符 | 黒塗り楕円 + 符幹 + 旗2本 |
| `RestIcon` | 4分休符 | 休符記号 |

### Toolbar.tsx 変更点

1. `DURATIONS` 配列の `label` 型を `string` から `React.ReactNode` に変更
2. 各 Unicode 文字をSVGアイコンコンポーネントに置き換え
3. 休符モードボタンの `𝄽` を `<RestIcon />` に置き換え

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| なし | - | - |
