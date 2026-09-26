# ブラウザ側で取り直す（TanStack Query）場合

使うかどうかと書き方は `docs/02_共通設計/04_データ取得・更新.md` の「5. クライアントでの取得（TanStack Query）」、エラーの形は `docs/02_共通設計/09_外部公開API.md` の「6」の「失敗したとき」。見本は `docs/03_画面設計/SCR-011_メモ検索.md` とそのコード。

## チェック

- [ ] 入口: `src/server/entry/api/internal/{名前}.ts` に Route Handler の中身を書く。入力を Zod でチェックし、クエリを呼ぶ
- [ ] レスポンスの型（`{ data: T }`）を入口のファイルで export し、返す値に `satisfies` を付ける
- [ ] 失敗したときは `src/server/entry/api/problem-details.ts` の `problemResponse()` で返す（RFC 9457）
- [ ] `src/app/api/internal/{名前}/route.ts` は `export { GET } from "@/server/entry/api/internal/{名前}"` の 1 行だけ
- [ ] 初期表示のデータは Server Component で取得の関数から取り、Client Component に渡して `initialData` にする
- [ ] `useQuery` は使う Client Component の中に書く。レスポンスの型は `import type` で読み込む。query key は `["エンティティ名", { 条件 }]`
- [ ] `useQuery` を使う部品は `<Suspense>` で囲み、`fallback` に初期表示のデータで描いた表示を渡す（囲まないとビルドでエラーになる）
- [ ] 入力に合わせて取得するなら、入力が止まってから取得し、`placeholderData: keepPreviousData` で前の結果を残す
