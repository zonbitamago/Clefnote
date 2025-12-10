# Tasks: ツールバーアイコンのフォント問題修正

**Input**: Design documents from `/specs/002-fix-toolbar-icons/`
**Prerequisites**: plan.md, spec.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure) ✅

**Purpose**: アイコンコンポーネント用のディレクトリ作成

- [x] T001 src/components/icons/ ディレクトリを作成
- [x] T002 src/components/icons/index.ts を作成（エクスポート用）

**Checkpoint**: ✅ アイコンコンポーネント格納場所の準備完了

---

## Phase 2: User Story 1 - 音符アイコンの正常表示 (Priority: P1) 🎯 MVP ✅

**Goal**: 5種類の音符アイコン（全音符、2分、4分、8分、16分）をSVGで実装

**Independent Test**: アプリを起動し、音価ボタンが音符として表示されることを確認

### Implementation for User Story 1

- [x] T003 [P] [US1] src/components/icons/NoteIcons.tsx に WholeNoteIcon を作成（白抜き楕円）
- [x] T004 [P] [US1] src/components/icons/NoteIcons.tsx に HalfNoteIcon を追加（白抜き楕円 + 符幹）
- [x] T005 [P] [US1] src/components/icons/NoteIcons.tsx に QuarterNoteIcon を追加（黒塗り楕円 + 符幹）
- [x] T006 [P] [US1] src/components/icons/NoteIcons.tsx に EighthNoteIcon を追加（黒塗り楕円 + 符幹 + 旗1本）
- [x] T007 [P] [US1] src/components/icons/NoteIcons.tsx に SixteenthNoteIcon を追加（黒塗り楕円 + 符幹 + 旗2本）
- [x] T008 [US1] src/components/icons/index.ts を更新（音符アイコンをエクスポート）

**Checkpoint**: ✅ 音符アイコンコンポーネントが作成完了

---

## Phase 3: User Story 2 - 休符アイコンの正常表示 (Priority: P1) ✅

**Goal**: 休符アイコンをSVGで実装

**Independent Test**: アプリを起動し、休符モードボタンが休符として表示されることを確認

### Implementation for User Story 2

- [x] T009 [US2] src/components/icons/NoteIcons.tsx に RestIcon を追加（4分休符記号）
- [x] T010 [US2] src/components/icons/index.ts を更新（RestIconをエクスポート）

**Checkpoint**: ✅ 休符アイコンコンポーネントが作成完了

---

## Phase 4: User Story 3 - アイコンのToolbar統合 (Priority: P2) ✅

**Goal**: SVGアイコンをToolbarに統合し、既存のUnicode文字を置き換え

**Independent Test**: アプリを起動し、全てのアイコンが正しく表示され、クリックで選択状態になることを確認

### Implementation for User Story 3

- [x] T011 [US3] src/components/Toolbar.tsx のDURATIONS配列の型を更新（label: React.ReactNode）
- [x] T012 [US3] src/components/Toolbar.tsx の音符Unicode文字をSVGアイコンに置き換え
- [x] T013 [US3] src/components/Toolbar.tsx の休符モードボタンをRestIconに置き換え

**Checkpoint**: ✅ Toolbarのアイコン置き換え完了

---

## Phase 5: Polish & Cross-Cutting Concerns ✅

**Purpose**: スタイル調整、テスト、検証

- [x] T014 [P] src/components/Toolbar.module.css のスタイル調整（不要）
- [x] T015 [P] src/__tests__/component/Toolbar.test.tsx の更新（不要 - 既存テストがパス）
- [x] T016 npm run tauri dev で動作確認
- [x] T017 npm run test:run でユニット/コンポーネントテスト実行（142テストパス）
- [x] T018 npm run test:e2e でE2Eテスト実行（32テストパス）

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **User Story 1 (Phase 2)**: Depends on Setup completion
- **User Story 2 (Phase 3)**: Depends on Setup completion（US1と並行可能）
- **User Story 3 (Phase 4)**: Depends on US1 and US2 completion
- **Polish (Phase 5)**: Depends on US3 completion

### Parallel Opportunities

**Phase 2内**:
- T003, T004, T005, T006, T007 は並行実行可能（同一ファイルだが独立したコンポーネント）

**Phase 2 と Phase 3**:
- US1 と US2 は並行実行可能

**Phase 5内**:
- T014, T015 は並行実行可能

---

## Implementation Strategy

### MVP First (User Story 1 + 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: User Story 1（音符アイコン）
3. Complete Phase 3: User Story 2（休符アイコン）
4. **STOP and VALIDATE**: アイコンコンポーネントの単体確認
5. Complete Phase 4: Toolbar統合
6. Complete Phase 5: 動作確認・テスト

---

## Notes

- [P] tasks = 並行実行可能
- SVGアイコンは currentColor を使用してボタンの色に従う
- アイコンサイズは props で調整可能（デフォルト 20px）
- Commit after each phase
