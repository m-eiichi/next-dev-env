# 画面・データを足すとき（消すとき）に直す場所

画面やデータを足すと、コードのほかに次の場所も直す。消すとき（skill `remove-sample`）は、同じ一覧を逆にたどる。

直す場所が増えたら、この一覧に足す（足す作業と消す作業の両方に効く）。

## 1. コード

| 場所 | 足すとき | 消すとき |
| ---- | -------- | -------- |
| `src/app/{画面}/` | 作る | フォルダごと消す |
| `src/app/api/internal/{名前}/route.ts`（TanStack Query を使うとき） | 作る | 消す |
| `src/server/entry/queries/{名前}/`、`actions/{名前}/`、`api/internal/{名前}.ts` | 作る | 消す |
| `src/server/application/command/{名前}/`、`query/{名前}/`、`dto/{名前}/` | 作る | 消す |
| `src/server/domain/{名前}/`（業務のルールがあるときだけ） | 作る | 消す |
| `src/server/infrastructure/in-memory/{名前}/`（DB が決まるまで） | 作る | 消す |
| `src/server/infrastructure/di/container.ts` | import と 1 行を足す | import と 1 行を消す |
| `src/app/_components/hero-section.tsx`（トップから入る画面のとき） | ボタンを足す | ボタンを消す |
| `cacheTag` / `updateTag` のタグ名 | ほかの画面と重ならない名前にする | 使っている所が残っていないか `grep` で確かめる |

## 2. 資料（`docs/`）

| 場所 | 足すとき | 消すとき |
| ---- | -------- | -------- |
| `docs/03_画面設計/SCR-XXX_画面名.md` | テンプレートから作る | 消す |
| `docs/01_全体設計/01_サイトマップ・画面一覧.md` | サイトマップ・画面一覧・画面遷移図・変更履歴に足す | 同じ所から消し、変更履歴に書く |
| `docs/01_全体設計/05_ディレクトリ構成.md` の「1. 全体」 | 新しいフォルダを書く | 消したフォルダを消す（`domain/` の括弧の中も） |
| `docs/03_画面設計/SCR-001_トップ.md`（トップから入る画面のとき） | 「6. 操作・イベント」「6.1 遷移先」・変更履歴 | 同じ所から消す |
| `docs/03_画面設計/README.md` の「実装の見本」（見本の画面のとき） | 表に 1 行足し、見出しと「N つの見本」を直す | 表から消し、見出しと数を直す |

## 3. 見本を見本として参照している所

見本（メモ・TODO など）は、ほかの資料や仕組みから「見本」として参照されている。消すときは特に漏れやすい。

| 場所 | 参照している見本 | 消すときにすること |
| ---- | ---------------- | ------------------ |
| `src/server/infrastructure/in-memory/architecture-layer/in-memory-architecture-layer-query-service.ts`（層の説明 SCR-020 の `sampleFiles`・`codeExamples`） | メモ | 残す画面のコードに差し替える。テスト（`...query-service.test.ts`）が、載せたファイルとコードが実在するかを確かめている |
| `docs/03_画面設計/SCR-020_層の説明.md` | メモ | 上に合わせて直す |
| `docs/02_共通設計/04_データ取得・更新.md` のコード例と注記 | メモ（`listNotes`、`/api/internal/notes`） | 残す画面の例に差し替える |
| `.claude/skills/add-feature/SKILL.md`、`references/mutation.md`、`references/client-fetch.md` | メモ・TODO（「見本は〜」） | 残す画面の例に差し替えるか、見本の案内を消す |
| `docs/04_設計判断/ADR-*.md` | メモ | **書き換えない**（採用済みの ADR の本文は書き換えない。`docs/04_設計判断/README.md`）。リンク切れはそのままでよい |

- 見本がほかから参照されているかは、`grep -rn "{画面名}\|/{URL}\|{名前}/" src docs .claude` で洗い出す（例: `grep -rn "メモ\|/notes\|note/" src docs .claude`）
