# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## 概要

「タスクボード」は、未着手・進行中・完了の3列でタスクを管理する看板ボードです。Next.js 16（App Router）、React 19、TypeScript、Tailwind CSS v4 で作られており、画面は 1 ページだけです。UI の文言は日本語です。

## コマンド

```bash
npm run dev          # 開発サーバー（Turbopack が既定。フラグは不要）
npm run build        # 本番ビルド（Turbopack）
npm run lint         # ESLint
npx tsc --noEmit     # 型チェック（専用の script はない）
npm test             # Vitest を 1 回実行
npm run test:watch   # Vitest の watch モード

npx vitest run src/lib/taskReducer.test.ts   # 1 ファイルだけ実行
npx vitest run -t "テスト名の一部"            # テスト名で絞り込み
```

- npm 11.4.2 では `npm install` が `Cannot read properties of null (reading 'edgesOut')` で失敗することがある。その場合は `npx --yes npm@latest install ...` を使う。
- 開発サーバーに LAN の IP アドレスでアクセスする場合、その IP を `next.config.ts` の `allowedDevOrigins` に入れる必要がある。入っていないと開発用リソースがブロックされてハイドレーションされず、ボタンが一切反応しない。

## アーキテクチャ

状態はメモリ上だけにあり、永続化はしていない（リロードで消える）。データは次の一方向に流れる。

```
src/types/task.ts          Task / TaskStatus と COLUMNS（列の定義と日本語名）
src/lib/taskReducer.ts     純粋な reducer（add / move）と tasksByStatus
src/hooks/useTaskBoard.ts  useReducer を包み、addTask / moveTask を返す
src/components/TaskBoard   唯一の "use client" 境界。状態を持ち、列へ props で渡す
  ├ BoardHeader            件数表示と「新規タスク」ボタン
  ├ BoardColumn × 3        ドロップ先。TaskForm と TaskCard を描画
  └ AddColumnPlaceholder   「カラムを追加」の枠（表示のみ）
```

- **列の追加・変更は `COLUMNS` から**: `TaskBoard` は `COLUMNS` を回して列を描画する。内部の status は `todo` / `inProgress` / `done` で、表示名だけが日本語。
- **reducer の挙動**: `add` はタイトルを trim し、空なら何もしない。`move` は対象を取り除いて移動先の列の末尾に追加する。id が無い場合や同じ列への移動では、同じ state 参照を返す。
- **追加フォームは同時に 1 つだけ**: どの列でフォームを開いているかは `TaskBoard` の `addingTo` が持つ。`TaskForm` 自身は入力をクリアせず、親が閉じる。
- **ドラッグ&ドロップ**: ライブラリを使わず、ネイティブの HTML5 DnD で実装している。`TaskCard` が `dataTransfer` にタスク id を入れ、`BoardColumn` が drop で読み出す。キーは `src/components/dragData.ts` の `TASK_DRAG_TYPE`。タッチ操作とキーボード操作でのドラッグには対応していない。
- **ID の生成**: `src/lib/createTaskId.ts` を使う。`crypto.randomUUID` は http の LAN IP のような非セキュアコンテキストでは使えないため、フォールバックを持っている。直接 `crypto.randomUUID` を呼ばない。
- **表示のみの要素**: `AddColumnPlaceholder` と、列ヘッダーの「…」アイコンは、デザイン上の表示だけで、意図的に動作を実装していない。

## スタイル

- デザインの元画像は `assets/board.png`。
- 色は `src/app/globals.css` の CSS 変数で定義し、`@theme inline` で Tailwind のトークン（`bg-column`、`bg-card`、`text-muted`、`text-subtle`、`border-line` など）にしている。色を直接書かず、このトークンを使う。ダークモードは `prefers-color-scheme` で同じ変数を上書きしている。
- Tailwind は v4 で、`tailwind.config` は無い。

## テスト

- Vitest + jsdom + Testing Library。テストは対象ファイルの隣に `*.test.ts(x)` として置く（`src/**/*.test.{ts,tsx}` だけが対象）。
- `@/` のパスエイリアスは `vitest.config.mts` の `resolve.tsconfigPaths: true` で解決している（`vite-tsconfig-paths` は不要）。
- jsdom には `DataTransfer` と `DragEvent` が無い。ドラッグのテストでは `src/test/dataTransfer.ts` の `createDataTransfer` を使う。`relatedTarget` が必要な場合は、`createEvent.dragLeave` で作ったイベントに `Object.defineProperty` で設定する（`BoardColumn.test.tsx` に例がある）。
