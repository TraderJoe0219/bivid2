# チケット #001: ユーザー認証・登録機能

**優先度**: 高  
**担当者**: 未定  
**予想工数**: 8-10日  
**依存関係**: なし

## 📋 概要
ユーザーの会員登録、認証、プロフィール管理機能を実装する。高齢者向けの分かりやすいUIと、セキュリティを重視した身元確認機能を含む。

## 🎯 受け入れ条件

### 基本認証機能
- [ ] メールアドレス + パスワードでの新規登録
- [ ] ログイン・ログアウト機能
- [ ] パスワードリセット機能（メール送信）
- [ ] Firebase Auth統合

### 身元確認機能
- [ ] 電話番号認証（SMS認証）
- [ ] 身分証明書アップロード機能
- [ ] 顔写真登録機能
- [ ] 認証ステータス管理

### プロフィール管理
- [ ] 基本情報入力フォーム（氏名、生年月日、性別、住所）
- [ ] 自己紹介文、趣味・特技入力
- [ ] 教えられるスキル・学びたいスキル選択
- [ ] 活動可能時間・移動可能範囲設定
- [ ] プロフィール編集機能

### 緊急連絡先管理
- [ ] 家族・知人の連絡先登録（複数件対応）
- [ ] 関係性・優先順位設定
- [ ] 緊急時連絡フロー

## 📝 詳細仕様

### 会員登録フロー
1. メールアドレス・パスワード入力
2. 基本情報入力（氏名、生年月日等）
3. 電話番号認証（SMS）
4. 身分証明書アップロード
5. 顔写真登録
6. 緊急連絡先登録
7. プロフィール情報入力
8. 利用規約同意
9. 登録完了

### UI/UX要件
- [ ] 高齢者向け大きなフォント（18px以上）
- [ ] 高コントラストカラー
- [ ] タッチフレンドリーなボタンサイズ（最小44px）
- [ ] エラーメッセージの分かりやすい表示

### セキュリティ要件
- [ ] パスワード強度チェック
- [ ] 入力値サニタイゼーション
- [ ] CSRF対策
- [ ] 個人情報の暗号化保存

## 🛠 技術仕様

### 使用技術
- **認証**: Firebase Auth
- **ストレージ**: Firebase Storage（画像）
- **データベース**: Firestore
- **バリデーション**: Zod
- **フォーム**: React Hook Form

### API エンドポイント
- `POST /api/auth/register` - 新規登録
- `POST /api/auth/login` - ログイン
- `POST /api/auth/verify-phone` - 電話番号認証
- `PUT /api/user/profile` - プロフィール更新
- `POST /api/user/upload-document` - 身分証アップロード

### データベース設計
```typescript
// users コレクション
interface User {
  id: string
  email: string
  displayName: string
  phoneNumber: string
  isPhoneVerified: boolean
  isDocumentVerified: boolean
  profilePhotoURL?: string
  documentURL?: string
  profile: UserProfile
  emergencyContacts: EmergencyContact[]
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

## 🧪 テスト項目

### 単体テスト
- [ ] フォームバリデーション
- [ ] パスワード強度チェック
- [ ] 電話番号フォーマット検証

### 統合テスト
- [ ] Firebase Auth連携
- [ ] SMS認証フロー
- [ ] ファイルアップロード

### E2Eテスト
- [ ] 新規登録フロー全体
- [ ] ログイン・ログアウト
- [ ] プロフィール編集

## 📂 ファイル構成
```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── verify/page.tsx
│   └── api/auth/
├── components/auth/
│   ├── AuthForm.tsx
│   ├── PhoneVerification.tsx
│   └── DocumentUpload.tsx
├── lib/validations/
│   └── auth.ts
└── types/
    └── auth.ts
```

## 🔄 進捗状況
- [ ] 要件分析完了
- [ ] 技術調査完了
- [ ] UI/UXデザイン
- [ ] フロントエンド実装
- [ ] バックエンド実装
- [ ] テスト実装
- [ ] テスト実行
- [ ] デプロイ・リリース

## 📝 備考
- 高齢者のデジタルリテラシーを考慮し、各ステップで分かりやすいガイダンスを表示
- エラーが発生した場合の代替手段（電話サポート等）を用意
- プライバシー保護のため、必要最小限の情報のみ収集