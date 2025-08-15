# チケット #004: コミュニケーション・メッセージング機能

**優先度**: 中  
**担当者**: 未定  
**予想工数**: 8-10日  
**依存関係**: #001 (ユーザー認証), #003 (予約機能)

## 📋 概要
ユーザー間のコミュニケーション機能を実装。予約前の質問、予約後の連絡、活動中のやり取りを支援する安全で使いやすいメッセージングシステム。

## 🎯 受け入れ条件

### メッセージング機能
- [ ] 1対1チャット機能
- [ ] テキストメッセージ送受信
- [ ] 画像送信機能
- [ ] ファイル送信機能（制限付き）
- [ ] 既読・未読状態管理
- [ ] メッセージ履歴保存

### 通知機能
- [ ] リアルタイムメッセージ通知
- [ ] アプリ内通知
- [ ] メール通知（設定可能）
- [ ] プッシュ通知
- [ ] 通知設定管理

### 安全機能
- [ ] 不適切コンテンツの報告
- [ ] メッセージの自動監視
- [ ] ブロック機能
- [ ] 会話履歴のエクスポート
- [ ] 緊急時エスカレーション

### 外部連携
- [ ] 電話番号交換の許可制御
- [ ] ビデオ通話サービス連携案内
- [ ] 緊急連絡先への通知

## 📝 詳細仕様

### メッセージングフロー
1. **会話開始**: スキル詳細ページから「質問する」
2. **メッセージ作成**: テキスト・画像選択
3. **送信確認**: 内容確認後送信
4. **リアルタイム配信**: 相手に即座に通知
5. **返信対応**: 相手からの返信受信
6. **会話継続**: 予約完了まで継続可能

### メッセージタイプ
```typescript
enum MessageType {
  TEXT = 'text',           // テキストメッセージ
  IMAGE = 'image',         // 画像
  FILE = 'file',           // ファイル
  SYSTEM = 'system',       // システムメッセージ
  LOCATION = 'location',   // 位置情報
  CONTACT = 'contact'      // 連絡先交換
}
```

### 安全機能詳細
- **NGワード検知**: 不適切な内容の自動検出
- **スパム防止**: 短時間での大量送信制限
- **年齢適合**: 高齢者に配慮したコンテンツフィルタ
- **エスカレーション**: 緊急時の運営への自動通知

## 🛠 技術仕様

### 使用技術
- **リアルタイム通信**: Firebase Firestore リアルタイムリスナー
- **通知**: Firebase Cloud Messaging
- **ファイルストレージ**: Firebase Storage
- **メール送信**: SendGrid
- **コンテンツ監視**: Cloud Vision API（画像）

### API エンドポイント
- `GET /api/conversations` - 会話一覧取得
- `POST /api/conversations` - 新規会話作成
- `GET /api/conversations/[id]/messages` - メッセージ履歴取得
- `POST /api/conversations/[id]/messages` - メッセージ送信
- `POST /api/conversations/[id]/report` - 不適切コンテンツ報告
- `POST /api/users/[id]/block` - ユーザーブロック

### データベース設計
```typescript
interface Conversation {
  id: string
  participants: string[]           // [userId1, userId2]
  participantNames: string[]       // 非正規化
  skillId?: string                 // 関連スキル
  bookingId?: string              // 関連予約
  
  // 最新メッセージ情報
  lastMessage: {
    content: string
    senderId: string
    timestamp: Timestamp
    type: MessageType
  }
  
  // 未読管理
  unreadCount: {
    [userId: string]: number
  }
  
  // ステータス
  isActive: boolean
  isBlocked: boolean
  
  createdAt: Timestamp
  updatedAt: Timestamp
}

interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  content: string
  type: MessageType
  
  // メディア情報
  mediaURL?: string
  mediaType?: string
  fileName?: string
  fileSize?: number
  
  // 既読管理
  readBy: {
    [userId: string]: Timestamp
  }
  
  // 安全機能
  isReported: boolean
  isFlagged: boolean
  moderationResult?: string
  
  createdAt: Timestamp
  editedAt?: Timestamp
  isDeleted: boolean
}
```

## 🎨 UI/UX要件

### チャットUI
- [ ] WhatsApp風のメッセージ表示
- [ ] 送信者による左右振り分け
- [ ] 既読状態の視覚的表示
- [ ] タイムスタンプ表示
- [ ] メッセージの長押しメニュー

### 高齢者向け配慮
- [ ] 大きなフォントサイズ
- [ ] 明確な送信ボタン
- [ ] 音声入力機能（将来的）
- [ ] 絵文字の使いやすい配置
- [ ] エラー時の分かりやすい案内

### レスポンシブ対応
- [ ] モバイル最適化
- [ ] タブレット表示
- [ ] デスクトップ対応

## 🔐 セキュリティ・安全要件

### コンテンツ監視
- [ ] NGワードフィルタリング
- [ ] 画像コンテンツ自動分析
- [ ] 個人情報漏洩検知
- [ ] スパム・迷惑メッセージ対策

### プライバシー保護
- [ ] メッセージの暗号化
- [ ] 会話履歴の自動削除（1年後）
- [ ] 退会時のデータ削除
- [ ] 第三者への情報開示制限

### 緊急時対応
- [ ] 緊急事態の自動検知
- [ ] 運営への即座通知
- [ ] 緊急連絡先への自動連絡
- [ ] 警察・救急への通報サポート

## 🧪 テスト項目

### 単体テスト
- [ ] メッセージ送受信ロジック
- [ ] 既読状態管理
- [ ] コンテンツフィルタリング

### 統合テスト
- [ ] Firebase リアルタイム同期
- [ ] プッシュ通知送信
- [ ] ファイルアップロード

### E2Eテスト
- [ ] メッセージング全フロー
- [ ] 複数デバイス間同期
- [ ] 通知機能
- [ ] ブロック機能

### セキュリティテスト
- [ ] XSS攻撃対策
- [ ] SQLインジェクション対策
- [ ] 不適切コンテンツ検知
- [ ] スパム送信制限

## 📂 ファイル構成
```
src/
├── app/
│   ├── messages/
│   │   ├── page.tsx
│   │   └── [conversationId]/page.tsx
│   └── api/
│       ├── conversations/
│       └── messages/
├── components/
│   ├── messaging/
│   │   ├── ConversationList.tsx
│   │   ├── ChatWindow.tsx
│   │   ├── MessageInput.tsx
│   │   └── MessageBubble.tsx
│   ├── notifications/
│   │   └── NotificationCenter.tsx
│   └── safety/
│       ├── ReportDialog.tsx
│       └── BlockUserDialog.tsx
├── hooks/
│   ├── useConversations.ts
│   ├── useMessages.ts
│   └── useNotifications.ts
└── lib/
    ├── messaging.ts
    └── contentModeration.ts
```

## 🔄 進捗状況
- [ ] 要件分析完了
- [ ] Firebase設定
- [ ] リアルタイム通信実装
- [ ] チャットUI実装
- [ ] 通知機能実装
- [ ] ファイル送信機能
- [ ] 安全機能実装
- [ ] コンテンツ監視設定
- [ ] テスト実装
- [ ] セキュリティ監査

## 📝 備考
- メッセージの保存期間は法的要件を考慮して1年間
- 高齢者の打ち間違い・誤送信に配慮した取り消し機能検討
- 音声メッセージ機能は将来的な実装項目
- 24時間365日の安全監視体制が必要
- 緊急時の対応フローを事前に整備