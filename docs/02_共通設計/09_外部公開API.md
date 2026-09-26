# 09 外部公開 API

<!--
  外部（他のサーバー、スマホアプリ、外部サービスからの Webhook）に公開する API のルールを書く。
  外部に公開する API も Webhook もないなら、このファイルは消してよい。
  画面から使う取得・更新のルールは 04_データ取得・更新 に書く。
-->

## 1. 基本方針

| 項目 | ルール |
| ---- | ------ |
| 画面の取得・更新 | 外部公開 API は使わない。Server Component / Server Action で行う（[04 データ取得・更新](./04_データ取得・更新.md)） |
| 外部公開 API | 外部から呼ぶ必要がある操作だけを公開する |
| 中身の処理 | 業務のルールを API 側に書かず、ユースケースを呼ぶ（[06 アーキテクチャ](../01_全体設計/06_アーキテクチャ.md)）。基本は画面と同じユースケースを使う。外部だけの取り方（公開済みのものだけ、など）や項目が要るときは、外部公開用のユースケースを分ける（画面用の DTO を広げない。[ADR-015](../04_設計判断/ADR-015_外部公開APIと画面用APIの線引き.md)） |

### 画面から外部公開 API を呼ばない理由

- 画面の都合（表示項目の追加など）で、外部の利用者がいる API を変えたくなる状況を避けるため
- 画面用には Server Component / Server Action の方が速く、コードも少ないため

画面から Route Handler を使う必要がある場合（Client Component からの GET、ファイルのダウンロードなど）は、外部公開 API とは分けて置く（下の「2. 置き場所」）。

## 2. 置き場所

| 種類 | 置き場所 | 呼び出し元 | 例 |
| ---- | -------- | ---------- | -- |
| 外部公開 API | `src/app/api/v1/` | 外部のサーバー、アプリ | `src/app/api/v1/posts/route.ts` |
| Webhook の受け口 | `src/app/api/webhooks/` | 外部サービス | `src/app/api/webhooks/stripe/route.ts` |
| 画面用の Route Handler | `src/app/api/internal/` | 自分のアプリの画面だけ | ファイルのダウンロードなど |

- `api/v1/` の下を見れば、外部に公開しているものがすべてわかる状態を保つ

## 3. 公開する API の一覧

<!-- 公開する API を追加したら、ここに書く -->

| No | メソッド | パス | 概要 | 呼び出し元 | 認証 |
| -- | -------- | ---- | ---- | ---------- | ---- |
| 1 | （例）GET | `/api/v1/posts` | 公開済みの投稿の一覧 | （例）スマホアプリ | API キー |
| 2 | （例）POST | `/api/webhooks/stripe` | 決済完了の通知 | Stripe | 署名の検証 |

- 詳しい仕様（リクエスト・レスポンスの項目）は OpenAPI などで別に管理する / このファイルに書く

## 4. 認証

| 項目 | 外部公開 API | Webhook |
| ---- | ------------ | ------- |
| 方式 | API キー / トークン（OAuth のクライアント認証情報など） | 送信元サービスの署名を検証する |
| 送り方 | `Authorization: Bearer <キー>` ヘッダー | サービスごとのヘッダー（例: `Stripe-Signature`） |
| 発行・管理 | 管理画面で発行する / 手動で発行して環境変数に置く など | サービスの管理画面で発行し、環境変数に置く |
| 失敗したとき | `401` を返す | `400` / `401` を返し、処理しない |

- 画面のログイン用の Cookie には頼らない（外部から呼ばれる API は Cookie を持たないため）
- 認証は、ユースケースに渡す `AuthService` の実装を API 用に差し替えて行う / Route Handler の最初でチェックする
- API キーは画面やログに出さない。保存する場合はハッシュにする

### Webhook の注意点

| 項目 | ルール |
| ---- | ------ |
| 署名の検証 | 受け取った本文を**加工する前**のまま検証する（`await request.text()` で受け取る） |
| 二重の通知 | 同じ通知が複数回届くことがある。イベント ID を記録し、処理済みなら何もしない |
| 返すまでの時間 | 重い処理は後回しにし、すぐに `200` を返す（遅いと送信元が失敗とみなして再送する） |

## 5. バージョン

| 項目 | ルール |
| ---- | ------ |
| 付け方 | パスに付ける（`/api/v1/...`） |
| 互換性のある変更 | 同じバージョンのまま行ってよい（レスポンスへの項目の追加、任意のパラメータの追加） |
| 互換性のない変更 | 新しいバージョン（`/api/v2/...`）を作る（項目の削除・名前の変更、型の変更、必須パラメータの追加） |
| 古いバージョンの終了 | 利用者への告知から ◯ か月後に終了する |

## 6. リクエスト・レスポンスの形

| 項目 | ルール |
| ---- | ------ |
| 形式 | JSON |
| 項目名 | camelCase（TypeScript のコード、DTO、画面用の API と同じ。[ADR-015](../04_設計判断/ADR-015_外部公開APIと画面用APIの線引き.md)） |
| 日時 | ISO 8601（UTC）。例: `2026-01-01T00:00:00Z` |
| 入力のチェック | Zod で行う（[05 フォーム・バリデーション](./05_フォーム・バリデーション.md) のスキーマを使い回してよい） |
| 返す項目 | 外部向けの型を別に作る。画面用の DTO をそのまま返さない（画面の都合で API が変わるのを防ぐ。[ADR-009](../04_設計判断/ADR-009_APIのレスポンスの型.md)）。型と変換の関数は `src/server/entry/api/v1/` に置く（例: `public-post.ts` の `PublicPost` と `toPublicPost`）。詳しくは下の「6.1」 |
| 一覧 | ページ分けする（`?limit=20&cursor=...` / `?page=1`）。上限を決める |

### 6.1 画面用の API との関係

外部公開 API と画面用の API（`/api/internal/`、[04 データ取得・更新](./04_データ取得・更新.md) の「5」）は、**形式はそろえ、中身は分ける**（[ADR-015](../04_設計判断/ADR-015_外部公開APIと画面用APIの線引き.md)）。

| 分類 | 例 | 外部公開と画面用 | 理由 |
| ---- | -- | ---------------- | ---- |
| 形式（書き方の約束） | JSON、成功は `{ data }`、失敗は RFC 9457（下の「失敗したとき」）、ステータスコードの使い方、項目名（camelCase）、日時（ISO 8601） | **そろえる** | ほとんど変わらない。そろえておけば、扱うコードを 1 種類で済ませられる |
| 中身（何をどう返すか） | 返す項目、URL の設計、一覧のページ分け、バージョン、認証、互換性の約束 | **分ける** | 画面用は画面を直すたびに変えてよい。外部公開は利用者を壊さないように変える必要があり、約束の重さが違う |

外部公開 API は、ユースケースが返す DTO を、入口で公開用の型に詰め替えて返す。

```
ユースケース → DTO → toPublic〇〇()（src/server/entry/api/v1/）→ 公開用の型 → { data: [...] }
```

| 詰め替えでやること | 例 |
| ------------------ | -- |
| 返す項目を選ぶ | 画面だけで使う項目（`isNew` など）や、内部だけの項目は出さない |
| 名前を、外部との約束どおりにする | DTO の `description` を `summary` として返す |
| 形を、外部との約束どおりにする | 日時を ISO 8601 の文字列にする、値がないときは `null` にそろえる |

- 画面側で DTO の項目を足す・名前を変えるときは、詰め替えの関数だけを直し、公開用の型は変えない。公開用の型を変えるのは、外部の利用者のために変える必要があるときだけ（互換性のない変更なら「5. バージョン」のとおり `/v2` を作る）
- DTO に足りない項目や、外部だけの取り方が要るときは、画面用の DTO に足さず、外部公開用のユースケースを分ける（下の「9. 実装の例」の `ListPublishedPostsUseCase`）

### 成功したとき

```json
{
  "data": { "id": "123", "title": "タイトル" }
}
```

### 失敗したとき

RFC 9457（Problem Details for HTTP APIs）の形にする（[ADR-010](../04_設計判断/ADR-010_APIのエラーの形.md)）。`Content-Type` は `application/problem+json`。

```json
{
  "type": "about:blank",
  "title": "Bad Request",
  "status": 400,
  "detail": "入力内容を確認してください",
  "code": "VALIDATION_ERROR",
  "errors": { "title": ["タイトルを入力してください"] }
}
```

| 項目 | 種類 | 内容 |
| ---- | ---- | ---- |
| `type` | 規格 | 常に `about:blank`（HTTP のステータスコードの意味どおり、という規格の既定値） |
| `title` | 規格 | ステータスコードの英語の名前（`Bad Request`、`Not Found` など） |
| `status` | 規格 | HTTP のステータスコードと同じ数値 |
| `detail` | 規格 | 利用者向けの日本語のメッセージ。内部の情報は入れない |
| `code` | 追加 | 何のエラーかを機械的に判定するための文字列（下の「ステータスコード」の表） |
| `errors` | 追加 | 入力欄ごとのエラー（`{ 項目名: メッセージの配列 }`）。`code` が `VALIDATION_ERROR` のときだけ付ける |

- 規格の `instance` は使わない

### ステータスコード

| ステータス | 使う場面 | `code` の例 |
| ---------- | -------- | ----------- |
| `200` / `201` | 成功 / 作成した | - |
| `400` | リクエストの形式が正しくない、入力エラー | `VALIDATION_ERROR` |
| `401` | 認証情報がない、正しくない | `UNAUTHORIZED` |
| `403` | 認証はできたが、権限がない | `FORBIDDEN` |
| `404` | 対象が見つからない | `NOT_FOUND` |
| `409` / `422` | 業務のルール違反（重複登録など） | `CONFLICT` など |
| `429` | 回数の上限を超えた | `RATE_LIMITED` |
| `500` | 想定外のエラー | `INTERNAL_ERROR` |

- `500` のときは、内部の情報（スタックトレース、SQL）を返さない（[06 エラー処理](./06_エラー処理.md)）
- 想定外のエラーを中で捕まえて `500` を返すため、エラー監視（`onRequestError`）には届かない。対応は [07 ログ・監視](./07_ログ・監視.md) の「5. 未決事項」
- 失敗したときのレスポンスは、`src/server/entry/api/problem-details.ts` の `problemResponse()` で作る。画面用の Route Handler（`/api/internal/`）も同じ形にする（[04 データ取得・更新](./04_データ取得・更新.md) の「5.2」）

## 7. 大量アクセス対策

| 項目 | ルール |
| ---- | ------ |
| レート制限 | API キーごとに ◯ 回 / 分 まで。超えたら `429` と `Retry-After` ヘッダーを返す |
| 実装 | ホスティングの機能を使う / Redis などで数える |
| リクエストの大きさ | 本文の上限を決める（例: 1MB） |

## 8. CORS

| 項目 | ルール |
| ---- | ------ |
| ブラウザからの呼び出し | 許可しない（サーバーやアプリからだけ呼ぶ） / 許可する |
| 許可する場合 | 許可するオリジンを列挙する。`*` は使わない |

## 9. 実装の例

中身は `src/server/entry/api/` に書き、`src/app/` の `route.ts` はそれを読み込むだけにする（[06 アーキテクチャ](../01_全体設計/06_アーキテクチャ.md) の「4.1 入口」）。

```ts
// src/app/api/v1/posts/route.ts
export { GET } from "@/server/entry/api/v1/posts";
```

```ts
// src/server/entry/api/v1/posts.ts
import "server-only";
import { container } from "@/server/infrastructure/di/container";
import { ListPublishedPostsUseCase } from "@/server/application/usecase/post/list-published-posts.usecase";
import { verifyApiKey } from "@/server/infrastructure/api/verify-api-key";
import { toPublicPost } from "./public-post";
import { problemResponse } from "../problem-details";

export async function GET(request: Request) {
  // 1. 認証
  const client = await verifyApiKey(request.headers.get("authorization"));
  if (!client) {
    return problemResponse({ status: 401, code: "UNAUTHORIZED", detail: "API キーが正しくありません" });
  }

  // 2. ユースケースを呼ぶ（公開済みの投稿だけを返す、外部公開用のユースケース。「6.1」）
  try {
    const useCase = new ListPublishedPostsUseCase(container.postRepository());
    const posts = await useCase.execute();

    // 3. 外部向けの形に変換して返す
    return Response.json({ data: posts.map(toPublicPost) });
  } catch (error) {
    console.error(error);
    return problemResponse({ status: 500, code: "INTERNAL_ERROR", detail: "エラーが発生しました" });
  }
}
```

```ts
// src/server/entry/api/v1/public-post.ts（公開用の型と詰め替え。「6.1」）
import type { PostDto } from "@/server/application/dto/post/post.dto";

// 外部の利用者との約束。項目の削除・名前の変更は /v2 を作る（「5. バージョン」）
export type PublicPost = {
  id: string;
  title: string;
  summary: string;
  publishedAt: string | null;
};

export function toPublicPost(post: PostDto): PublicPost {
  return {
    id: post.id,
    title: post.title,
    summary: post.body.slice(0, 200), // 画面用の DTO の項目名や形が変わっても、ここで吸収する
    publishedAt: post.publishedAt,
  };
}
```

## 10. 変更履歴

| 日付 | 変更内容 | 変更者 |
| ---- | -------- | ------ |
| YYYY-MM-DD | 新規作成 | |
| 2026-09-23 | 実装の例を、中身を `src/server/entry/api/` に置く形にした（[ADR-008](../04_設計判断/ADR-008_フロントとバックの分け方.md)） | |
| 2026-09-23 | 外部向けの型の置き場所を追記（[ADR-009](../04_設計判断/ADR-009_APIのレスポンスの型.md)） | |
| 2026-09-23 | 失敗したときの形を RFC 9457（Problem Details）に変更。`problemResponse()` を `src/server/entry/api/` に置き、画面用の Route Handler と共用にした（[ADR-010](../04_設計判断/ADR-010_APIのエラーの形.md)） | |
| 2026-09-26 | 「1」の「中身の処理」を、外部公開用のユースケースを分ける場合がある形に直した。「6」の項目名を camelCase に決め、「6.1 画面用の API との関係」を追加（[ADR-015](../04_設計判断/ADR-015_外部公開APIと画面用APIの線引き.md)） | |
