# 更新（登録・変更・削除）がある場合: command

更新と読み取りの分け方（CQRS）は `docs/01_全体設計/06_アーキテクチャ.md` の「4.3」、ドメイン層は同じ資料の「4.4」、Server Action の書き方は `docs/02_共通設計/04_データ取得・更新.md` の「3. データ更新（Server Action）」、入口のコード例は 06 の「4.1」の「更新」、入力チェックとフォームは `docs/02_共通設計/05_フォーム・バリデーション.md`、エラーの扱いは `docs/02_共通設計/06_エラー処理.md`、認可は `docs/02_共通設計/01_認証・認可.md` の「3」。

更新は、エンティティとリポジトリを通って業務のルールを守る（command 側）。画面に出す取得は、`backend.md` の読み取り（query）側で作る。

## チェック

- [ ] ドメイン層: 業務のルール（重複できない、公開済みは変えられない など）をエンティティ・値オブジェクトに書き、ルール違反は `DomainError` にする。テストを書く
- [ ] ドメイン層: リポジトリのインターフェースには、更新に要るメソッド（保存、削除、更新のための取得）だけを置く。一覧や検索は Query Service に置く
- [ ] インフラストラクチャ層: リポジトリの実装と、DI コンテナへの 1 行
- [ ] ユースケース: `src/server/application/command/{エンティティ名}/{名前}.usecase.ts`。最初に認証・認可をチェックする。テストで「権限がないと失敗する」ことも確かめる
- [ ] ユースケースから query 側（`src/server/application/query/`）を import しない（ESLint が止める）
- [ ] 変更・削除は「リポジトリの `findById()` で取り出す → なければ見つからないエラー（`DomainError` を継承）→ エンティティのメソッドで変える → 保存」の順にする。状態の変化のルール（完了済みは完了にできない など）はエンティティのメソッドに書く（見本は TODO の `complete-todo.usecase.ts`）
- [ ] 読み取りと更新で同じ条件（公開済みかどうか など）を使うなら、ドメイン層の関数・定数にして両方から使う
- [ ] Server Action は `src/server/entry/actions/{エンティティ名}/{操作名}.ts` に 1 ファイル 1 つ。先頭は `'use server'`。`src/app/` の中には置かない
- [ ] Server Action の中で、入力を Zod でチェックする（クライアントでチェックしていても、必ずサーバーでもする）
- [ ] 戻り値は `ActionResult` の形。想定内のエラー（入力エラー、`DomainError`、未認証）は戻り値で返し、想定外のものだけ `throw` する
- [ ] 更新後に `updateTag` で、一覧などの取得の関数のキャッシュ（`cacheTag`）を捨てる（Server Action では `revalidateTag` ではなく `updateTag`）。`redirect()` は `try/catch` の外で呼ぶ
- [ ] フォームの部品（Client Component）で、送信中の表示とエラーの表示をする（`useActionState` など）
- [ ] 行ごとのボタンなど、フォームでない操作は `startTransition` の中で Server Action を関数として呼ぶ。すぐ画面に出したいときは `useOptimistic`（見本は TODO の `todo-item.tsx`）
