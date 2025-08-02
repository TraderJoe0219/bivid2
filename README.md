# Bivid - 高齢者向けスキルシェアプラットフォーム

Bividは、高齢者同士がスキルを教え合い、学び合うためのプラットフォームです。豊富な人生経験を活かして、新しいつながりと学びの機会を提供します。

## 🚀 技術スタック

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + Firebase Functions
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Payment**: Stripe
- **State Management**: Zustand
- **Deployment**: Vercel

## 📋 セットアップ手順

### 1. プロジェクトのクローンと依存関係のインストール

```bash
git clone <repository-url>
cd bivid2
npm install
```

### 2. 環境変数の設定

`.env.example`を`.env.local`にコピーして、必要な値を設定してください：

```bash
cp .env.example .env.local
```

### 3. Firebase プロジェクトの設定

1. [Firebase Console](https://console.firebase.google.com/)でプロジェクトを作成
2. Authentication を有効化（Email/Password、Google認証）
3. Firestore Database を作成
4. Storage を設定
5. プロジェクト設定から設定値を取得し、`.env.local`に記入

### 4. Stripe アカウントの設定

1. [Stripe Dashboard](https://dashboard.stripe.com/)でアカウント作成
2. API キーを取得し、`.env.local`に記入
3. Webhook エンドポイントを設定

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認してください。

## 🎯 主要機能

### 現在実装済み
- ✅ 高齢者向けアクセシブルなUI/UX
- ✅ レスポンシブデザイン
- ✅ Firebase設定
- ✅ TypeScript型定義
- ✅ 状態管理（Zustand）

### 実装予定
- 🔄 ユーザー認証（Firebase Auth）
- 🔄 スキル検索・閲覧機能
- 🔄 スキル登録・編集機能
- 🔄 予約・決済システム（Stripe）
- 🔄 メッセージング機能
- 🔄 レビュー・評価システム
- 🔄 プロフィール管理

## 🎨 デザイン方針

### 高齢者向けUX/UI
- **大きなフォントサイズ**: 基本18px、見出しはさらに大きく
- **高コントラスト**: 読みやすい色の組み合わせ
- **タッチフレンドリー**: 最小44pxのタッチターゲット
- **シンプルなナビゲーション**: 迷わない直感的な構造
- **明確なフィードバック**: 操作結果が分かりやすい

### カラーパレット
- **Primary**: 青系（#4299e1）- 信頼感と安心感
- **Success**: 緑系（#48bb78）- 成功・完了
- **Warning**: オレンジ系（#ed8936）- 注意
- **Error**: 赤系（#f56565）- エラー・警告

## 📁 プロジェクト構造

```
src/
├── app/                 # Next.js App Router
│   ├── globals.css     # グローバルスタイル
│   ├── layout.tsx      # ルートレイアウト
│   └── page.tsx        # ホームページ
├── components/         # 再利用可能なコンポーネント
├── lib/               # ユーティリティ・設定
│   └── firebase.ts    # Firebase設定
├── store/             # Zustand状態管理
│   └── authStore.ts   # 認証状態
├── types/             # TypeScript型定義
│   └── index.ts       # 共通型定義
└── hooks/             # カスタムフック
```

## 🚀 デプロイ

### Vercel へのデプロイ

1. Vercelアカウントを作成
2. GitHubリポジトリを連携
3. 環境変数を設定
4. 自動デプロイを有効化

```bash
npm run build
npm run start
```

## 🤝 開発ガイドライン

### コーディング規約
- TypeScriptの厳密な型チェックを使用
- ESLint + Prettierでコード品質を維持
- コンポーネントは関数型で実装
- 高齢者向けアクセシビリティを常に考慮

### コミット規約
```
feat: 新機能追加
fix: バグ修正
docs: ドキュメント更新
style: スタイル変更
refactor: リファクタリング
test: テスト追加・修正
```

## 📞 サポート

質問や問題がある場合は、以下の方法でお問い合わせください：

- GitHub Issues
- メール: support@bivid.com

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。
