---
name: update-ai-docs
description: AI の仕組み（`.claude/` の skill・hook・`settings.json` の権限、`AGENTS.md`、`CLAUDE.md`）を追加・変更・削除したときに、`docs/05_AI駆動開発/` などの資料と、ほかの skill・CLAUDE.md からの案内を実際の設定にそろえる手順。「skill を作って」「hook を足して」「権限を変えて」「AGENTS.md を直して」などの依頼で仕組みを変えた後や、ほかの作業の途中でこれらのファイルを変えたときに使う。
---

# AI の仕組みを変えたら資料をそろえる

仕組みの一覧と足すときのルールは `docs/05_AI駆動開発/02_仕組み.md`。資料が実際の設定とずれると、人は使える skill や権限を知らないまま作業し、AI は資料を信じて間違える。

## 0. 変えたものを確かめる

```bash
git status --short -- .claude AGENTS.md CLAUDE.md
git diff -- .claude AGENTS.md CLAUDE.md
```

- まだコミットしていない変更だけでなく、この会話で変えたものも含める
- 変えた理由（なぜその仕組みを足したか、なぜその権限にしたか）を、ユーザーとのやり取りから拾っておく。資料の「理由」の列に書く

## 1. 直す場所を決める

変えたものごとに、下の表の場所を直す。節の番号は `02_仕組み.md` のもの。

| 変えたもの | 直す場所 |
| ---------- | -------- |
| skill を足した・消した | 「2.1」の表（ふだんの作業の流れの順に並べ、ときどき行う作業は後ろに置く）。`CLAUDE.md` の skill の案内（1 行） |
| skill の使う場面・中身を変えた（`references/`、`scripts/` を含む） | 「2.1」の表の「使う場面」「中身」 |
| skill から別の skill を使うようにした | 「2.1」の表の、使われる側の「使う場面」。使われる側の `description` にも「skill 〜 で〜のときに使う」と書く（`app-check`、`remove-sample` と同じ書き方） |
| hook を足した・変えた・消した（`settings.json` の `hooks`、`.claude/hooks/`） | 「2.2」の表。`CLAUDE.md` の hook の案内 |
| 権限（`settings.json` の `permissions`）を変えた | 「2.3」の表（`allow` / `ask` の区分と理由）。MCP のサーバーを足したら `ask` の行にも足す |
| agents（`.claude/agents/`）を使い始めた | 「2」に一覧の節を足し、「3.1」の agents の行の「まだ使っていない」を直す |
| `.claude/` に新しいフォルダを作った | `docs/01_全体設計/05_ディレクトリ構成.md` の「1. 全体」。`node` で直接実行するスクリプトなら、`docs/02_共通設計/11_CI.md` の「3.3」（`knip.json` の `ignoreFiles` に `.claude/**` がある）も合っているか見る |
| `AGENTS.md` の書く・書かないの範囲を変えた、`CLAUDE.md` との分け方を変えた | 「1」の表 |
| `AGENTS.md` の「毎回守ること」を変えた | 関係する `docs/` の資料（ルールの本体）。AI に任せないことなら `01_方針・進め方.md` の「4」 |
| `AGENTS.md` の「作業ごとに読むもの」を変えた | 書いた資料と節が実際にあるか（`ls`、`grep "^#"` で確かめる） |
| 作業の流れが変わった（新しい skill を流れの中で使うなど） | `01_方針・進め方.md` の「3. 作業の流れ」 |
| 仕組みの方針そのものを変えた（`.claude/rules/` を使う、読ませ方を変えるなど） | 先にユーザーに確かめ、新しい ADR を書く（ADR-013、ADR-014 の「見直す条件」を見る）。採用済みの ADR は書き換えない |

- `02_仕組み.md` の各節の中身の紹介が変わったら、`docs/05_AI駆動開発/README.md` の表も直す。`05_AI駆動開発` 全体の紹介が変わったら、`docs/README.md` の表も直す
- `CLAUDE.md`・`AGENTS.md` の編集は、権限で必ず確認になる。直す内容をユーザーに見せてから編集する

## 2. 書く

- skill・`CLAUDE.md`・`AGENTS.md` には手順と案内だけを書き、ルールの中身は `docs/` へのリンクにする（写さない。「3.2」）
- 変えた資料ごとに、末尾の変更履歴に 1 行足す（日付と、何をなぜ変えたか）
- `docs/` の節の番号や名前を変えたら、その節を指している所を `grep` で探して直す。`AGENTS.md` の「作業ごとに読むもの」と、skill の本文も探す

```bash
grep -rn "02_仕組み\|01_方針・進め方\|03_レビュー" AGENTS.md CLAUDE.md docs .claude
```

## 3. 仕上げ

- [ ] skill の数と、「2.1」の表・`CLAUDE.md` の案内がそろっているか

```bash
ls .claude/skills
grep -o '^| `[a-z-]*`' docs/05_AI駆動開発/02_仕組み.md
grep -o 'skill `[a-z-]*`' CLAUDE.md
```

- [ ] `settings.json` の `hooks`・`permissions` と、「2.2」「2.3」の表が合っているか（1 つずつ突き合わせる）
- [ ] CI と同じチェックを流す（`.claude/` のスクリプトを変えたとき、`AGENTS.md` の「作業を終える前に」を変えたときは特に）

```bash
pnpm lint && pnpm lint:ls && pnpm typecheck && pnpm test:coverage && pnpm build && pnpm knip
```

- [ ] ユーザーへの報告に、直した資料と、skill・hook・権限の変更は次の会話から効くことを書く
