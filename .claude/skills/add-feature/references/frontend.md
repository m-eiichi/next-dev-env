# フロント（`src/app/` など）を作る

プレゼンテーション層の書き方は `docs/01_全体設計/06_アーキテクチャ.md` の「4.2」、部品の置き場所は `docs/01_全体設計/05_ディレクトリ構成.md` の「2.1」「2.2」、見た目は `docs/02_共通設計/03_デザインルール.md`。

## チェック

- [ ] `page.tsx` は取得の関数を呼んで部品に渡すだけ。取得が複数なら `Promise.all`
- [ ] 部品は DTO を `import type` で受け取る。フロントから import してよいのは `src/server/entry/` と DTO の型だけ（ESLint が止める）
- [ ] その画面だけの部品は `src/app/**/_components/`、複数の画面で使うなら `src/components/`。同じ機能の複数の画面で使う部品は、親のフォルダの `_components/` に置いてよい
- [ ] 共通の部品（ボタン、カードなど）は `src/components/` の既存のものを使う。shadcn/ui で足すなら `pnpm shadcn:add`
- [ ] 画面内の移動は `next/link`、外部サイトは `<a target="_blank" rel="noopener noreferrer">`
- [ ] 動的なルート（`[id]` など）は `generateStaticParams` と `notFound()` で作る。`dynamicParams` は使わない（Cache Components が有効のため）
- [ ] `metadata`（`title`）を書く
