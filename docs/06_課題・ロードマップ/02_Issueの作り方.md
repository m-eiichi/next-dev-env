# 02 Issue の作り方

GitHub の Issue を作る手順。どこに何を書くか、ラベル、分け方のルールは [README](./README.md)。

作り方は 3 つある。どれで作っても同じ Issue になる。

| 作り方 | 向いているとき |
| ------ | -------------- |
| [1. Claude Code に頼む](#1-claude-code-に頼む) | ふだん。やりたいことを伝えるだけで、雛形に沿った本文・ラベル・親子の案ができる |
| [2. ターミナルで `gh` を使う](#2-ターミナルで-gh-を使う) | 自分で書きたいとき。VS Code から離れずに作れる |
| [3. ブラウザで作る](#3-ブラウザで作る) | `gh` にログインしていないとき。画像を貼りたいとき |

## 1. Claude Code に頼む

やりたいこと・困っていることを、ふだんの言葉で伝える。

```
メモにタグを付けられるようにしたい。Issue にして
TODO の一覧で完了したものを隠したい。大きければ分けて Issue にして
〜の画面で〜すると、エラーになる。Issue にして
```

AI は skill `issue` の手順で、次の順で進める（役割分担は [README](./README.md) の「7」）。

1. 雛形（新機能・改善／不具合）に沿って、タイトル・本文・ラベルの案を見せる
2. 1 つの Pull Request で終わらない大きさなら、親とサブイシューの構成と順序の案も見せる（[README](./README.md) の「3」）
3. 人が OK したら、下の「2」のコマンドで作る（GitHub への書き込みなので、実行のたびに確認が出る）
4. 親の Issue を作ったら、[01 ロードマップ](./01_ロードマップ.md) に足す

## 2. ターミナルで `gh` を使う

先に `gh` へのログインが要る（[README](./README.md) の「6.1」）。

### 2.1 対話形式で作る

```bash
gh issue create
```

```
? Choose a template  → 新機能・改善 / 不具合
? Title              → タイトルを入れる
? Body               → e を押すとエディタが開く。雛形の中身が入っているので、欄を埋めて保存して閉じる
? What's next?       → Submit
```

最後に Issue の URL（`.../issues/12`）が出れば終わり。雛形で付くラベル（`enhancement` / `bug`）は自動で付く。

### 2.2 コマンド 1 行で作る

本文をファイルに書いてから作る。AI が作るときもこの形を使う。

```bash
gh issue create \
  --title "メモにタグを付けられるようにする" \
  --body-file body.md \
  --label enhancement
```

| オプション | 使うとき |
| ---------- | -------- |
| `--label 名前` | ラベルを付ける。複数なら `--label enhancement --label "priority:high"` |
| `--parent 番号` | 親の Issue のサブイシューとして作る |
| `--blocked-by 番号` | 先に終わらせる Issue を指定する（依存関係） |
| `--assignee "@me"` | 自分を担当者にする（対応中のしるし） |
| `--template 名前` | 雛形（`新機能・改善` / `不具合`）の中身から書き始める |
| `--web` | ブラウザの作成画面を開く |

- `body.md` はリポジトリの外（`/tmp` など）に置き、コミットに入れない
- Projects に入れる `--project` は、今のトークンの権限では使えない。入れるならブラウザで行う

### 2.3 親とサブイシューをまとめて作る

親を作ってから、子を `--parent` で付ける。子は着手する順に作ると、親の中でもその順に並ぶ。

```bash
# 親（#20 ができたとする）
gh issue create --title "メモに添付ファイルを付けられるようにする" --body-file parent.md --label enhancement

# 子（#21, #22, #23 ができたとする）
gh issue create --title "添付の資料を書く" --body-file c1.md --label documentation --parent 20
gh issue create --title "ドメイン層・インフラ層に添付を追加" --body-file c2.md --label enhancement --parent 20 --blocked-by 21
gh issue create --title "登録画面で添付できるようにする" --body-file c3.md --label enhancement --parent 20 --blocked-by 22
```

作ったら、[01 ロードマップ](./01_ロードマップ.md) の「1. 進める順序」に親（`#20`）を足す。

### 2.4 作った Issue を見る・直す

```bash
gh issue list                         # 開いている Issue の一覧
gh issue view 12                      # 1 件を読む
gh issue edit 12 --add-label "priority:high"
gh issue close 12                     # 閉じる（ふつうは PR の closes #12 で自動で閉じる）
gh issue close 12 --reason "not planned"  # やらないことにして閉じる
```

## 3. ブラウザで作る

1. リポジトリのページ → **Issues** → **New issue**
2. 雛形（**新機能・改善** / **不具合**）を選ぶ
3. 欄を埋めて **Create** を押す
4. 親の Issue のサブイシューにするなら、親のページで **Add sub-issue** から付ける。先に終わらせる Issue があれば、右の欄の **Relationships** から「blocked by」を付ける

## 4. 作ったあと

- 親の Issue を作ったら、[01 ロードマップ](./01_ロードマップ.md) に足して、コミットする
- 取りかかるときは、Claude Code に「#12 をやって」と頼む（[README](./README.md) の「4」）
- 間違えて作った Issue は `--reason "not planned"` で閉じる。消すには管理者の権限が要るので、ブラウザで Issue のページの **Delete issue** から人が消す

## 5. 変更履歴

| 日付 | 変更内容 | 変更者 |
| ---- | -------- | ------ |
| 2026-10-04 | 新規作成 | |
