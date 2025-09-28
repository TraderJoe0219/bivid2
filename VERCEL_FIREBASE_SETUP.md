# Vercel + Firebase Google認証 設定ガイド

## 🚨 現在の問題
Vercelでデプロイした際にGoogleログインができない

## 🔧 修正手順

### 1. Firebase Console設定

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. `bivid-windsurf` プロジェクトを選択
3. **Authentication** → **Settings** → **Authorized domains** に移動
4. 以下のドメインを追加:
   ```
   localhost (開発用 - 既に設定済み)
   your-app.vercel.app (本番用)
   *.vercel.app (プレビュー用)
   ```

### 2. Google Cloud Console設定

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. `bivid-windsurf` プロジェクトを選択
3. **APIs & Services** → **Credentials** に移動
4. OAuth 2.0 クライアントIDを選択
5. **Authorized JavaScript origins** に以下を追加:
   ```
   https://your-app.vercel.app
   https://*.vercel.app
   ```
6. **Authorized redirect URIs** に以下を追加:
   ```
   https://your-app.vercel.app/__/auth/handler
   https://*.vercel.app/__/auth/handler
   ```

### 3. Vercel環境変数設定

Vercelダッシュボードで以下の環境変数を設定:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBhyNvJotiFG_x9UIHEshJRCOulmWZvrqE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=bivid-windsurf.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=bivid-windsurf
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=bivid-windsurf.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=468256497062
NEXT_PUBLIC_FIREBASE_APP_ID=1:468256497062:web:59284e048bfbb6feb6c367
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-4T730PYWCV

# Firebase Admin (Server-side)
FIREBASE_ADMIN_PROJECT_ID=bivid-windsurf
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-fbsvc@bivid-windsurf.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="[秘密鍵をそのまま貼り付け]"

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyCyQq4tsI2BSFrvwlmmG_DmWbGk9lnjx0Y
```

### 4. 診断用エンドポイント

デプロイ後、以下のURLで設定を確認:
```
https://your-app.vercel.app/api/deploy-check
```

### 5. 一般的な問題と解決策

#### 問題1: "auth/unauthorized-domain"
**原因**: Firebase AuthのAuthorized domainsにVercelドメインが登録されていない
**解決**: Firebase Console → Authentication → Settings → Authorized domains に追加

#### 問題2: "auth/popup-blocked"
**原因**: ブラウザがポップアップをブロック
**解決**: サイトのポップアップ許可設定

#### 問題3: "auth/network-request-failed"
**原因**: CSPポリシーがFirebaseドメインをブロック
**解決**: next.config.jsのCSP設定を確認

#### 問題4: 環境変数未設定
**原因**: Vercelに環境変数が設定されていない
**解決**: Vercelダッシュボードで環境変数を設定後、再デプロイ

### 6. デバッグ情報

ブラウザの開発者ツールで以下を確認:
```javascript
// Firebase設定確認
console.log(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)

// 認証状態確認
import { auth } from '@/lib/firebase'
console.log('Auth state:', auth.currentUser)
```

### 7. 緊急時の回避策

もしGoogle認証が完全に動作しない場合は、メール/パスワード認証を使用:
- ログインページでメールアドレスとパスワードを入力
- Firebase Authのメール認証は通常問題なく動作する