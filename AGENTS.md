<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# プロジェクトのルール

<!-- 上の nextjs-agent-rules のブロックは next dev が書き直すので、プロジェクトのルールはこの見出しより下に書く -->
<!-- このファイルは毎回読み込まれる入口。ルールの中身は書かず、機械では止められないことと、読む資料の目次だけを書く（docs/05_AI駆動開発/02_仕組み.md の「1.1」） -->

設計とルールの資料は `docs/` にある。作業を始める前に、下の「作業ごとに読むもの」から関係する資料の節を読み、資料と食い違うコードを書かない。資料と違うやり方が必要なら、先にユーザーに確認する。

## 毎回守ること

機械（ESLint・ls-lint・テスト）では止められないので、ここに書いている。

- 画面の取得は Server Component から `src/server/entry/queries/` の関数を呼び、更新は `src/server/entry/actions/` の Server Action で行う。画面から `fetch("/api/...")` で自前の API を呼ばない
- shadcn/ui の部品は `pnpm shadcn:add <atoms|molecules> <名前>` で追加する。`pnpm shadcn add` を直接使わない
- React Compiler が有効なので `useMemo` / `useCallback` / `memo` は原則書かない。`middleware.ts` ではなく `proxy.ts` を使う。`'use client'` は必要な最小の部品にだけ付ける
- 頼まれていないコミット・push・Pull Request の作成、依存の追加・削除は、先に人に確認する（`docs/05_AI駆動開発/01_方針・進め方.md`）

層をまたぐ import、関数の書き方、ファイル名のルールは、ESLint・ls-lint が止める。エラーになったら、エラーの文に書かれた資料を読む。

## 作業ごとに読むもの

| 作業 | 読むもの |
| ---- | -------- |
| 画面を追加する | `docs/03_画面設計/README.md`（真似する実装の見本は「実装の見本」）、`docs/01_全体設計/01_サイトマップ・画面一覧.md` |
| 処理をどの層に書くか、import で迷う | `docs/01_全体設計/06_アーキテクチャ.md` の「2. 層の構成」 |
| 各層（入口・ユースケース・クエリ・ドメイン・インフラ）の書き方 | `docs/01_全体設計/06_アーキテクチャ.md` の「4. 各層の責務と書き方」の該当する層 |
| 更新（ユースケース）と読み取り（クエリ）の分け方（CQRS） | `docs/01_全体設計/06_アーキテクチャ.md` の「4.3」 |
| データを取得する、キャッシュを決める | `docs/02_共通設計/04_データ取得・更新.md` の「1」「2」 |
| データを更新する（Server Action） | `docs/02_共通設計/04_データ取得・更新.md` の「3」、`docs/02_共通設計/05_フォーム・バリデーション.md` |
| ブラウザで取り直す（TanStack Query） | `docs/02_共通設計/04_データ取得・更新.md` の「5」 |
| Route Handler、外部公開 API | `docs/02_共通設計/04_データ取得・更新.md` の「4」、`docs/02_共通設計/09_外部公開API.md` |
| エラーの扱い | `docs/02_共通設計/06_エラー処理.md` |
| 認証・認可 | `docs/02_共通設計/01_認証・認可.md` の「3」「4」 |
| ファイルの置き場所、名前、部品の分け方 | `docs/01_全体設計/05_ディレクトリ構成.md` の「2」「4」 |
| 命名、関数の書き方、`cn()` | `docs/02_共通設計/08_コーディング規約.md` |
| 見た目（色、余白、アイコン） | `docs/02_共通設計/03_デザインルール.md` |
| テストを書く | `docs/02_共通設計/10_テスト.md` の「2」「3」 |
| 方針を変える提案をする | `docs/04_設計判断/` の該当する ADR の「検討した案」と「見直す条件」 |
| Next.js の API を使う | `node_modules/next/dist/docs/`（上の段落のとおり） |
| AI としての進め方 | `docs/05_AI駆動開発/01_方針・進め方.md` |

## 作業を終える前に

変更したら、次がすべて通ることを確認する（CI と同じ）。

```bash
pnpm lint && pnpm lint:ls && pnpm typecheck && pnpm test:coverage && pnpm build
```

- 業務のルールやユースケースを追加・変更したら、テストも書く
- ルールや構成を変えたら、関係する `docs/` の資料も更新する。`docs/` の節の番号や名前を変えたら、上の「作業ごとに読むもの」も直す
