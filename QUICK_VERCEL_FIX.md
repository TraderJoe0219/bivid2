# ⚡ Vercel Firebase APIキーエラー - クイック修正ガイド

## 🎯 このガイドは何？

Vercelデプロイで `auth/api-key-not-valid` エラーが出ている場合の**最速修正手順**です。

## ⏱️ 所要時間: 5-10分

---

## 📋 ステップ1: Vercelプロジェクトを確認

1. https://vercel.com/dashboard にアクセス
2. プロジェクト一覧から `bivid2` を選択
3. 現在のVercel URLをメモ（例: `https://bivid2-xxx.vercel.app`）

---

## 🔧 ステップ2: 環境変数を設定

### 2-1. Vercel Dashboard で設定画面を開く

1. プロジェクトページで **Settings** タブをクリック
2. 左メニューから **Environment Variables** をクリック

### 2-2. 必須の環境変数を追加

以下の **すべて** を追加してください。各変数は `Production`, `Preview`, `Development` **全て** にチェック。

#### 🔥 Firebase設定（コピー&ペースト）

```
Name: NEXT_PUBLIC_FIREBASE_API_KEY
Value: AIzaSyBhyNvJotiFG_x9UIHEshJRCOulmWZvrqE
Environments: ✅ Production ✅ Preview ✅ Development

Name: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
Value: bivid-windsurf.firebaseapp.com
Environments: ✅ Production ✅ Preview ✅ Development

Name: NEXT_PUBLIC_FIREBASE_PROJECT_ID
Value: bivid-windsurf
Environments: ✅ Production ✅ Preview ✅ Development

Name: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
Value: bivid-windsurf.appspot.com
Environments: ✅ Production ✅ Preview ✅ Development

Name: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
Value: 468256497062
Environments: ✅ Production ✅ Preview ✅ Development

Name: NEXT_PUBLIC_FIREBASE_APP_ID
Value: 1:468256497062:web:59284e048bfbb6feb6c367
Environments: ✅ Production ✅ Preview ✅ Development

Name: NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
Value: G-4T730PYWCV
Environments: ✅ Production ✅ Preview ✅ Development
```

#### 🗺️ Google Maps

```
Name: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
Value: AIzaSyCyQq4tsI2BSFrvwlmmG_DmWbGk9lnjx0Y
Environments: ✅ Production ✅ Preview ✅ Development
```

#### 💳 Stripe（.env.localから取得）

```bash
# ローカルで実行して値を取得
cat .env.local | grep STRIPE
```

取得した値を以下の変数に設定：
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

#### 🔐 Firebase Admin（.env.localから取得）

```bash
# ローカルで実行して値を取得
cat .env.local | grep FIREBASE_ADMIN
```

取得した値を以下の変数に設定：
- `FIREBASE_ADMIN_PROJECT_ID`
- `FIREBASE_ADMIN_CLIENT_EMAIL`
- `FIREBASE_ADMIN_PRIVATE_KEY` ⚠️ 改行を含む全体を `""` で囲む

#### ⚙️ その他

```
Name: NEXT_PUBLIC_APP_URL
Value: https://your-vercel-url.vercel.app （実際のURLに変更）
Environments: ✅ Production のみ

Name: NEXTAUTH_URL
Value: https://your-vercel-url.vercel.app （実際のURLに変更）
Environments: ✅ Production のみ
```

`.env.local` から取得：
```bash
cat .env.local | grep NEXTAUTH_SECRET
```

---

## 🔄 ステップ3: 再デプロイ

### 方法A: Vercel Dashboardから（推奨）

1. **Deployments** タブに移動
2. 最新のデプロイメントの右側 **⋯** をクリック
3. **Redeploy** を選択
4. 確認ダイアログで **Redeploy** をクリック
5. デプロイ完了を待つ（1-3分）

### 方法B: コマンドラインから

```bash
git commit --allow-empty -m "fix: Vercel環境変数設定のための再デプロイ"
git push origin main
```

---

## ✅ ステップ4: 動作確認

### 4-1. 診断APIで確認

ブラウザで以下のURLを開く：
```
https://your-vercel-url.vercel.app/api/deploy-check
```

**正常な場合:**
```json
{
  "status": "OK",
  "message": "すべての環境変数が正しく設定されています"
}
```

**エラーの場合:**
- `recommendations` フィールドを確認
- 指示に従って不足している変数を追加
- 再デプロイ

### 4-2. アプリで確認

1. `https://your-vercel-url.vercel.app` にアクセス
2. トップページが表示されることを確認
3. ログインページ (`/login`) にアクセス
4. Googleログインボタンをクリック
5. エラーが出ないことを確認

---

## 🚨 トラブルシューティング

### Q1: `/api/deploy-check` が404エラー

**A:** デプロイがまだ完了していません。1-2分待ってから再度アクセスしてください。

### Q2: `status: "ERROR"` が返ってくる

**A:** レスポンスの `recommendations` を確認し、指示に従って環境変数を追加してください。

### Q3: 環境変数を追加したのにエラーが続く

**A:**
1. 各環境変数が `Production`, `Preview`, `Development` **全て** に設定されているか確認
2. 値に余分なスペースや改行がないか確認
3. 必ず再デプロイを実行
4. ブラウザのキャッシュをクリア（Ctrl+Shift+R）

### Q4: Firebase Admin Private Keyのエラー

**A:**
- Private Key全体を `""` で囲む
- 改行は `\n` として設定
- 例: `"-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"`

---

## 📚 詳細な情報

より詳しい情報が必要な場合は、[VERCEL_SETUP_GUIDE.md](./VERCEL_SETUP_GUIDE.md) を参照してください。

---

## ✅ 完了チェックリスト

- [ ] すべてのFirebase環境変数を追加した
- [ ] Google Maps APIキーを追加した
- [ ] Stripe APIキーを追加した（.env.localから取得）
- [ ] Firebase Admin設定を追加した（.env.localから取得）
- [ ] NEXTAUTH_SECRETを追加した（.env.localから取得）
- [ ] すべての環境変数が3つの環境に設定されている
- [ ] 再デプロイが完了した
- [ ] `/api/deploy-check` で `"status": "OK"` が返る
- [ ] アプリが正常に表示される
- [ ] ログイン機能が動作する

---

**🎉 すべてチェックが付いたら完了です！**
