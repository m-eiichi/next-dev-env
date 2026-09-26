---
name: add-feature
description: 新しい画面、または画面に出すデータ（取得・更新）を追加するときの手順。資料（docs/）の更新から、ドメイン層・インフラストラクチャ層・アプリケーション層・入口・画面の実装、テスト、CI と同じチェックまでを順番に行う。「画面を追加して」「〜の一覧を出したい」「〜をインフラ層から取得する形にして」「〜を登録できるようにして」などの依頼で使う。
---

# 新しい画面・データを追加する

このプロジェクトのルールの本体は `docs/` にある。ここには**手順と、どの資料を見るか**だけを書く。ルールの中身はリンク先を読み、ここに写さない。

## 0. 最初に決めること

| 決めること | 見る資料 |
| ---------- | -------- |
| 新しい画面か、既存の画面にデータを足すだけか | `docs/01_全体設計/01_サイトマップ・画面一覧.md` |
| 取得だけか、更新（登録・変更・削除）もあるか | `docs/02_共通設計/04_データ取得・更新.md` |
| 業務のルールがあるか（なければエンティティと値オブジェクトは作らない） | `docs/01_全体設計/06_アーキテクチャ.md` の「8. 小さな機能での省略」 |
| ブラウザ側で取り直す必要があるか（あれば TanStack Query） | `docs/02_共通設計/04_データ取得・更新.md` の「5」 |

資料と違うやり方が必要なら、実装の前にユーザーに確認する。

## 1. 資料を先に書く

- [ ] 画面を足すなら `docs/03_画面設計/_テンプレート.md` をコピーして `SCR-XXX_画面名.md` を作る（番号は機能のまとまりごとに 10 ずつ空ける）
- [ ] 画面を足すなら `docs/01_全体設計/01_サイトマップ・画面一覧.md` のサイトマップ・画面一覧・画面遷移図を更新する
- [ ] 既存の画面を変えるなら、その `SCR-XXX` の「3. コンポーネント構成」「4. 表示項目」「6. 操作・イベント」「7.1 取得」と変更履歴を更新する
- [ ] ルールや方針を変えるなら ADR を書く（`docs/04_設計判断/README.md` の「書き方」）

## 2. バック（`src/server/`）を内側から作る

依存の向きとファイルの置き場所は `docs/01_全体設計/06_アーキテクチャ.md`、名前は `docs/01_全体設計/05_ディレクトリ構成.md` の「4」。

| 順 | 層 | 作るもの | 例 |
| -- | -- | -------- | -- |
| 1 | ドメイン層 | 読むだけのデータ: 型とリポジトリのインターフェースだけ（`repository.ts`）。業務のルールあり: エンティティ、値オブジェクト、`DomainError` とテスト | `src/server/domain/tech-stack/repository.ts`、`src/server/domain/example/` |
| 2 | インフラストラクチャ層 | リポジトリの実装（DB が決まるまではメモリ上の仮の実装） | `src/server/infrastructure/in-memory/tech-stack/in-memory-tech-stack-repository.ts` |
| 3 | インフラストラクチャ層 | DI コンテナに 1 行足す | `src/server/infrastructure/di/container.ts` |
| 4 | アプリケーション層 | DTO（配列はコピーして返す）とユースケース（依存はコンストラクタで受け取る）、ユースケースのテスト | `src/server/application/dto/`、`src/server/application/usecase/` |
| 5 | 入口 | 取得: `src/server/entry/queries/`。更新: `src/server/entry/actions/`（`ActionResult` を返す）。TanStack Query 用: `src/server/entry/api/internal/` と `src/app/api/internal/**/route.ts` | `src/server/entry/queries/tech-stack/list-tech-stack.ts` |

- [ ] `src/server/application/`、`src/server/infrastructure/`、`src/server/entry/queries/`、`src/server/entry/api/` の先頭に `import "server-only"`
- [ ] 取得の関数ごとに、`'use cache'`＋`cacheLife` を付けるか、画面側で `<Suspense>` で囲むかを決める（`docs/02_共通設計/04_データ取得・更新.md` の「2」。メモリ上の仮のリポジトリなら、どちらもなしでよい）
- [ ] 認証チェックをしないユースケースには、しない理由をコメントで書く

## 3. フロント（`src/app/` など）を作る

- [ ] `page.tsx` は取得の関数を呼んで部品に渡すだけ。取得が複数なら `Promise.all`
- [ ] 部品は DTO を `import type` で受け取る。フロントから import してよいのは `src/server/entry/` と DTO の型だけ（ESLint が止める）
- [ ] その画面だけの部品は `src/app/**/_components/`、複数の画面で使うなら `src/components/`（`docs/01_全体設計/05_ディレクトリ構成.md` の「2.1」）
- [ ] ファイル直下の関数は `function`、`cn()` は `cn` から import（`docs/02_共通設計/08_コーディング規約.md`）
- [ ] 画面内の移動は `next/link`、外部サイトは `<a target="_blank" rel="noopener noreferrer">`

## 4. 仕上げ

- [ ] 新しいフォルダを作ったら `docs/01_全体設計/05_ディレクトリ構成.md` の「1. 全体」を更新する
- [ ] DI コンテナを変えたら、層の説明ページのコード例（`in-memory-architecture-layer-repository.ts` の `codeExamples`）とずれていないか、テストで確かめる
- [ ] CI と同じチェックを流す

```bash
pnpm lint && pnpm lint:ls && pnpm typecheck && pnpm test:coverage && pnpm build
```

- [ ] ビルドの結果で、ページが意図どおり静的（○）か部分的に静的（◐）になっているかを見る
- [ ] ユーザーへの報告に、更新した資料と、確かめていないこと（ブラウザでの見た目など）を書く
