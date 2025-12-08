# Tasks: テスト基盤導入

**Input**: Design documents from `/specs/001-test-infrastructure/`
**Prerequisites**: plan.md, spec.md, research.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure) ✅

**Purpose**: テストフレームワークの初期化と基本構造の構築

- [x] T001 Vitest関連の依存関係をインストール (vitest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, jsdom, @vitest/coverage-v8)
- [x] T002 Playwright関連の依存関係をインストール (@playwright/test) およびブラウザをインストール
- [x] T003 package.jsonにテストスクリプトを追加 (test, test:run, test:coverage, test:e2e, test:e2e:ui)
- [x] T004 vitest.config.tsを作成 (jsdom環境、setup.ts読み込み、カバレッジ設定)
- [x] T005 [P] src/__tests__/setup.tsを作成 (jest-dom、VexFlow/Tone.jsモック、crypto.randomUUIDモック)
- [x] T006 [P] src/__tests__/utils/test-utils.tsxを作成 (カスタムrender関数、ScoreProviderラッパー)
- [x] T007 [P] e2e/playwright.config.tsを作成 (baseURL、webServer設定)

**Checkpoint**: ✅ テストフレームワークが動作可能な状態

---

## Phase 2: Foundational (リファクタリング) ✅

**Purpose**: テスト容易性向上のための関数抽出

**⚠️ CRITICAL**: ユニットテストを書く前にこのリファクタリングが必要

- [x] T008 src/utils/audioUtils.tsを作成し、keyToNote関数とDURATION_TO_SECONDS定数を抽出
- [x] T009 src/hooks/useAudioPlayer.tsを修正し、audioUtilsからインポートするように変更
- [x] T010 [P] src/utils/vexflowUtils.tsを作成し、getVexDuration関数を抽出
- [x] T011 [P] src/components/ScoreRenderer.tsxを修正し、vexflowUtilsからインポートするように変更
- [x] T012 src/utils/fileOperations.tsを修正し、generateMusicXML関数をエクスポート

**Checkpoint**: ✅ 純粋関数が独立したモジュールとして利用可能

---

## Phase 3: User Story 1 - ユニットテスト実行 (Priority: P1) 🎯 MVP ✅

**Goal**: `npm test` でユニットテストを実行し、純粋関数とReducerの正確性を確認できる

**Independent Test**: `npm test` を実行し、すべてのユニットテストがパスすることを確認

### Implementation for User Story 1

- [x] T013 [P] [US1] src/__tests__/unit/music.test.tsを作成 - isRest関数のテスト（日本語テストケース名、AAAコメント）
- [x] T014 [P] [US1] src/__tests__/unit/music.test.tsに追加 - createEmptyScore関数のテスト
- [x] T015 [P] [US1] src/__tests__/unit/audioUtils.test.tsを作成 - keyToNote関数のテスト
- [x] T016 [P] [US1] src/__tests__/unit/audioUtils.test.tsに追加 - DURATION_TO_SECONDS定数のテスト
- [x] T017 [P] [US1] src/__tests__/unit/vexflowUtils.test.tsを作成 - getVexDuration関数のテスト
- [x] T018 [US1] src/__tests__/unit/scoreReducer.test.tsを作成 - SET_SCORE, ADD_NOTE, ADD_RESTアクションのテスト
- [x] T019 [US1] src/__tests__/unit/scoreReducer.test.tsに追加 - DELETE_NOTE, SELECT_NOTE, SELECT_MEASUREアクションのテスト
- [x] T020 [US1] src/__tests__/unit/scoreReducer.test.tsに追加 - SET_DURATION, SET_REST_MODE, SET_DOTTED, SET_ACCIDENTALアクションのテスト
- [x] T021 [US1] src/__tests__/unit/scoreReducer.test.tsに追加 - SET_TEMPO, SET_TIME_SIGNATURE, SET_KEY_SIGNATURE, SET_TITLEアクションのテスト
- [x] T022 [US1] src/__tests__/unit/scoreReducer.test.tsに追加 - ADD_MEASURE, UNDO, REDOアクションのテスト
- [x] T023 [P] [US1] src/__tests__/unit/fileOperations.test.tsを作成 - generateMusicXML関数のテスト（基本構造、音符、休符、和音、付点）

**Checkpoint**: ✅ `npm test` で全ユニットテストがパス (103テスト)

---

## Phase 4: User Story 2 - コンポーネントテスト実行 (Priority: P2) ✅

**Goal**: Reactコンポーネントのテストを実行し、UIインタラクションの正確性を確認できる

**Independent Test**: コンポーネントテストを実行し、イベントハンドリングが正しく動作することを確認

### Implementation for User Story 2

- [x] T024 [P] [US2] src/__tests__/component/PianoKeyboard.test.tsxを作成 - キーレンダリングとクリックイベントのテスト (11テスト)
- [x] T025 [P] [US2] src/__tests__/component/Toolbar.test.tsxを作成 - 音価ボタンと再生ボタンのテスト (28テスト)
- [ ] T026 [P] [US2] src/__tests__/component/ScoreRenderer.test.tsxを作成 - VexFlowモックを使用したロジックテスト (スキップ: VexFlow依存が強い)
- [ ] T027 [US2] src/__tests__/integration/ScoreEditor.test.tsxを作成 - キーボードショートカットと音符追加フローのテスト (E2Eでカバー)

**Checkpoint**: ✅ コンポーネントテストがパス (39テスト)

---

## Phase 5: User Story 3 - E2Eテスト実行 (Priority: P3) ✅

**Goal**: `npm run test:e2e` でE2Eテストを実行し、アプリ全体のワークフローを確認できる

**Independent Test**: E2Eテストを実行し、ブラウザでの操作が正しく動作することを確認

### Implementation for User Story 3

- [x] T028 [P] [US3] e2e/pages/ScoreEditorPage.tsを作成 - 統合Page Object（goto, selectDuration, pressKey, isPlaying等）
- [x] T029 [P] [US3] ToolbarComponent - ScoreEditorPage.tsに統合（clickPlay, clickStop, selectDuration等）
- [x] T030 [P] [US3] PianoKeyboardComponent - ScoreEditorPage.tsに統合（pressKey, getKeyElement等）
- [x] T031 [US3] e2e/tests/score-editor.spec.tsを作成 - 初期表示、タイトル変更、テンポ変更のテスト
- [x] T032 [US3] e2e/tests/score-editor.spec.tsに追加 - 音価選択、休符モード、付点モードのテスト
- [x] T033 [US3] e2e/tests/score-editor.spec.tsに追加 - ピアノキーボード、Undo/Redo、キーボードショートカットのテスト

**Checkpoint**: ✅ E2EテストがPage Object Modelで実装完了 (30+テストケース)

---

## Phase 6: User Story 4 - カバレッジ確認 (Priority: P4) ✅

**Goal**: `npm run test:coverage` でカバレッジレポートを生成し、テストの網羅性を確認できる

**Independent Test**: カバレッジレポートが生成され、目標値に達していることを確認

### Implementation for User Story 4

- [x] T034 [US4] vitest.config.tsにカバレッジ設定を追加（provider: v8, reporter, include/exclude）
- [x] T035 [US4] カバレッジレポートを実行し、目標達成を確認
  - types/music.ts: 100% ✅
  - context/ScoreContext.tsx: 97.87% ✅
  - utils/audioUtils.ts: 100% ✅
  - utils/vexflowUtils.ts: 100% ✅
  - components/PianoKeyboard.tsx: 100% ✅
  - components/Toolbar.tsx: 86.66%
- [x] T036 [US4] .gitignoreにcoverageディレクトリを追加

**Checkpoint**: ✅ カバレッジレポートが生成され、主要な純粋関数は100%カバレッジ達成

---

## Phase 7: Polish & Cross-Cutting Concerns ✅

**Purpose**: ドキュメント更新と最終調整

- [x] T036 [US4] .gitignoreにcoverageディレクトリを追加
- [x] T037 [P] CLAUDE.mdのTestingセクションを更新（テストコマンド、コーディング規約を追記）
- [x] T038 [P] README.mdにテスト実行方法を追記
- [x] T039 全テストを実行して最終確認（npm run test:run → 142テストパス）

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **User Story 2 (Phase 4)**: Depends on Setup completion (Phase 1のみ)
- **User Story 3 (Phase 5)**: Depends on Setup completion (Phase 1のみ)
- **User Story 4 (Phase 6)**: Depends on User Story 1 completion
- **Polish (Phase 7)**: Depends on all user stories

### User Story Dependencies

- **User Story 1 (P1)**: Foundational phase必須（関数抽出後にテスト可能）
- **User Story 2 (P2)**: Setup完了後に開始可能（US1と並行可）
- **User Story 3 (P3)**: Setup完了後に開始可能（US1/US2と並行可）
- **User Story 4 (P4)**: US1完了後に開始（テストがないとカバレッジ測定不可）

### Parallel Opportunities

**Phase 1内**:
- T005, T006, T007 は並行実行可能

**Phase 2内**:
- T010, T011 は T008, T009 と並行実行可能

**User Story間**:
- US2 (コンポーネントテスト) と US3 (E2Eテスト) は US1 と並行実行可能
- US1の純粋関数テストとUS2/US3のUI/E2Eテストは独立

---

## Parallel Example: User Story 1

```bash
# 純粋関数テストは並行実行可能:
Task: "src/__tests__/unit/music.test.ts" (T013, T014)
Task: "src/__tests__/unit/audioUtils.test.ts" (T015, T016)
Task: "src/__tests__/unit/vexflowUtils.test.ts" (T017)
Task: "src/__tests__/unit/fileOperations.test.ts" (T023)

# Reducerテストは順次実行（同一ファイル）:
Task: "src/__tests__/unit/scoreReducer.test.ts" (T018 → T019 → T020 → T021 → T022)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (リファクタリング)
3. Complete Phase 3: User Story 1 (ユニットテスト)
4. **STOP and VALIDATE**: `npm test` で全テストがパス
5. デモ可能な状態

### Incremental Delivery

1. Setup + Foundational → テスト基盤完成
2. Add User Story 1 → `npm test` 動作確認 → MVP!
3. Add User Story 2 → コンポーネントテスト追加
4. Add User Story 3 → E2Eテスト追加 → 完全なテスト網羅
5. Add User Story 4 → カバレッジレポート追加

---

## Summary

| Phase | タスク数 | 並行可能 |
|-------|---------|---------|
| Phase 1: Setup | 7 | 3 |
| Phase 2: Foundational | 5 | 2 |
| Phase 3: US1 ユニットテスト | 11 | 6 |
| Phase 4: US2 コンポーネントテスト | 4 | 3 |
| Phase 5: US3 E2Eテスト | 6 | 3 |
| Phase 6: US4 カバレッジ | 3 | 0 |
| Phase 7: Polish | 3 | 2 |
| **Total** | **39** | **19** |

## Notes

- すべてのテストケース名は日本語で仕様を表現
- AAAパターン（準備/実行/検証）のコメントを必須
- E2EテストはPage Object Modelを使用
- Commit after each task or logical group
