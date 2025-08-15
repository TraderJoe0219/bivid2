# チケット #003: 予約・決済機能

**優先度**: 高  
**担当者**: 未定  
**予想工数**: 12-15日  
**依存関係**: #001 (ユーザー認証), #002 (スキル検索)

## 📋 概要
スキル・社会活動の予約システムと決済機能を実装。高齢者にとって分かりやすい予約フローと、安全な決済処理を提供する。

## 🎯 受け入れ条件

### 予約システム
- [ ] カレンダー形式での日時選択
- [ ] 空き状況のリアルタイム表示
- [ ] 参加人数選択機能
- [ ] 特記事項・メッセージ入力
- [ ] 予約確認・承認フロー
- [ ] 予約変更・キャンセル機能

### 決済システム
- [ ] Stripe統合による決済処理
- [ ] クレジットカード決済
- [ ] 銀行振込対応（手動確認）
- [ ] 現地決済オプション
- [ ] 返金・キャンセル料処理
- [ ] 手数料計算・税金処理

### 予約管理
- [ ] 予約一覧（参加者・主催者）
- [ ] ステータス管理（申込→確定→完了）
- [ ] リマインダー通知
- [ ] 評価・レビュー促進
- [ ] 売上管理（主催者向け）

### 通知機能
- [ ] 予約確定メール
- [ ] リマインダー通知（24時間前）
- [ ] キャンセル通知
- [ ] 緊急時連絡通知

## 📝 詳細仕様

### 予約フロー
1. **活動選択**: 詳細ページから「予約する」をクリック
2. **日時選択**: カレンダーから希望日時選択
3. **参加者情報**: 人数、特記事項入力
4. **決済方法選択**: カード、振込、現地決済から選択
5. **内容確認**: 予約内容・料金の最終確認
6. **決済処理**: 選択した方法で決済実行
7. **予約完了**: 確認メール送信、主催者に通知

### 料金体系
```typescript
interface PricingStructure {
  baseAmount: number        // 基本料金
  tax: number              // 消費税
  platformFee: number      // プラットフォーム手数料（将来的）
  paymentFee: number       // 決済手数料
  totalAmount: number      // 総額
}
```

### キャンセルポリシー
- **24時間前まで**: 100%返金
- **24時間以内**: 50%返金
- **当日**: 返金なし
- **主催者都合**: 100%返金 + お詫び

## 🛠 技術仕様

### 使用技術
- **決済**: Stripe Payment Intents API
- **カレンダー**: React Big Calendar
- **状態管理**: Zustand + React Query
- **通知**: Firebase Cloud Messaging + SendGrid

### API エンドポイント
- `POST /api/bookings` - 予約作成
- `GET /api/bookings/[id]` - 予約詳細取得
- `PUT /api/bookings/[id]` - 予約更新
- `DELETE /api/bookings/[id]` - 予約キャンセル
- `POST /api/payments/create-intent` - 決済意図作成
- `POST /api/payments/confirm` - 決済確定
- `POST /api/payments/refund` - 返金処理

### データベース設計
```typescript
interface Booking {
  id: string
  skillId: string
  teacherId: string
  studentId: string
  scheduledAt: Timestamp
  duration: number
  participantCount: number
  
  // 料金情報
  pricing: {
    baseAmount: number
    tax: number
    totalAmount: number
    currency: 'JPY'
  }
  
  // 決済情報
  paymentMethod: 'card' | 'transfer' | 'cash'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentIntentId?: string
  
  // ステータス
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  
  // 連絡事項
  studentNotes?: string
  teacherNotes?: string
  
  // システム情報
  createdAt: Timestamp
  updatedAt: Timestamp
  confirmedAt?: Timestamp
  completedAt?: Timestamp
}
```

## 🎨 UI/UX要件

### カレンダーUI
- [ ] 大きなカレンダー表示
- [ ] 空き状況の色分け（空き/満席/残りわずか）
- [ ] 選択した日時の明確な表示
- [ ] 時間帯の分かりやすい表示

### 決済UI
- [ ] 決済方法の明確な説明
- [ ] 料金内訳の詳細表示
- [ ] セキュリティに関する安心表示
- [ ] エラー時の分かりやすい案内

### 高齢者向け配慮
- [ ] ステップごとの進捗表示
- [ ] 各ステップでの説明文
- [ ] 「戻る」ボタンの設置
- [ ] 確認画面での内容詳細表示

## 🔐 セキュリティ要件

### 決済セキュリティ
- [ ] PCI DSS準拠（Stripe使用）
- [ ] SSL/TLS暗号化
- [ ] 決済情報の非保存
- [ ] 不正検知機能

### データ保護
- [ ] 個人情報の暗号化
- [ ] アクセスログ記録
- [ ] 権限ベースアクセス制御
- [ ] 定期的なセキュリティ監査

## 🧪 テスト項目

### 単体テスト
- [ ] 料金計算ロジック
- [ ] 日時バリデーション
- [ ] キャンセルポリシー適用

### 統合テスト
- [ ] Stripe API連携
- [ ] メール送信機能
- [ ] プッシュ通知

### E2Eテスト
- [ ] 予約フロー全体
- [ ] 決済処理
- [ ] キャンセル処理
- [ ] 返金処理

### ペイメントテスト
- [ ] テスト用カード番号での決済
- [ ] 3Dセキュア認証
- [ ] 決済失敗パターン
- [ ] Webhook処理

## 📂 ファイル構成
```
src/
├── app/
│   ├── booking/
│   │   ├── [skillId]/page.tsx
│   │   └── confirmation/page.tsx
│   ├── dashboard/
│   │   ├── bookings/page.tsx
│   │   └── earnings/page.tsx
│   └── api/
│       ├── bookings/
│       └── payments/
├── components/
│   ├── booking/
│   │   ├── BookingCalendar.tsx
│   │   ├── BookingForm.tsx
│   │   └── PaymentForm.tsx
│   ├── payments/
│   │   └── StripeCheckout.tsx
│   └── dashboard/
│       ├── BookingList.tsx
│       └── EarningsChart.tsx
├── lib/
│   ├── stripe.ts
│   └── payments.ts
└── hooks/
    ├── useBooking.ts
    └── usePayments.ts
```

## 🔄 進捗状況
- [ ] 要件分析完了
- [ ] Stripe設定・統合
- [ ] カレンダー機能実装
- [ ] 予約システム実装
- [ ] 決済機能実装
- [ ] 通知機能実装
- [ ] 管理画面実装
- [ ] セキュリティテスト
- [ ] 決済テスト
- [ ] 本番環境設定

## 📝 備考
- Stripe本番環境での決済テストが必要
- 銀行振込の確認フローは手動運用から開始
- 高額取引時の本人確認強化検討
- 税務処理（源泉徴収等）の将来的対応準備
- 領収書発行機能の追加検討