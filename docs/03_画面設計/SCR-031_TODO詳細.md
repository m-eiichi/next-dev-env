# SCR-031 TODO 詳細

| 項目 | 内容 |
| ---- | ---- |
| 画面ID | SCR-031 |
| 画面名 | TODO 詳細 |
| ステータス | レビュー待ち |
| 作成者 / 更新日 | / 2026-09-26 |

## 1. 概要

### 1.1 目的

**アプリの機能ではなく、実装の見本**。題材は「TODO」。メモでは見せていない、次のことを実際に動くコードで見られるようにする（役割分担は [03_画面設計/README](./README.md) の「実装の見本」）。

- 1 件の画面（`/todos/[id]`）。ID はビルドのときにわからないので、`params` を読む部品を `<Suspense>` で囲む
- 見つからないときの 404（`notFound()`）
- 状態を持つエンティティの変更（完了にする・元に戻す）と削除。削除したら一覧へ移動する

### 1.2 ルーティング

| 項目 | 内容 |
| ---- | ---- |
| URL パス | `/todos/[id]` |
| 実装ファイル | `src/app/todos/[id]/page.tsx` |
| レイアウト | `src/app/layout.tsx` |
| 動的パラメータ (`params`) | `id`: string。TODO の ID |
| クエリ (`searchParams`) | なし |

- `generateStaticParams` は使わない（TODO はあとから登録されるので、ビルドのときに ID がわからない）。`params` はアクセスのたびに変わるデータとして扱い、`<Suspense>` で囲む

### 1.3 アクセス権限

| 項目 | 内容 |
| ---- | ---- |
| 閲覧できるユーザー | 全員 |
| 権限がない場合 | なし |
| チェックする場所 | なし（認証がまだないため） |

### 1.4 メタデータ

| 項目 | 内容 |
| ---- | ---- |
| title | `TODO の詳細`（TODO のタイトルは入れない。`generateMetadata` で `params` を読むと、メタデータも動的になるため） |
| description | ルートレイアウトの `description` |
| 生成方法 | `metadata` を静的に書く |
| OGP / robots | なし |

## 2. 画面レイアウト

```
+--------------------------------------+
| Header（共通）                         |
+--------------------------------------+
| [A] 見出し（TODO の詳細）                |
| [B] タイトル、状態（未完了 / 完了）、      |
|     作った日時、完了した日時              |
| [C] [完了にする] または [元に戻す]、[削除] |
| [D] 操作のエラー                        |
| [E] TODO 一覧へ戻るリンク                |
+--------------------------------------+
| Footer（共通）                         |
+--------------------------------------+
```

### 2.1 レスポンシブ

| ブレークポイント | レイアウトの違い |
| ---------------- | ---------------- |
| すべて | 1 列 |

## 3. コンポーネント構成

| 記号 | コンポーネント | ファイル | 種別 | 備考 |
| ---- | -------------- | -------- | ---- | ---- |
| - | Page | `src/app/todos/[id]/page.tsx` | Server | [B]〜[D] を `<Suspense>` で囲み、`params.then()` で ID を渡す |
| A, E | （Page に直接書く） | 同上 | Server | |
| B | TodoDetail | `src/app/todos/[id]/_components/todo-detail.tsx` | Server | 取得の関数 `getTodo(id)` を呼ぶ。なければ `notFound()` |
| C, D | TodoActions | `src/app/todos/[id]/_components/todo-actions.tsx` | Client (`'use client'`) | 完了・元に戻す・削除のボタン。`useTransition` で送信中を出す |

### 3.1 バック側のファイル

| 層 | ファイル | 役割 |
| -- | -------- | ---- |
| 入口（読み取り） | `src/server/entry/queries/todo/get-todo.ts` | `'use cache'`・`cacheLife("max")`・`cacheTag("todos")`。見つからなければ `null` |
| 入口（更新） | `src/server/entry/actions/todo/complete-todo.ts`、`reopen-todo.ts`、`delete-todo.ts` | SCR-030 と共用。削除は、呼び出し側で一覧へ移動する |
| アプリケーション層（query） | `src/server/application/query/todo/get-todo.query.ts` | 1 件を DTO で返す（なければ `null`） |

そのほかは SCR-030 と同じ（[SCR-030](./SCR-030_TODO一覧.md) の「3.1」）。

## 4. 表示項目

| No | 項目名 | 記号 | データの出どころ | 表示形式 | 値がないとき | 備考 |
| -- | ------ | ---- | ---------------- | -------- | ------------ | ---- |
| 1 | タイトル | B | `TodoDto.title` | テキスト | - | |
| 2 | 状態 | B | `TodoDto.completed` | 「未完了」/「完了」 | - | |
| 3 | 作った日時 | B | `TodoDto.createdAt` | `YYYY/MM/DD HH:mm`（日本時間） | - | |
| 4 | 完了した日時 | B | `TodoDto.completedAt` | 同上 | 表示しない | |

## 5. 入力項目

なし

## 6. 操作・イベント

| No | きっかけ | 処理内容 | 成功したとき | 失敗したとき |
| -- | -------- | -------- | ------------ | ------------ |
| 1 | 画面を開く | `getTodo(id)` | 詳細を表示 | 見つからなければ 404（`notFound()`） |
| 2 | [完了にする] / [元に戻す] を押す | Server Action `completeTodo(id)` / `reopenTodo(id)` | `updateTag("todos")`。表示が切り替わる | [D] にメッセージ（「すでに完了しています」など） |
| 3 | [削除] を押す | Server Action `deleteTodo(id)` | `updateTag("todos")` の後、SCR-030 へ移動 | [D] にメッセージ |

### 6.1 遷移先

| 遷移先 | きっかけ | 方法 |
| ------ | -------- | ---- |
| SCR-030 TODO 一覧 | 削除に成功 | `router.push("/todos")`（Client Component。Server Action を関数として呼ぶため） |
| SCR-030 TODO 一覧 | [TODO 一覧へ戻る] を押す | `<Link href="/todos">` |

## 7. データ取得・更新

### 7.1 取得

| No | 取得するデータ | 取得元 | 実行する場所 | キャッシュ | 再検証 |
| -- | -------------- | ------ | ------------ | ---------- | ------ |
| 1 | TODO 1 件 | メモリ上の仮のデータ（Query Service） | 取得の関数 `getTodo(id)`（`<Suspense>` の中の Server Component から呼ぶ） | `'use cache'`・`cacheLife("max")`・`cacheTag("todos")`。`id` ごとに別に保存される | 更新の Server Action で `updateTag("todos")` |

### 7.2 更新

SCR-030 の「7.2」の No.2〜4 と同じ Server Action を使う。

## 8. 状態ごとの表示

| 状態 | 表示内容 | 実装 |
| ---- | -------- | ---- |
| 読み込み中 | 「読み込み中…」 | `<Suspense fallback>` |
| 見つからない | 404 画面 | `notFound()`（Next.js の既定の 404 画面） |
| 送信中 | ボタンを押せなくする | `useTransition` の `isPending` |
| 操作の失敗 | [D] にメッセージ | `ActionResult` の `message` |

## 9. 未決事項

| No | 内容 | 担当 | 期限 | 結論 |
| -- | ---- | ---- | ---- | ---- |
| 1 | 本来の画面を作り始めたら、この画面を消すか、見本として残すか | | | |

## 10. 変更履歴

| 日付 | 変更内容 | 変更者 |
| ---- | -------- | ------ |
| 2026-09-26 | 新規作成 | |
