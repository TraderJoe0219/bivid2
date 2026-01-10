# 🚀 Vercel環境変数設定ガイド（決定版）

## 📋 このガイドについて

このガイドでは、VercelでBividアプリを正しくデプロイするための環境変数設定手順を説明します。

## ✅ 事前確認

ローカル環境では正常に動作していることを確認してください：
```bash
npm run dev
# http://localhost:3002 で動作確認
```

## 🔧 ステップ1: Vercel Dashboardにアクセス

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセスしてログイン
2. `bivid2` プロジェクト（または該当するプロジェクト名）を選択
3. **Settings** タブをクリック
4. 左メニューから **Environment Variables** を選択

## 📝 ステップ2: 環境変数を設定

以下の環境変数を **すべて** 追加してください。

### 🔥 Firebase Configuration（必須）

| 変数名 | 値 | 環境 |
|--------|-----|------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyBhyNvJotiFG_x9UIHEshJRCOulmWZvrqE` | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `bivid-windsurf.firebaseapp.com` | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `bivid-windsurf` | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `bivid-windsurf.appspot.com` | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `468256497062` | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:468256497062:web:59284e048bfbb6feb6c367` | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | `G-4T730PYWCV` | Production, Preview, Development |

### 🔐 Firebase Admin（サーバーサイド）

| 変数名 | 値 | 環境 |
|--------|-----|------|
| `FIREBASE_ADMIN_PROJECT_ID` | `bivid-windsurf` | Production, Preview, Development |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | `firebase-adminsdk-fbsvc@bivid-windsurf.iam.gserviceaccount.com` | Production, Preview, Development |
| `FIREBASE_ADMIN_PRIVATE_KEY` | *(下記参照)* | Production, Preview, Development |

**FIREBASE_ADMIN_PRIVATE_KEY の設定方法:**
```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDCN...
（中略）
...YqV2DSI=
-----END PRIVATE KEY-----
```
⚠️ **重要**: 改行を含む全体を `""` で囲んで設定してください

### 🗺️ Google Maps API

| 変数名 | 値 | 環境 |
|--------|-----|------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | `AIzaSyCyQq4tsI2BSFrvwlmmG_DmWbGk9lnjx0Y` | Production, Preview, Development |

### 💳 Stripe（決済機能用）

⚠️ **セキュリティのため、実際のStripe APIキーは `.env.local` ファイルから取得してください**

| 変数名 | 値の取得場所 | 環境 |
|--------|-----|------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `.env.local` ファイルの値をコピー | Production, Preview, Development |
| `STRIPE_SECRET_KEY` | `.env.local` ファイルの値をコピー | Production, Preview, Development |
| `STRIPE_WEBHOOK_SECRET` | `.env.local` ファイルの値をコピー | Production, Preview, Development |

**取得方法:**
```bash
# プロジェクトのルートディレクトリで実行
cat .env.local | grep STRIPE
```

### 🔧 Application Settings

| 変数名 | 値 | 環境 |
|--------|-----|------|
| `NEXT_PUBLIC_APP_URL` | `https://your-vercel-url.vercel.app` | Production のみ |
| `NEXTAUTH_URL` | `https://your-vercel-url.vercel.app` | Production のみ |
| `NEXTAUTH_SECRET` | `.env.local` ファイルの値をコピー | Production, Preview, Development |

⚠️ `NEXT_PUBLIC_APP_URL` と `NEXTAUTH_URL` は実際のVercel URLに置き換えてください

## 📸 設定画面の例

各環境変数を追加する際:
1. **Name**: 変数名を入力（例: `NEXT_PUBLIC_FIREBASE_API_KEY`）
2. **Value**: 上記の値を正確にコピー&ペースト
3. **Environment**: `Production`, `Preview`, `Development` **全てにチェック**
4. **Add** ボタンをクリック

## 🔄 ステップ3: 再デプロイ

環境変数を設定したら、必ず再デプロイが必要です。

### 方法A: Vercel Dashboardから

1. **Deployments** タブに移動
2. 最新のデプロイメントの右側にある **⋯** メニューをクリック
3. **Redeploy** を選択
4. **Redeploy** ボタンをクリックして確定

### 方法B: Gitプッシュで再デプロイ

```bash
# 空コミットで強制再デプロイ
git commit --allow-empty -m "fix: Vercel環境変数設定のための再デプロイ"
git push origin main
```

## ✅ ステップ4: 動作確認

### 1. 診断APIで確認

デプロイが完了したら、以下のURLにアクセス：
```
https://your-vercel-url.vercel.app/api/deploy-check
```

**期待されるレスポンス:**
```json
{
  "status": "OK",
  "message": "すべての環境変数が正しく設定されています",
  "checks": {
    "allConfigured": true,
    "apiKeyValid": true
  }
}
```

### 2. アプリケーションで確認

1. Vercel URLにアクセス
2. トップページが正常に表示されることを確認
3. ログインページに移動（[/login](https://your-vercel-url.vercel.app/login)）
4. Googleログインボタンをクリック
5. エラーなく認証フローが開始されることを確認

## 🚨 トラブルシューティング

### エラー: `auth/api-key-not-valid`

**原因**: Firebase APIキーが正しく設定されていない

**解決方法**:
1. Vercel Dashboard → Settings → Environment Variables
2. `NEXT_PUBLIC_FIREBASE_API_KEY` の値を確認
3. 値に余分なスペースや改行がないか確認
4. 正しい値: `AIzaSyBhyNvJotiFG_x9UIHEshJRCOulmWZvrqE`
5. 環境が `Production`, `Preview`, `Development` 全てに設定されているか確認
6. 再デプロイ

### エラー: `/api/deploy-check` が404

**原因**: 再デプロイが完了していない

**解決方法**:
1. Deployments タブで最新のデプロイメントのステータスを確認
2. "Ready" になるまで待機（通常1-3分）
3. 再度アクセス

### エラー: `status: "ERROR"` が返ってくる

**原因**: 一部の環境変数が未設定または無効

**解決方法**:
1. `/api/deploy-check` のレスポンスを確認
2. `recommendations` フィールドに表示される指示に従う
3. 該当する環境変数を設定
4. 再デプロイ

### Firebase Admin Private Keyのエラー

**原因**: 改行コードが正しく設定されていない

**解決方法**:
1. Private Key全体を `"` で囲む
2. `\n` が改行として認識されるように設定
3. 例: `"-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"`

## 📚 参考資料

- [Firebase Console](https://console.firebase.google.com/)
- [Vercel Environment Variables Documentation](https://vercel.com/docs/concepts/projects/environment-variables)
- [Google Cloud Console](https://console.cloud.google.com/)

## 🎯 チェックリスト

デプロイ前に以下を確認してください：

- [ ] すべてのFirebase環境変数が設定されている
- [ ] すべての環境変数が `Production`, `Preview`, `Development` に設定されている
- [ ] `NEXT_PUBLIC_APP_URL` が実際のVercel URLに設定されている
- [ ] 再デプロイが完了している
- [ ] `/api/deploy-check` で `"status": "OK"` が返ってくる
- [ ] アプリケーションが正常に表示される
- [ ] ログイン機能が動作する

---

**最終更新日**: 2026年1月10日
**問題が解決しない場合**: プロジェクトの `.env.local` ファイルとVercel設定を比較確認してください
