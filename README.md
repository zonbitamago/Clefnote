# Clefnote

デスクトップ向け楽譜作成アプリケーション

## 概要

Clefnoteは、Tauri + React + TypeScriptで構築されたクロスプラットフォームの楽譜作成アプリです。VexFlowによる美しい楽譜レンダリングと、Tone.jsによるリアルタイム再生機能を備えています。

## 機能

- **楽譜表示・編集**: 五線譜、音部記号、拍子記号、調号のレンダリング
- **音符入力**: ピアノ鍵盤UIによる直感的な入力
- **音価**: 全音符、2分音符、4分音符、8分音符、16分音符
- **臨時記号**: シャープ、フラット、ナチュラル
- **付点音符**: 対応
- **再生**: シンセサイザーによる楽譜の再生
- **ファイル操作**: 保存/読み込み (.clefnote形式)
- **エクスポート**: PDF、MusicXML

## 必要要件

- Node.js 18+
- Rust 1.70+
- macOS / Windows / Linux

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発モードで起動
npm run tauri dev

# プロダクションビルド
npm run tauri build
```

## 使い方

1. アプリを起動すると、空の楽譜が表示されます
2. 小節をクリックして選択します
3. 画面上部のツールバーで音価（音符の長さ）を選択します
4. 画面下部のピアノ鍵盤をクリックして音符を入力します
5. 再生ボタン（▶）で楽譜を再生できます

### キーボードショートカット

| ショートカット | 機能 |
|--------------|------|
| `Ctrl/Cmd + Z` | 元に戻す |
| `Ctrl/Cmd + Y` | やり直し |
| `Ctrl/Cmd + S` | 保存 |
| `Ctrl/Cmd + O` | 開く |
| `Space` | 再生/停止 |
| `Delete/Backspace` | 選択した音符を削除 |

## 技術スタック

- **デスクトップフレームワーク**: [Tauri](https://tauri.app/) 2.x
- **フロントエンド**: React 19 + TypeScript + Vite
- **楽譜レンダリング**: [VexFlow](https://www.vexflow.com/) 5.x
- **オーディオ**: [Tone.js](https://tonejs.github.io/)
- **PDF出力**: [jsPDF](https://github.com/parallax/jsPDF)

## プロジェクト構造

```
src/
├── components/       # Reactコンポーネント
│   ├── ScoreRenderer # 楽譜表示
│   ├── Toolbar       # ツールバー
│   └── PianoKeyboard # ピアノ鍵盤
├── context/          # 状態管理
├── hooks/            # カスタムフック
├── types/            # 型定義
└── utils/            # ユーティリティ

src-tauri/            # Rustバックエンド

src/__tests__/        # テストコード
├── unit/             # ユニットテスト
└── component/        # コンポーネントテスト

e2e/                  # E2Eテスト
├── pages/            # Page Objects
└── tests/            # テストファイル
```

## テスト

### テストの実行

```bash
# ユニット/コンポーネントテスト
npm test                    # watchモード
npm run test:run            # 単発実行
npm run test:coverage       # カバレッジレポート生成

# E2Eテスト
npm run test:e2e            # ヘッドレス実行
npm run test:e2e:ui         # UIモードで実行
```

### テストフレームワーク

- **ユニット/コンポーネントテスト**: Vitest + React Testing Library
- **E2Eテスト**: Playwright

## ライセンス

MIT
