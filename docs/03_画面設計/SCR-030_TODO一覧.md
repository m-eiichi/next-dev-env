# SCR-030 TODO 一覧

| 項目 | 内容 |
| ---- | ---- |
| 画面ID | SCR-030 |
| 画面名 | TODO 一覧 |
| ステータス | レビュー待ち |
| 作成者 / 更新日 | / 2026-09-26 |

## 1. 概要

### 1.1 目的

**アプリの機能ではなく、実装の見本**。題材は「TODO」（タイトルと、完了・未完了の状態）。メモ（SCR-010〜012）では見せていない、次のことを実際に動くコードで見られるようにする（役割分担は [03_画面設計/README](./README.md) の「実装の見本」）。

- URL のクエリ（`?status=`）での絞り込み。Cache Components では、`searchParams` を読む部品を `<Suspense>` で囲む
- 一覧の行ごとの操作（完了にする・元に戻す・削除）
- 画面の即時反映（`useOptimistic`）。サーバーの結果を待たずにチェックを切り替え、失敗したら元に戻す

### 1.2 ルーティング

| 項目 | 内容 |
| ---- | ---- |
| URL パス | `/todos` |
| 実装ファイル | `src/app/todos/page.tsx` |
| レイアウト | `src/app/layout.tsx` |
| 動的パラメータ (`params`) | なし |
| クエリ (`searchParams`) | `status`: `open`（未完了）/ `completed`（完了）。なし・それ以外の値ならすべて |

### 1.3 アクセス権限

| 項目 | 内容 |
| ---- | ---- |
| 閲覧できるユーザー | 全員 |
| 権限がない場合 | なし |
| チェックする場所 | なし（認証がまだないため、クエリ・ユースケースでも認証チェックをしない。しない理由をコメントで書く） |

### 1.4 メタデータ

| 項目 | 内容 |
| ---- | ---- |
| title | `TODO 一覧` |
| description | ルートレイアウトの `description` |
| 生成方法 | `metadata` を静的に書く |
| OGP / robots | なし |

## 2. 画面レイアウト

```
+--------------------------------------+
| Header（共通）                         |
+--------------------------------------+
| [A] 見出しと説明文                      |
| [B] 追加フォーム（タイトル ＋ [追加]）     |
| [C] 絞り込み（すべて / 未完了 / 完了）     |
| [D] TODO の一覧                        |
|     [✓] タイトル（詳細へのリンク） [削除]  |
| [E] トップへ戻るリンク                   |
+--------------------------------------+
| Footer（共通）                         |
+--------------------------------------+
```

### 2.1 レスポンシブ

| ブレークポイント | レイアウトの違い |
| ---------------- | ---------------- |
| すべて | 一覧は 1 列。行の中は、チェック・タイトル・削除ボタンを横に並べ、タイトルが長ければ折り返す |

## 3. コンポーネント構成

| 記号 | コンポーネント | ファイル | 種別 | 備考 |
| ---- | -------------- | -------- | ---- | ---- |
| - | Page | `src/app/todos/page.tsx` | Server | [C][D] を `<Suspense>` で囲み、`searchParams` を渡す |
| A, E | （Page に直接書く） | 同上 | Server | |
| B | TodoAddForm | `src/app/todos/_components/todo-add-form.tsx` | Client (`'use client'`) | `useActionState`。追加に成功したら入力欄を空にする |
| C, D | TodoListSection | `src/app/todos/_components/todo-list-section.tsx` | Server | `searchParams` を読み、取得の関数 `listTodos(status)` を呼ぶ |
| D の行 | TodoItem | `src/app/todos/_components/todo-item.tsx` | Client (`'use client'`) | チェックと削除。`useOptimistic` で即時反映。SCR-031 からも使わないので、この画面の `_components/` に置く |

### 3.1 バック側のファイル

| 層 | ファイル | 役割 |
| -- | -------- | ---- |
| 入口（読み取り） | `src/server/entry/queries/todo/list-todos.ts` | `'use cache'`・`cacheLife("max")`・`cacheTag("todos")`。`status` は引数なので、キャッシュのキーに入る |
| 入口（更新） | `src/server/entry/actions/todo/create-todo.ts`、`complete-todo.ts`、`reopen-todo.ts`、`delete-todo.ts` | Server Action。成功したら `updateTag("todos")` |
| アプリケーション層（query） | `src/server/application/query/todo/list-todos.query.ts`、`todo-query-service.ts` | 状態で絞り込んだ一覧を DTO で返す |
| アプリケーション層（command） | `src/server/application/command/todo/create-todo.usecase.ts`、`complete-todo.usecase.ts`、`reopen-todo.usecase.ts`、`delete-todo.usecase.ts` | 取り出す → エンティティのメソッド → 保存 |
| ドメイン層 | `src/server/domain/todo/entity.ts`、`value-objects/todo-title.ts`、`repository.ts`、`errors.ts` | 「5.1」の業務のルール |
| インフラストラクチャ層 | `src/server/infrastructure/in-memory/todo/` | 仮のデータ置き場、Query Service、リポジトリ |

## 4. 表示項目

| No | 項目名 | 記号 | データの出どころ | 表示形式 | 値がないとき | 備考 |
| -- | ------ | ---- | ---------------- | -------- | ------------ | ---- |
| 1 | タイトル | D | `TodoDto.title` | テキスト（SCR-031 へのリンク） | - | 完了したものは取り消し線 |
| 2 | 完了・未完了 | D | `TodoDto.completed` | チェックボックス | - | |
| 3 | 選んでいる絞り込み | C | `searchParams.status` | 選んでいるものを強調（`aria-current`） | 「すべて」 | |

## 5. 入力項目

| No | 項目名 | name 属性 | 種類 | 必須 | 初期値 | バリデーション | エラーメッセージ |
| -- | ------ | --------- | ---- | ---- | ------ | -------------- | ---------------- |
| 1 | タイトル | `title` | text | 必須 | 空 | 前後の空白を除いて 1〜100 文字 | タイトルを入力してください / タイトルは 100 文字以内で入力してください |

### 5.1 業務のルール（ドメイン層）

| ルール | 守る場所 | 違反したとき |
| ------ | -------- | ------------ |
| タイトルは前後の空白を除いて 1〜100 文字 | 値オブジェクト `TodoTitle` | `DomainError` |
| 完了にできるのは、未完了のものだけ | エンティティ `Todo.complete()` | `DomainError`「すでに完了しています」 |
| 元に戻せるのは、完了したものだけ | エンティティ `Todo.reopen()` | `DomainError`「まだ完了していません」 |
| 操作する TODO が存在すること | ユースケース（リポジトリの `findById()` で確かめる） | `TodoNotFoundError`（`DomainError` を継承）「TODO が見つかりません」 |

## 6. 操作・イベント

| No | きっかけ | 処理内容 | 成功したとき | 失敗したとき |
| -- | -------- | -------- | ------------ | ------------ |
| 1 | 画面を開く | `listTodos(status)` | 一覧を表示 | Next.js の既定のエラー画面 |
| 2 | [追加] を押す | Server Action `createTodo` | `updateTag("todos")`。入力欄を空にし、一覧に出る | 入力欄の下にエラー |
| 3 | 絞り込みを選ぶ | URL の `?status=` を変える（`<Link>`） | 絞り込んだ一覧を表示 | - |
| 4 | チェックを切り替える | 画面をすぐ切り替え（`useOptimistic`）、Server Action `completeTodo` / `reopenTodo` | `updateTag("todos")`。サーバーの結果で表示を確定 | 表示を元に戻し、行の下にエラー |
| 5 | [削除] を押す | Server Action `deleteTodo` | `updateTag("todos")`。一覧から消える | 行の下にエラー |
| 6 | タイトルを押す | 画面を移動 | SCR-031 を表示 | - |

### 6.1 遷移先

| 遷移先 | きっかけ | 方法 |
| ------ | -------- | ---- |
| SCR-031 TODO 詳細 | タイトルを押す | `<Link href="/todos/{id}">` |
| SCR-001 トップ | [トップへ戻る] を押す | `<Link href="/">` |

## 7. データ取得・更新

### 7.1 取得

| No | 取得するデータ | 取得元 | 実行する場所 | キャッシュ | 再検証 |
| -- | -------------- | ------ | ------------ | ---------- | ------ |
| 1 | TODO の一覧（状態で絞り込み） | メモリ上の仮のデータ（Query Service） | 取得の関数 `listTodos(status)`（`<Suspense>` の中の Server Component から呼ぶ） | `'use cache'`・`cacheLife("max")`・`cacheTag("todos")`。`status` ごとに別に保存される | 追加・完了・元に戻す・削除の Server Action で `updateTag("todos")` |

- `searchParams` はアクセスのたびに変わるデータなので、読む部品（TodoListSection）を `<Suspense>` で囲む。囲まないとビルドでエラーになる（[04 データ取得・更新](../02_共通設計/04_データ取得・更新.md) の「2」）
- 新しいものから順に並べる

### 7.2 更新

| No | 処理 | 方式 | 入力 | 出力 | 更新後にすること |
| -- | ---- | ---- | ---- | ---- | ---------------- |
| 1 | 追加 | Server Action `createTodo` | `FormData`（`title`） | `ActionResult<TodoDto>` | `updateTag("todos")` |
| 2 | 完了にする | Server Action `completeTodo(id)` | TODO の ID | `ActionResult` | `updateTag("todos")` |
| 3 | 元に戻す | Server Action `reopenTodo(id)` | TODO の ID | `ActionResult` | `updateTag("todos")` |
| 4 | 削除 | Server Action `deleteTodo(id)` | TODO の ID | `ActionResult` | `updateTag("todos")` |

- 完了・元に戻す・削除は、フォームではなく `startTransition` の中で Server Action を関数として呼ぶ（行ごとのボタンなので）
- 登録したデータはメモリ上の仮のデータ置き場に入る。サーバーを立ち上げ直すと消える（メモと同じ割り切り）

## 8. 状態ごとの表示

| 状態 | 表示内容 | 実装 |
| ---- | -------- | ---- |
| 読み込み中（絞り込みの切り替え） | 「読み込み中…」 | `<Suspense fallback>` |
| 0 件 | 「TODO はありません」 | TodoListSection の中で分岐 |
| 追加の送信中 | [追加] を押せなくし、「追加中…」 | `useActionState` の `isPending` |
| チェックの送信中 | すぐに切り替わって見える。送信中はチェックと削除を押せなくする | `useOptimistic`、`useTransition` |
| 操作の失敗 | 行の下にメッセージ。チェックは元に戻る | `ActionResult` の `message` |

## 9. 未決事項

| No | 内容 | 担当 | 期限 | 結論 |
| -- | ---- | ---- | ---- | ---- |
| 1 | 本来の画面を作り始めたら、この画面を消すか、見本として残すか | | | |
| 2 | 削除の前に確認するか（見本では確認しない） | | | |

## 10. 変更履歴

| 日付 | 変更内容 | 変更者 |
| ---- | -------- | ------ |
| 2026-09-26 | 新規作成 | |
