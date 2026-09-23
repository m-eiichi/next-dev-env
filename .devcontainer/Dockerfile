# Node.jsベースイメージ
FROM node:24-slim

# 必要なツールをインストール
RUN apt-get update && apt-get install -y \
    git \
    vim \
    curl \
    sudo \
    ca-certificates \
    postgresql-common \
    && /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh -y \
    && apt-get update \
    && apt-get install -y postgresql-client-17 \
    && rm -rf /var/lib/apt/lists/*

# vscodeユーザーの作成（sudo権限付き）
# ベースイメージのnodeユーザー（UID 1000）を削除し、同じUIDでvscodeユーザーを作成する
# ※Linux/WSLホストではUIDが揃うため、bind mountの所有権の衝突も防げる
RUN userdel -r node 2>/dev/null || true \
    && groupdel node 2>/dev/null || true \
    && useradd -u 1000 -m -s /bin/bash vscode \
    && echo "vscode ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# 作業ディレクトリ
WORKDIR /workspace

# pnpmとClaude Codeをグローバルインストール（rootとして）
RUN npm install -g pnpm @anthropic-ai/claude-code

# ロケール設定
ENV LANG=C.UTF-8

# デフォルトユーザーをvscodeに変更
USER vscode

# Claude Codeの設定保存先（ボリュームがvscode所有になるよう事前に作成）
RUN mkdir -p /home/vscode/.claude
