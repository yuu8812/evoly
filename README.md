# Evoly

**Evoly** は、AIエージェントとユーザーの関係性を育成していく、育成型Webアプリケーションです。TypeScriptや最新のフレームワーク群を用いてモダンな構成で開発されています。

---

## 🔧 技術スタック

このリポジトリは**モノレポ構成**で、以下の技術を採用しています。

### パッケージ構成（`packages/`）
- `@evoly/db`: **Drizzle ORM** を使ったPostgreSQLデータベース接続ロジック
- `@evoly/domain`: ドメイン層のサービス定義
- `@evoly/shared`: 共通ユーティリティ・型などの管理

### アプリケーション（`apps/`）
- `web`: ユーザー向けの **Next.js** フロントエンド
- `hono`: バックエンドAPI（**Hono × Bun** 使用）

---

## 📦 セットアップ方法

```bash
# リポジトリをクローン
git clone https://github.com/yuu8812/evoly.git
cd evoly

# パッケージインストール
bun install

# 開発サーバー起動（例: web フロントエンド）
bun dev
