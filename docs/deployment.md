# Bivid デプロイガイド

## 🚀 本番環境デプロイ手順

### 1. 前提条件

- Firebase プロジェクトが作成済み
- Vercel アカウントが作成済み
- GitHub リポジトリが作成済み
- `.env.local` ファイルが正しく設定済み

### 2. Firebase 設定

#### 2.1 Firestore ルールとインデックスのデプロイ

```bash
# Firebase CLI にログイン
firebase login

# プロジェクトを初期化（既に完了している場合はスキップ）
firebase init

# ルールとインデックスをデプロイ
firebase deploy --only firestore:rules,firestore:indexes,storage
```

#### 2.2 初期データの投入

```bash
# 環境変数を設定してからシードスクリプトを実行
npm run seed
```

### 3. Vercel デプロイ

#### 3.1 Vercel CLI を使用した手動デプロイ

```bash
# Vercel CLI をインストール
npm install -g vercel

# Vercel にログイン
vercel login

# プロジェクトをデプロイ
vercel

# 本番環境にデプロイ
vercel --prod
```

#### 3.2 Vercel ダッシュボードでの設定

1. [Vercel ダッシュボード](https://vercel.com/dashboard) にアクセス
2. 「New Project」をクリック
3. GitHub リポジトリを選択
4. 環境変数を設定：

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### 4. GitHub Actions 設定

#### 4.1 GitHub Secrets の設定

GitHub リポジトリの Settings > Secrets and variables > Actions で以下を設定：

```
VERCEL_ORG_ID=team_xxxxx
VERCEL_PROJECT_ID=prj_xxxxx
VERCEL_TOKEN=your_vercel_token
FIREBASE_TOKEN=your_firebase_token
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

#### 4.2 Vercel トークンの取得

```bash
# Vercel トークンを生成
vercel login
vercel --token
```

#### 4.3 Firebase トークンの取得

```bash
# Firebase トークンを生成
firebase login:ci
```

### 5. ドメイン設定

#### 5.1 カスタムドメインの設定

1. Vercel ダッシュボードでプロジェクトを選択
2. Settings > Domains に移動
3. カスタムドメインを追加
4. DNS レコードを設定

#### 5.2 SSL 証明書

Vercel が自動的に Let's Encrypt SSL 証明書を発行します。

### 6. 環境別設定

#### 6.1 開発環境

```bash
# 開発サーバーを起動
npm run dev
```

#### 6.2 ステージング環境

```bash
# プレビューデプロイ
vercel
```

#### 6.3 本番環境

```bash
# 本番デプロイ
vercel --prod
```

### 7. 監視とログ

#### 7.1 Vercel Analytics

1. Vercel ダッシュボードで Analytics を有効化
2. パフォーマンス指標を監視

#### 7.2 Firebase Analytics

1. Firebase コンソールで Analytics を有効化
2. ユーザー行動を追跡

#### 7.3 エラー監視

```bash
# ログを確認
vercel logs
firebase functions:log
```

### 8. セキュリティ設定

#### 8.1 CORS 設定

Firebase Functions で CORS を設定：

```javascript
const cors = require('cors')({
  origin: ['https://your-domain.vercel.app'],
  credentials: true,
});
```

#### 8.2 CSP ヘッダー

`next.config.js` でセキュリティヘッダーを設定：

```javascript
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.stripe.com https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com;",
  },
];
```

### 9. パフォーマンス最適化

#### 9.1 画像最適化

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
    formats: ['image/webp', 'image/avif'],
  },
};
```

#### 9.2 キャッシュ設定

```javascript
// Vercel の Edge Functions を使用
export const config = {
  runtime: 'edge',
};
```

### 10. トラブルシューティング

#### 10.1 よくある問題

1. **環境変数が読み込まれない**
   - `.env.local` ファイルの形式を確認
   - Vercel ダッシュボードで環境変数を再設定

2. **Firebase 接続エラー**
   - Firebase プロジェクト ID を確認
   - サービスアカウントキーの形式を確認

3. **ビルドエラー**
   - TypeScript エラーを修正
   - 依存関係を更新

#### 10.2 ログ確認コマンド

```bash
# Vercel ログ
vercel logs

# Firebase ログ
firebase functions:log

# ローカルログ
npm run dev
```

### 11. 本番運用チェックリスト

- [ ] Firebase セキュリティルールが適用済み
- [ ] Stripe webhook が設定済み
- [ ] SSL 証明書が有効
- [ ] カスタムドメインが設定済み
- [ ] 環境変数がすべて設定済み
- [ ] Analytics が有効化済み
- [ ] エラー監視が設定済み
- [ ] バックアップ戦略が確立済み
- [ ] 負荷テストが完了済み

### 12. 緊急時対応

#### 12.1 ロールバック手順

```bash
# 前のデプロイメントにロールバック
vercel rollback
```

#### 12.2 メンテナンスモード

```javascript
// pages/maintenance.tsx を作成してリダイレクト
export default function Maintenance() {
  return <div>メンテナンス中です</div>;
}
```

---

## 📞 サポート

デプロイに関する問題が発生した場合は、以下を確認してください：

1. [Vercel ドキュメント](https://vercel.com/docs)
2. [Firebase ドキュメント](https://firebase.google.com/docs)
3. [Next.js ドキュメント](https://nextjs.org/docs)

緊急時は GitHub Issues でお知らせください。
