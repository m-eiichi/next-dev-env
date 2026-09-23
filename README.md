# nextjs-template-app

Next.js（App Router）のアプリケーションテンプレート。Dev Container の中で開発する。

- 技術スタックの一覧: [docs/01_全体設計/02_システム構成.md](docs/01_全体設計/02_システム構成.md)
- 設計資料の入口: [docs/README.md](docs/README.md)

## 必要なもの

| もの | 用途 |
| ---- | ---- |
| Docker（Docker Desktop など） | コンテナを動かす |
| VS Code | エディタ |
| VS Code の拡張機能 [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) | コンテナの中で VS Code を開く |

Node.js、pnpm、Claude Code はコンテナに入っているので、手元の PC に入れる必要はない。

## 始め方

1. このリポジトリを clone し、VS Code で開く
2. コマンドパレット（`Cmd+Shift+P` / `Ctrl+Shift+P`）から **Dev Containers: Reopen in Container** を実行する（初回はイメージの作成に数分かかる）
3. コンテナの中のターミナルで、依存パッケージをインストールする

   ```bash
   pnpm install
   ```

4. 環境変数のファイルを作る（必要な変数は `.env.example` を参照）

   ```bash
   cp .env.example .env.local
   ```

5. 開発サーバーを起動する

   ```bash
   pnpm dev
   ```

6. ブラウザで http://localhost:3000 を開く

以降のコマンドは、すべて**コンテナの中のターミナル**で実行する。

### 補足

- Git の認証情報（`~/.gitconfig`、SSH agent）は、VS Code が手元の PC からコンテナに引き継ぐ。手元で `git push` できれば、コンテナの中からもできる
- Claude Code のログイン情報は Docker のボリューム（`claude-config`）に保存されるので、コンテナを作り直してもログインし直さなくてよい
- `.devcontainer/` を変えたら、コマンドパレットから **Dev Containers: Rebuild Container** を実行する

## よく使うコマンド

| コマンド | 内容 |
| -------- | ---- |
| `pnpm dev` | 開発サーバーを起動する |
| `pnpm build` | 本番用にビルドする |
| `pnpm start` | ビルドしたものを起動する |
| `pnpm lint` | ESLint でコードをチェックする |
| `pnpm lint:ls` | ファイル名・フォルダ名のルールをチェックする（ls-lint） |
| `pnpm typecheck` | 型をチェックする |
| `pnpm test` | テストを watch モードで実行する |
| `pnpm test:coverage` | テストを 1 回実行し、カバレッジも確認する |
| `pnpm knip` | 使っていないファイル・export・依存を探す |
| `pnpm shadcn:add <atoms\|molecules> <名前>` | shadcn/ui の部品を追加する（例: `pnpm shadcn:add atoms button`） |

Pull Request を出す前に、CI と同じチェックを手元で実行しておく。

```bash
pnpm lint && pnpm lint:ls && pnpm typecheck && pnpm test:coverage && pnpm build
```

## 開発の流れ

1. `main` から作業ブランチを作る（`feature/xxx`, `fix/xxx`）
2. 実装する。ルールは [docs/](docs/README.md) を参照
3. Pull Request を作る。CI（Lint、型チェック、テスト、ビルド）が自動で実行される
4. CI が通り、レビューを受けてからマージする

詳しくは [08 コーディング規約](docs/02_共通設計/08_コーディング規約.md) と [11 CI](docs/02_共通設計/11_CI.md) を参照。

## ディレクトリ構成（概要）

```
.
├── .devcontainer/       開発用コンテナの設定
├── .github/workflows/   CI の設定
├── docs/                要件定義・設計資料
├── public/              静的ファイル
├── scripts/             開発用のスクリプト（shadcn:add など）
└── src/
    ├── app/             ルーティング（page / layout / Server Action など）
    ├── components/      複数の画面で使うコンポーネント（atoms / molecules / organisms）
    ├── application/     ユースケース、DTO
    ├── domain/          エンティティ、値オブジェクト、リポジトリのインターフェース
    └── infrastructure/  DB・認証の実装、DI コンテナ
```

詳しくは [05 ディレクトリ構成](docs/01_全体設計/05_ディレクトリ構成.md) と [06 アーキテクチャ](docs/01_全体設計/06_アーキテクチャ.md) を参照。

## テンプレートから新しいプロジェクトを始めるとき

1. `package.json` の `name` をプロジェクト名に変える
2. `.devcontainer/devcontainer.json` の `name` を変える
3. `components.json` がなければ `pnpm shadcn init` を実行する（[05 ディレクトリ構成](docs/01_全体設計/05_ディレクトリ構成.md) の「2.3」）
4. GitHub のブランチ保護を設定する（[11 CI](docs/02_共通設計/11_CI.md) の「4. GitHub 側の設定」）
5. [docs/00_要件定義/01_概要.md](docs/00_要件定義/01_概要.md) から資料を埋めていく
