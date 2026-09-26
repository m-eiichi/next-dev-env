# バック（`src/server/`）を作る: 読み取り（query）

依存の向きとファイルの置き場所は `docs/01_全体設計/06_アーキテクチャ.md` の「2」「3」、更新と読み取りの分け方（CQRS）は同じ資料の「4.3」、Query Service の実装は「4.5」、名前は `docs/01_全体設計/05_ディレクトリ構成.md` の「4」。

画面に出すデータの取得は、ドメイン層を通らない読み取り（query）側で作る。更新もある場合は、あわせて `mutation.md` の手順で command 側を作る。

内側から順に作る（例は 06 アーキテクチャの投稿（`post`）の例）。

| 順 | 層 | 作るもの | 例 |
| -- | -- | -------- | -- |
| 1 | アプリケーション層 | DTO（配列はコピーして返す） | `src/server/application/dto/post/post.dto.ts` |
| 2 | アプリケーション層 | Query Service のインターフェース（DTO を返す、読み取り専用） | `src/server/application/query/post/post-query-service.ts` |
| 3 | インフラストラクチャ層 | Query Service の実装（DB が決まるまではメモリ上の仮の実装）。エンティティを作らず、DTO を直接作る | `src/server/infrastructure/database/post/post-query-service-impl.ts` |
| 4 | インフラストラクチャ層 | DI コンテナに 1 行足す | `src/server/infrastructure/di/container.ts` |
| 5 | アプリケーション層 | クエリ（認証・認可のチェック → Query Service を呼ぶ。依存はコンストラクタで受け取る）とそのテスト | `src/server/application/query/post/list-posts.query.ts` |
| 6 | 入口 | 取得の関数。TanStack Query 用は `client-fetch.md` | `src/server/entry/queries/post/list-posts.ts` |

- 更新がないデータ（マスタの一覧など）は、ドメイン層に何も置かない（06 アーキテクチャの「8」）

## チェック

- [ ] `src/server/application/`（DTO を除く）、`src/server/infrastructure/`、`src/server/entry/queries/`、`src/server/entry/api/` の先頭に `import "server-only"`
- [ ] クエリで認証・認可をチェックしている。チェックしない場合（全員が見られる画面）は、理由をコメントで書く
- [ ] クエリの中でエンティティを作っていない。業務のルールを書いていない
- [ ] 取得の関数ごとに、`'use cache'`＋`cacheLife` を付けるか、画面側で `<Suspense>` で囲むかを決める（`docs/02_共通設計/04_データ取得・更新.md` の「2」）。メモリ上の仮の実装なら、どちらもなしでよい
- [ ] DI コンテナを変えたら、層の説明ページのコード例（`in-memory-architecture-layer-repository.ts` の `codeExamples`）とずれていないか、テストで確かめる
