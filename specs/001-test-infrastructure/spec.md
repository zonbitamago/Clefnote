# Feature Specification: テスト基盤導入

**Feature Branch**: `001-test-infrastructure`
**Created**: 2025-12-08
**Status**: Draft
**Input**: テスト導入: Vitest + Playwright を使用してユニットテスト、コンポーネントテスト、E2Eテストを導入する

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 開発者がユニットテストを実行する (Priority: P1)

開発者として、コードを変更した後にユニットテストを実行して、既存機能が壊れていないことを確認したい。

**Why this priority**: ユニットテストは最も基本的なテストであり、純粋関数やReducerロジックの正確性を保証する。これがないと、リファクタリングやバグ修正時に意図しない回帰を引き起こすリスクがある。

**Independent Test**: `npm test` コマンドを実行し、すべてのユニットテストがパスすることを確認できる。

**Acceptance Scenarios**:

1. **Given** テストファイルが存在する状態で、**When** `npm test` を実行する、**Then** すべてのテストが実行され結果が表示される
2. **Given** 型定義ファイル(music.ts)に対するテストがある状態で、**When** `isRest()` 関数をテストする、**Then** Note と Rest を正しく判定できることが確認される
3. **Given** Reducerに対するテストがある状態で、**When** 各アクションをディスパッチする、**Then** 状態が期待通りに変化することが確認される

---

### User Story 2 - 開発者がコンポーネントテストを実行する (Priority: P2)

開発者として、Reactコンポーネントのテストを実行して、UIコンポーネントが正しく動作することを確認したい。

**Why this priority**: コンポーネントテストは、ユーザーインタラクション（クリック、入力など）が正しく処理されることを保証する。ユニットテストの次に重要。

**Independent Test**: コンポーネントテストを実行し、ボタンクリックやイベントハンドリングが正しく動作することを確認できる。

**Acceptance Scenarios**:

1. **Given** PianoKeyboardコンポーネントのテストがある状態で、**When** ピアノキーをクリックする、**Then** 正しいキー形式（'c/4'等）でコールバックが呼ばれる
2. **Given** Toolbarコンポーネントのテストがある状態で、**When** 音価ボタンをクリックする、**Then** SET_DURATIONアクションがディスパッチされる

---

### User Story 3 - 開発者がE2Eテストを実行する (Priority: P3)

開発者として、E2Eテストを実行して、アプリケーション全体のワークフローが正しく動作することを確認したい。

**Why this priority**: E2Eテストは最もユーザーに近いテストであり、実際の操作フローを検証する。ユニット・コンポーネントテストより実装コストが高いが、統合的な品質保証に重要。

**Independent Test**: `npm run test:e2e` コマンドを実行し、ブラウザでの操作テストが完了することを確認できる。

**Acceptance Scenarios**:

1. **Given** アプリが起動している状態で、**When** E2Eテストを実行する、**Then** 初期画面が正しく表示されることが確認される
2. **Given** 楽譜エディタが表示されている状態で、**When** 小節を選択してピアノキーを押す、**Then** 音符が追加されることが確認される
3. **Given** 音符が入力されている状態で、**When** スペースキーを押す、**Then** 再生が開始されることが確認される

---

### User Story 4 - 開発者がテストカバレッジを確認する (Priority: P4)

開発者として、テストカバレッジレポートを確認して、テストが不足している箇所を特定したい。

**Why this priority**: カバレッジレポートは、テストの網羅性を可視化し、今後のテスト追加の優先度付けに役立つ。

**Independent Test**: `npm run test:coverage` を実行し、カバレッジレポートが生成されることを確認できる。

**Acceptance Scenarios**:

1. **Given** テストが存在する状態で、**When** カバレッジコマンドを実行する、**Then** カバレッジレポートが生成される

---

### Edge Cases

- テスト実行中にVexFlowやTone.jsの外部ライブラリが正しくモックされること
- 非同期処理（setTimeout、Promise）を含むテストが正しくタイミングを処理すること
- CI環境でヘッドレスブラウザが正しく動作すること

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 開発者は `npm test` コマンドでユニットテストを実行できなければならない
- **FR-002**: 開発者は `npm run test:e2e` コマンドでE2Eテストを実行できなければならない
- **FR-003**: 開発者は `npm run test:coverage` コマンドでカバレッジレポートを生成できなければならない
- **FR-004**: テストはVexFlowとTone.jsをモックして、外部依存なしに実行できなければならない
- **FR-005**: E2Eテストは開発サーバー（localhost:1420）に対して実行できなければならない
- **FR-006**: すべてのテストはTypeScriptで記述できなければならない
- **FR-007**: テストは既存のVite設定と統合されなければならない

### Key Entities

- **TestSuite**: ユニットテスト、コンポーネントテスト、E2Eテストの3つのカテゴリ
- **TestFile**: 各テスト対象モジュールに対応するテストファイル（*.test.ts, *.test.tsx, *.spec.ts）
- **MockModule**: VexFlow、Tone.js、crypto.randomUUID のモック

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `npm test` コマンドが正常に完了し、すべてのユニットテストがパスする
- **SC-002**: `npm run test:e2e` コマンドが正常に完了し、基本操作フローのテストがパスする
- **SC-003**: テストカバレッジが主要な純粋関数（isRest, createEmptyScore, keyToNote等）で100%に達する
- **SC-004**: Reducer の全17アクションに対してテストが存在する
- **SC-005**: テスト実行時間が、ユニットテスト全体で30秒以内、E2Eテスト全体で2分以内である

## Assumptions

- Vitestを使用する（CLAUDE.mdでの推奨）
- PlaywrightをE2Eテストに使用する
- React Testing Libraryをコンポーネントテストに使用する
- 開発サーバーはlocalhost:1420で動作する（Tauri設定）
