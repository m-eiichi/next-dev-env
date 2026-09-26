@AGENTS.md

<!--
  どの AI にも共通のルールは AGENTS.md に書く（Claude Code 以外の AI ツールも AGENTS.md を読むため）。
  このファイルには、上の 1 行と、Claude Code だけの仕組み（skill、hook）の話だけを書く。
  説明は docs/05_AI駆動開発/02_仕組み.md
-->

## Claude Code の設定（`.claude/`）

- 新しい画面や、画面に出すデータを追加するときは、skill `add-feature`（`.claude/skills/add-feature/SKILL.md`）の手順に沿う
- 実装の見本（メモ・TODO など）を消すときは、skill `remove-sample`（`.claude/skills/remove-sample/SKILL.md`）の手順に沿う
- 画面を作った・変えた後に動くかを確かめるときは、skill `app-check`（`.claude/skills/app-check/SKILL.md`）の手順に沿う
- 画面に出す言葉（画面名、用語）を変えるときは、skill `rename-term`（`.claude/skills/rename-term/SKILL.md`）の手順に沿う
- コミットを頼まれたときは、skill `commit`（`.claude/skills/commit/SKILL.md`）の手順に沿う
- ファイルを編集するたびに、hook が `src/` の `.ts` / `.tsx` に ESLint をかける。エラーを伝えられたら、その場で直す
