# 🚀 Bivid - Vercelデプロイガイド

## Firebase認証エラー「auth/invalid-api-key」の解決方法

### 1. Vercel環境変数の設定

Vercelダッシュボードで以下の環境変数を設定してください：

#### 必須のFirebase環境変数
```
NEXT_PUBLIC_FIREBASE_API_KEY=[FirebaseコンソールからAPIキーを取得]
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=[プロジェクトID].firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=[FirebaseプロジェクトID]
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=[プロジェクトID].firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=[メッセージングセンダーID]
NEXT_PUBLIC_FIREBASE_APP_ID=[FirebaseアプリID]
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=[Google Analytics測定ID（オプション）]
```

#### Firebase Admin（サーバーサイド）
```
FIREBASE_ADMIN_PROJECT_ID=[FirebaseプロジェクトID]
FIREBASE_ADMIN_CLIENT_EMAIL=[サービスアカウントのemail]
FIREBASE_ADMIN_PRIVATE_KEY=[サービスアカウントのプライベートキー]
```

#### その他の必要な環境変数
```
NEXTAUTH_SECRET=[32文字以上のランダム文字列]
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=[Google Maps APIキー]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[Stripeパブリッシャブルキー]
STRIPE_SECRET_KEY=[Stripeシークレットキー]
STRIPE_WEBHOOK_SECRET=[Stripeウェブフックシークレット]
```

> ⚠️ **重要**: 実際の値は.env.localファイルから取得してください。

### 2. Vercelでの設定手順

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com/dashboard

2. **プロジェクトを選択**
   - `bivid2` プロジェクトをクリック

3. **Settings → Environment Variables**
   - 左メニューから「Settings」を選択
   - 「Environment Variables」タブをクリック

4. **環境変数を追加**
   - 「Add」ボタンをクリック
   - Name: `NEXT_PUBLIC_FIREBASE_API_KEY`
   - Value: .env.localファイルから実際の値を入力
   - Environments: `Production`, `Preview`, `Development` すべて選択
   - 「Save」をクリック

5. **全ての環境変数を同様に追加**

### 3. デプロイの実行

環境変数を設定後、以下の方法で再デプロイ：

#### 方法1: 手動デプロイ
```bash
# コミットしてプッシュ
git add .
git commit -m "fix: Firebase環境変数とエラーハンドリング改善"
git push origin main
```

#### 方法2: Vercelダッシュボードから
- Deployments → 最新のデプロイ → 「...」メニュー → 「Redeploy」

### 4. トラブルシューティング

#### エラー: `Firebase: Error (auth/invalid-api-key)`
```
✅ 解決方法:
1. NEXT_PUBLIC_FIREBASE_API_KEY が正しく設定されているか確認
2. APIキーにDemo文字列が含まれていないか確認
3. APIキーの長さが20文字以上あるか確認
4. Vercelの環境変数でProduction環境が選択されているか確認
```

#### エラー: `Firebase設定が無効です`
```
✅ 解決方法:
1. 全ての必須環境変数が設定されているか確認
2. authDomain, projectId, storageBucket等が正しいか確認
3. Firebaseコンソールでプロジェクト設定を再確認
```

#### エラー: `Permission denied`
```
✅ 解決方法:
1. Firebase Rulesを確認
2. FIREBASE_ADMIN_PRIVATE_KEY が正しく設定されているか確認
3. サービスアカウントの権限を確認
```

### 5. ビルド時の検証

現在の実装では、以下の検証が自動実行されます：

1. **開発環境**: 警告のみ表示
2. **本番環境**: 詳細なバリデーションとエラーログ
3. **Vercel環境**: 環境変数チェックとデプロイガイド表示

### 6. 確認方法

デプロイ後、以下を確認：

1. **ビルドログ確認**
   ```
   ✅ 環境変数チェック完了
   ```
   このメッセージが表示されればOK

2. **アプリケーション確認**
   - ログインページにアクセス
   - Firebase認証が動作するか確認
   - エラーがコンソールに表示されないか確認

3. **エラー監視**
   - Vercelのログでエラーを監視
   - Firebase Consoleでエラーを監視

### 7. 本番環境の最適化

- [x] 環境変数の厳密なバリデーション
- [x] 詳細なエラーログとデバッグ情報
- [x] フォールバック機能とグレースフル・デグラデーション
- [x] セキュリティヘッダーの設定
- [x] 画像最適化の設定

### 8. サポート

問題が解決しない場合：

1. Vercelのビルドログを確認
2. ブラウザの開発者ツールでエラーログを確認
3. Firebase Consoleでプロジェクト設定を再確認
4. 必要に応じて環境変数を再設定して再デプロイ