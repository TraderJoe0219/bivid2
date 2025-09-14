# Firebase セットアップガイド

## 1. Firebase Console でプロジェクト作成

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名: `bivid-app` (または任意の名前)
4. Google Analytics は任意で設定

## 2. Web アプリの追加

1. プロジェクト概要で「ウェブ」アイコンをクリック
2. アプリのニックネーム: `Bivid Web App`
3. Firebase Hosting は後で設定可能
4. 「アプリを登録」をクリック

## 3. 設定値の取得

Firebase SDK の設定オブジェクトが表示されます：

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef..."
};
```

## 4. Authentication の有効化

1. 左メニューから「Authentication」を選択
2. 「始める」をクリック
3. 「Sign-in method」タブで以下を有効化：
   - **メール/パスワード**: 有効にする
   - **Google**: 有効にする（任意）

## 5. Firestore Database の設定

1. 左メニューから「Firestore Database」を選択
2. 「データベースを作成」をクリック
3. セキュリティルール: 「テストモードで開始」を選択
4. ロケーション: `asia-northeast1` (東京) を推奨

## 6. .env.local ファイルの更新

取得した設定値を `.env.local` ファイルに記載：

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef...

# Google Maps API (既存)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBvOiF462Ad0mXVQbFtRdWhUFXhFRuIYvU
```

## 7. 開発サーバーの再起動

```bash
npm run dev
```

## 注意事項

- 設定値は実際の値に置き換えてください
- `.env.local` ファイルは Git にコミットしないでください
- 本番環境では適切なセキュリティルールを設定してください
