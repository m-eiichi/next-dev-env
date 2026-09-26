<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# プロジェクトのルール

<!-- 上の nextjs-agent-rules のブロックは next dev が書き直すので、プロジェクトのルールはこの見出しより下に書く -->

設計とルールの資料は `docs/` にある（入口は `docs/README.md`）。コードを書く前に、関係する資料を読み、資料と食い違うコードを書かない。資料と違うやり方が必要なら、先にユーザーに確認する。ルールを決めた理由は `docs/04_設計判断/`（ADR）にある。方針を変える提案をするときは、該当する ADR の「検討した案」と「見直す条件」を読んでから行う。

## 特に守ること

### アーキテクチャ（`docs/01_全体設計/06_アーキテクチャ.md`）

- `src/server/` の外（`src/app/`、`src/components/`、`src/hooks/`）がフロント、中がバック。フロントが `src/server/` から import してよいのは `src/server/entry/` の関数と DTO の型だけ（`docs/04_設計判断/ADR-008_フロントとバックの分け方.md`）
- バックは `src/server/entry/`（入口）→ `src/server/application/`（ユースケース、DTO）→ `src/server/domain/`（業務のルール）に分け、`src/server/infrastructure/`（DB・認証の実装、DI コンテナ）がドメイン層のインターフェースを実装する。依存は外側から内側への一方向だけ
- ドメイン層は Next.js、React、DB クライアント、Zod を import しない
- ユースケースは依存をコンストラクタで受け取る。ユースケースの中で DI コンテナを使ったり、実装を `new` したりしない
- 依存の組み立て（Composition Root）は入口（`src/server/entry/`）だけで行う。`page.tsx` は取得の関数を呼んで部品に渡すだけ、`route.ts` は `src/server/entry/api/` から読み込むだけにする
- Client Component にはエンティティではなく DTO（プレーンなオブジェクト）を渡す
- `src/server/application/`、`src/server/infrastructure/`、`src/server/entry/queries/`、`src/server/entry/api/` のファイルの先頭には `import "server-only"` を書く（DTO と、`'use server'` を書く `src/server/entry/actions/` は除く）

### データの取得・更新（`docs/02_共通設計/04_データ取得・更新.md`）

- 画面の取得は Server Component から `src/server/entry/queries/` の関数を呼んで行い、更新は `src/server/entry/actions/` の Server Action で行う。画面から `fetch('/api/...')` で自前の API を呼ばない
- Server Action は `src/app/` の中に置かない（1 画面だけで使うものも `src/server/entry/actions/` に置く）
- Cache Components が有効。キャッシュは取得の関数に `'use cache'` と `cacheLife`（必須）・`cacheTag` で指定し、キャッシュしない取得は `<Suspense>` で囲む。`revalidate`・`dynamic`・`dynamicParams` のページ設定は使わない（`docs/04_設計判断/ADR-012_キャッシュの方式.md`）
- Route Handler は外部公開 API（`src/app/api/v1/`）、Webhook（`src/app/api/webhooks/`）、画面用の例外（`src/app/api/internal/`）だけに使う（`docs/02_共通設計/09_外部公開API.md`）
- Server Action の戻り値は `ActionResult` の形にそろえる。想定内のエラーは戻り値で返し、想定外のものだけ `throw` する

### ファイルの置き場所と名前（`docs/01_全体設計/05_ディレクトリ構成.md`）

- ファイル名・フォルダ名はすべて kebab-case（コンポーネントも `post-list.tsx`）。コンポーネント名は PascalCase
- 複数の画面で使う部品は `src/components/{atoms,molecules,organisms}/{名前}/index.tsx`、その画面だけで使う部品は `src/app/**/_components/{名前}.tsx`
- shadcn/ui の部品は `pnpm shadcn:add <atoms|molecules> <名前>` で追加する。`pnpm shadcn add` を直接使わない
- テストはテスト対象と同じフォルダに `*.test.ts(x)` で置く

### React・Next.js（`docs/02_共通設計/08_コーディング規約.md`）

- `'use client'` は必要な最小の部品にだけ付ける
- ファイル直下の関数（コンポーネントを含む）は `function` で書く。`export const Foo = () => ...` にしない。関数の中のイベントハンドラーやコールバックはアロー関数でよい
- React Compiler が有効なので、`useMemo` / `useCallback` / `memo` は原則書かない
- `middleware.ts` ではなく `proxy.ts` を使う

## Claude Code の設定（`.claude/`）

- 新しい画面や、画面に出すデータを追加するときは、skill `add-feature`（`.claude/skills/add-feature/SKILL.md`）の手順に沿う
- ファイルを編集するたびに、hook が `src/` の `.ts` / `.tsx` に ESLint をかける。エラーを伝えられたら、その場で直す

## 作業を終える前に

変更したら、次がすべて通ることを確認する（CI と同じ）。

```bash
pnpm lint && pnpm lint:ls && pnpm typecheck && pnpm test:coverage && pnpm build
```

- 業務のルールやユースケースを追加・変更したら、テストも書く（`docs/02_共通設計/10_テスト.md`）
- ルールや構成を変えたら、関係する `docs/` の資料も更新する
