# 06_課題・ロードマップ

**これからやること**（課題、新機能、改善）の管理のしかたと、大きな流れ（ロードマップ）を置くフォルダ（[ADR-018](../04_設計判断/ADR-018_課題をGitHubIssuesで管理する.md)）。

課題そのもの（中身・状態・親子・依存）は **GitHub Issues** に書く。ここには、Issues の使い方のルールと、まとまりの順序だけを書く。同じことを両方に書かない。

| ファイル | 内容 |
| -------- | ---- |
| [01 ロードマップ](./01_ロードマップ.md) | 大きなまとまり（親の Issue）の順序と目的。各課題の状態は書かない |
| [02 Issue の作り方](./02_Issueの作り方.md) | Issue を作る手順（Claude Code に頼む、`gh`、ブラウザ）。親とサブイシューのまとめ方 |
| [.github/ISSUE_TEMPLATE/](../../.github/ISSUE_TEMPLATE/) | Issue を作るときの雛形（新機能・不具合） |

決まった仕様と設計は、今までどおり 00〜03 に書く。Issue に取りかかるときに、00〜03 の資料を先に更新する。

## 1. どこに何を書くか

| 書くこと | 置き場所 |
| -------- | -------- |
| 課題の背景・やること・完了の条件 | Issue の本文 |
| 状態 | Issue の Open / Closed。対応中は担当者（Assignees）を付ける。件数が増えたら GitHub Projects の列（Todo / In Progress / Done）も使う |
| 種類・優先度 | ラベル（下の「2」） |
| 大きな課題のまとまり | 親の Issue とサブイシュー |
| 着手の順序 | 親の Issue の中のサブイシューの並び順、依存関係（blocked by）。まとまり同士の順序は [01 ロードマップ](./01_ロードマップ.md) |
| リリースごとのまとまり | Milestone（使うときだけ） |
| 決めたことの理由 | 方針に関わるものは ADR（[04_設計判断](../04_設計判断/README.md)）。ADR から Issue へリンクする |

## 2. ラベル

| ラベル | 使うとき |
| ------ | -------- |
| `enhancement` | 新機能・機能の変更（使う人から見て変わるもの） |
| `bug` | 不具合 |
| `improvement` | コードや仕組みの整理（使う人から見て変わらないもの） |
| `documentation` | 資料だけ |
| `priority:high` | 先にやるもの。付けなければ通常 |

- `enhancement`・`bug`・`documentation` は GitHub に最初からあるラベル。`improvement`・`priority:high` は、このプロジェクトで足した
- 最初からあるほかのラベル（`duplicate`、`wontfix`、`question` など）も、意味どおりに使ってよい
- ラベルを足したら、この表にも足す

## 3. 大きな課題を分ける

1 つの Issue は、**1 回の作業（1 つの Pull Request）で終わる大きさ**にする。大きいときは、親とサブイシューに分ける。

| | 書くこと |
| -- | -------- |
| 親の Issue | 目的（なぜやるか）、全体の完了の条件。子はサブイシューとして付け、着手する順に並べる |
| 子の Issue（サブイシュー） | この Issue でやること、完了の条件。先に終わらせる Issue があれば依存関係（blocked by）を付ける |

- 子は、層の構成（資料 → ドメイン層 → インフラ層 → アプリケーション層 → 入口・画面）に沿って分けると分けやすい（skill `add-feature` の順番と同じ）
- 子の子は作らない（2 段まで）。さらに分けたくなったら、親を 2 つに分ける
- 親の Issue を作ったら、[01 ロードマップ](./01_ロードマップ.md) に足す
- AI が分けるときは、親子の構成と順序の案を示し、人が OK してから Issue を作る

## 4. Issue に取り組む

1. Issue を読み、依存している Issue が閉じているかを確かめる。閉じていなければ、人に伝える
2. 作業する（00〜03 の資料の更新 → 実装 → テスト。ふだんの作業の流れと同じ。[01 方針・進め方](../05_AI駆動開発/01_方針・進め方.md) の「3」）
3. コミットメッセージの 1 行目の最後に `(#12)` を付ける（[08 コーディング規約](../02_共通設計/08_コーディング規約.md) の「5.1」）
4. Pull Request の本文に `closes #12` と書く。マージすると Issue が閉じる。Pull Request を使わずに `main` に直接入れたときは、Issue を手で閉じる
5. 親の Issue は、サブイシューがすべて閉じたら閉じる。まとまりが終わったら、[01 ロードマップ](./01_ロードマップ.md) の「完了したもの」に移す

## 5. つながりをたどる

| たどりたいもの | 方法 |
| -------------- | ---- |
| Issue → 変更 | Issue のページに、`#12` を書いたコミットと Pull Request が並ぶ。`git log --oneline --grep "#12"` でも探せる |
| 変更 → Issue | `git log` / `git blame` でコミットを見つけ、メッセージの `#12` から Issue（なぜ変えたか）を開く |

## 6. AI が Issues を読む・書く

- AI は `gh`（GitHub CLI）で Issues を読む（`gh issue list`、`gh issue view 12`）。`gh` が使えないときは、人に Issue の内容を貼ってもらう
- Issue の作成・編集・コメント・クローズは GitHub への書き込みなので、AI は中身を見せて人の OK をもらってから行う
- 読むだけのコマンド（`gh issue list` / `gh issue view`）は確認なしで動く。書き込むコマンドは実行のたびに確認が出る（[02 仕組み](../05_AI駆動開発/02_仕組み.md) の「2.3」）。確認が出たら「GitHub に書き込む操作だ」と思って中身を見る。AI はトークンを読めない

### 6.1 `gh` にログインする

`gh` は開発用コンテナに入っている（`.devcontainer/devcontainer.json` の `features`）。ログイン情報はコンテナの中にだけ置き、ボリュームに残さない。**コンテナを作り直したら、ログインし直す**（VS Code の開き直しや PC の再起動では要らない）。

1. GitHub の Settings → Developer settings → Fine-grained personal access tokens で、トークンを作る
   - Token name: `next-dev-env-devcontainer-issues`（どのリポジトリで、どこで、何に使うかが分かる名前）
   - Expiration: 90 日くらい。期限が近づくとメールが届くので、そのときに作り直す（Regenerate token）
   - Repository access: このリポジトリだけ
   - Permissions: Issues を Read and write（Metadata の Read は自動で付く）。ラベルの作成もこの権限でできる
2. トークンをパスワード管理ツールなどに保存する（作り直しのたびに使う）
3. ターミナルで `gh auth login` を実行し、次のように選ぶ

```
? Where do you use GitHub?                       → GitHub.com
? What is your preferred protocol for Git?       → HTTPS
? Authenticate Git with your GitHub credentials? → No
? How would you like to authenticate GitHub CLI? → Paste an authentication token
? Paste your authentication token:               ← トークンを貼って Enter
```

4. `gh auth status` で `Logged in to github.com account ...` と出れば終わり

- 「Authenticate Git with your GitHub credentials?」は **No** にする。Yes にすると `git push` にもこのトークンが使われ、Issues の権限しかないので push が失敗するようになる
- 「Login with a web browser」は選ばない。すべてのリポジトリを書き換えられる広い権限のトークンになる
- `gh auth login --with-token` でも入れられるが、何も表示されずに入力を待つので分かりにくい（トークンを貼って Enter、続けて Ctrl+D）
- トークンを AI との会話に貼らない。ターミナルで人が入力する

## 7. 人と AI の役割分担

何をやるか・どの順でやるかは人が決める。Issue とロードマップを書く作業は、AI に任せてよい（skill `issue`）。

| 場面 | 誰が | どうする |
| ---- | ---- | -------- |
| 思いついたことを残す | 人（AI に頼んでもよい） | Issue を作るだけでよい。親を持たない Issue なら、ロードマップは直さない（[02 Issue の作り方](./02_Issueの作り方.md)） |
| 大きな課題を分ける | AI が案、人が決める | AI が親子・順序・ロードマップのどこに入れるかの案を見せる → OK で、Issue の作成とロードマップの追加を同じ作業で行う |
| 次に何をやるか | AI が案、人が決める | 「次は何？」と聞く。AI は先にずれを確かめてから、ロードマップと Issues を見て候補を挙げる |
| ずれを直す（棚卸し） | AI が見つけ、人が決める | 「課題を棚卸しして」と頼む。AI が Issues とロードマップを比べ、ずれと直し方の案を出す。人がブラウザで作った Issue も、ここで拾う |

- 人が手で Issue を作ってもよい。ロードマップとのずれは、「次は何？」と棚卸しで後から直す
- skill は指示なので、AI が手順を飛ばすこともある。ずれに気づいたら棚卸しを頼む

## 8. 変更履歴

| 日付 | 変更内容 | 変更者 |
| ---- | -------- | ------ |
| 2026-10-03 | 新規作成 | |
| 2026-10-04 | 「6.1 `gh` にログインする」を追加（権限を絞ったトークンを使い、ログイン情報はボリュームに残さない） | |
| 2026-10-04 | 「2」のラベルを GitHub の既定のもの（`enhancement`・`documentation`）に合わせた。「6.1」を、実際に通った対話形式のログインの手順に書き換えた | |
| 2026-10-04 | 表に [02 Issue の作り方](./02_Issueの作り方.md) を追加 | |
| 2026-10-04 | 「7. 人と AI の役割分担」を追加（skill `issue`）。「6」に、読むだけの `gh` のコマンドは確認なしにしたことを追加 | |
