# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Clefnote is a desktop music notation (sheet music) application built with Tauri + React + TypeScript. It uses VexFlow for music rendering and Tone.js for audio playback.

## Commands

```bash
# Install dependencies
npm install

# Development (launches Tauri dev window)
npm run tauri dev

# Build for production
npm run build              # Frontend only
npm run tauri build        # Full desktop app

# Type checking
npx tsc --noEmit
```

## Architecture

### Tech Stack
- **Desktop Framework**: Tauri 2.x (Rust backend + WebView frontend)
- **Frontend**: React 19 + TypeScript + Vite
- **Music Notation**: VexFlow 5.x
- **Audio**: Tone.js
- **Export**: jsPDF (PDF), custom MusicXML generator

### Directory Structure
```
src/
├── components/          # React components
│   ├── ScoreRenderer    # VexFlow-based music notation display
│   ├── Toolbar          # Note input controls, playback, export
│   └── PianoKeyboard    # Virtual piano for note entry
├── context/
│   └── ScoreContext     # Global state management (useReducer)
├── hooks/
│   └── useAudioPlayer   # Tone.js playback logic
├── types/
│   └── music.ts         # TypeScript types for Score, Note, Measure
└── utils/
    └── fileOperations   # Save/load, PDF/MusicXML export

src-tauri/               # Rust backend (Tauri)
```

### Data Model

The score is structured hierarchically:
- `Score` → contains metadata (title, tempo, time signature, key) and `Staff[]`
- `Staff` → contains `Measure[]` and clef type
- `Measure` → contains `NoteOrRest[]`
- `Note` → contains keys (pitch), duration, accidentals, dotted flag
- `Rest` → contains duration and isRest flag

### State Management

Uses React Context + useReducer pattern in `ScoreContext.tsx`:
- Score state with undo/redo history
- Editor state (selected note, duration, accidentals, rest mode)
- Actions: ADD_NOTE, DELETE_NOTE, UNDO, REDO, SET_TEMPO, etc.

### Key Conventions

- VexFlow uses pitch format `"c/4"` (note/octave)
- Tone.js uses pitch format `"C4"` (NoteOctave)
- Duration values: `'w'` (whole), `'h'` (half), `'q'` (quarter), `'8'`, `'16'`
- File format: `.clefnote` (JSON)

### Keyboard Shortcuts
- `Ctrl+Z` / `Cmd+Z`: Undo
- `Ctrl+Y` / `Cmd+Y`: Redo
- `Ctrl+S` / `Cmd+S`: Save
- `Ctrl+O` / `Cmd+O`: Open
- `Space`: Play/Stop
- `Delete/Backspace`: Delete selected note

## Development Notes

### First-time Setup
Initial `npm run tauri dev` takes several minutes to compile Rust dependencies. Subsequent runs are much faster.

### Adding New Features

**New note types or modifiers:**
1. Update types in `src/types/music.ts`
2. Add reducer action in `src/context/ScoreContext.tsx`
3. Update VexFlow rendering in `src/components/ScoreRenderer.tsx`
4. Add UI controls in `src/components/Toolbar.tsx`

**Export formats:**
Add export functions in `src/utils/fileOperations.ts`

### Testing

テストフレームワーク:
- **Unit/Component tests**: Vitest + React Testing Library
- **E2E tests**: Playwright

```bash
# Unit/Component tests
npm test                    # watch mode
npm run test:run            # single run
npm run test:coverage       # coverage report

# E2E tests
npm run test:e2e            # headless
npm run test:e2e:ui         # UI mode
```

テストコーディング規約:
- テストケース名は日本語で仕様を表す
- AAAパターン（準備/実行/検証）のコメントを記述
- E2Eテストは Page Object Model を使用

ディレクトリ構成:
```
src/__tests__/
├── setup.ts                # テストセットアップ（モック含む）
├── utils/test-utils.tsx    # カスタムrender関数
├── unit/                   # 純粋関数のテスト
└── component/              # コンポーネントテスト

e2e/
├── playwright.config.ts
├── pages/                  # Page Objects
└── tests/                  # E2Eテスト
```
