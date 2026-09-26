# バック（`src/server/`）を作る

依存の向きとファイルの置き場所は `docs/01_全体設計/06_アーキテクチャ.md` の「2」「3」、各層の書き方とコード例は同じ資料の「4」、名前は `docs/01_全体設計/05_ディレクトリ構成.md` の「4」。

内側から順に作る。

| 順 | 層 | 作るもの | 例 |
| -- | -- | -------- | -- |
| 1 | ドメイン層 | 読むだけのデータ: 型とリポジトリのインターフェースだけ（`repository.ts`）。業務のルールあり: エンティティ、値オブジェクト、`DomainError` とそのテスト | `src/server/domain/tech-stack/repository.ts`、`src/server/domain/example/` |
| 2 | インフラストラクチャ層 | リポジトリの実装（DB が決まるまではメモリ上の仮の実装） | `src/server/infrastructure/in-memory/tech-stack/in-memory-tech-stack-repository.ts` |
| 3 | インフラストラクチャ層 | DI コンテナに 1 行足す | `src/server/infrastructure/di/container.ts` |
| 4 | アプリケーション層 | DTO（配列はコピーして返す）とユースケース（依存はコンストラクタで受け取る）、ユースケースのテスト | `src/server/application/dto/`、`src/server/application/usecase/` |
| 5 | 入口 | 取得の関数（`src/server/entry/queries/`）。更新は `mutation.md`、TanStack Query 用は `client-fetch.md` | `src/server/entry/queries/tech-stack/list-tech-stack.ts` |

## チェック

- [ ] `src/server/application/`、`src/server/infrastructure/`、`src/server/entry/queries/`、`src/server/entry/api/` の先頭に `import "server-only"`（DTO と `src/server/entry/actions/` は除く）
- [ ] 取得の関数ごとに、`'use cache'`＋`cacheLife` を付けるか、画面側で `<Suspense>` で囲むかを決める（`docs/02_共通設計/04_データ取得・更新.md` の「2」）。メモリ上の仮のリポジトリなら、どちらもなしでよい
- [ ] 認証チェックをしないユースケースには、しない理由をコメントで書く
- [ ] DI コンテナを変えたら、層の説明ページのコード例（`in-memory-architecture-layer-repository.ts` の `codeExamples`）とずれていないか、テストで確かめる
