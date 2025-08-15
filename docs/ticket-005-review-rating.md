# チケット #005: 評価・レビューシステム

**優先度**: 中  
**担当者**: 未定  
**予想工数**: 6-8日  
**依存関係**: #003 (予約機能), #004 (メッセージング)

## 📋 概要
活動完了後の相互評価システムを実装。信頼性と透明性を高め、高品質なサービス提供を促進する包括的な評価・レビュー機能。

## 🎯 受け入れ条件

### 評価システム
- [ ] 5段階評価（★1-5）
- [ ] 双方向評価（教える側・学ぶ側）
- [ ] 詳細評価項目別採点
- [ ] 総合評価の自動計算
- [ ] 評価分布の可視化

### レビュー機能
- [ ] 自由記述コメント投稿
- [ ] 写真添付機能
- [ ] 匿名・実名選択
- [ ] レビューへの返信機能
- [ ] 参考になった機能（Like）

### 評価管理
- [ ] 評価の公開・非公開設定
- [ ] 不適切レビューの報告・削除
- [ ] 評価統計の表示
- [ ] 改善提案の自動生成

### 品質管理
- [ ] レビューガイドライン適用
- [ ] 自動コンテンツ監視
- [ ] 運営による内容確認
- [ ] 悪質評価の防止機能

## 📝 詳細仕様

### 評価項目（提案実装）

#### 教える側への評価
```typescript
interface TeacherRating {
  overall: number          // 総合評価 (1-5)
  teaching: number         // 教え方の分かりやすさ
  communication: number    // コミュニケーション
  punctuality: number      // 時間の正確性
  preparation: number      // 準備の充実度
  safety: number          // 安全への配慮
}
```

#### 学ぶ側への評価
```typescript
interface StudentRating {
  overall: number          // 総合評価 (1-5)
  attitude: number         // 学習意欲・態度
  punctuality: number      // 時間の正確性
  communication: number    // コミュニケーション
  manner: number          // マナー・礼儀
}
```

### レビューガイドライン
```markdown
【投稿できるレビュー】
✅ 活動内容に関する具体的な感想
✅ 講師・参加者の良かった点
✅ 改善提案（建設的なもの）
✅ 他の人への推薦理由
✅ 学んだことや得られた体験

【投稿禁止内容】
❌ 個人情報の暴露
❌ 誹謗中傷、人格攻撃
❌ 政治・宗教・商業的宣伝
❌ 虚偽の情報
❌ 活動に関係のない内容
❌ 過度に感情的な表現
```

## 🛠 技術仕様

### 使用技術
- **データベース**: Firestore
- **画像処理**: Firebase Storage + Cloud Vision API
- **テキスト分析**: Cloud Natural Language API
- **統計計算**: Cloud Functions
- **通知**: Firebase Cloud Messaging

### API エンドポイント
- `POST /api/reviews` - レビュー投稿
- `GET /api/reviews/skill/[skillId]` - スキル別レビュー取得
- `GET /api/reviews/user/[userId]` - ユーザー別レビュー取得
- `PUT /api/reviews/[reviewId]` - レビュー更新
- `POST /api/reviews/[reviewId]/report` - レビュー報告
- `POST /api/reviews/[reviewId]/helpful` - 参考になった投票

### データベース設計
```typescript
interface Review {
  id: string
  bookingId: string
  skillId: string
  skillTitle: string
  
  // レビュー者・対象者
  reviewerId: string
  reviewerName: string
  reviewerType: 'student' | 'teacher'
  revieweeId: string
  revieweeName: string
  
  // 評価内容
  rating: {
    overall: number
    detailed: TeacherRating | StudentRating
  }
  
  // レビュー内容
  comment: string
  photos: string[]
  
  // 公開設定
  isPublic: boolean
  isAnonymous: boolean
  
  // 管理情報
  isApproved: boolean
  isReported: boolean
  moderationNotes?: string
  
  // 統計情報
  helpfulCount: number
  helpfulUsers: string[]
  
  // 返信
  reply?: {
    content: string
    authorId: string
    createdAt: Timestamp
  }
  
  createdAt: Timestamp
  updatedAt: Timestamp
}

interface UserRatingStats {
  userId: string
  userType: 'teacher' | 'student'
  
  // 全体統計
  averageRating: number
  totalReviews: number
  totalHelpfulVotes: number
  
  // 詳細統計（教師の場合）
  teacherStats?: {
    teaching: number
    communication: number
    punctuality: number
    preparation: number
    safety: number
  }
  
  // 分布
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
  
  // トレンド
  monthlyStats: {
    [month: string]: {
      averageRating: number
      reviewCount: number
    }
  }
  
  updatedAt: Timestamp
}
```

## 🎨 UI/UX要件

### 評価入力UI
- [ ] 直感的な星評価入力
- [ ] 各項目の分かりやすい説明
- [ ] プログレスバー表示
- [ ] 入力内容のプレビュー
- [ ] 送信前の確認画面

### レビュー表示UI
- [ ] カード形式のレビュー表示
- [ ] 評価の視覚的表現（星・グラフ）
- [ ] フィルタリング機能（評価別、日付別）
- [ ] ソート機能（新着、高評価、参考順）
- [ ] 無限スクロール

### 統計表示UI
- [ ] 評価分布のグラフ表示
- [ ] トレンド分析チャート
- [ ] 改善ポイントの提案
- [ ] 比較分析（平均との比較）

## 🔐 品質管理・安全要件

### コンテンツ監視
- [ ] 不適切語句の自動検出
- [ ] 感情分析による問題レビュー特定
- [ ] 画像コンテンツの自動審査
- [ ] 虚偽レビューの検出アルゴリズム

### 評価の信頼性確保
- [ ] 実際の活動参加者のみ評価可能
- [ ] 一回の活動につき一回のみ評価
- [ ] 評価の修正期限設定（1週間）
- [ ] 相互評価の促進機能

### 不正対策
- [ ] サクラレビューの検出
- [ ] 過度に厳しい評価の監視
- [ ] 報復評価の防止
- [ ] 組織的な評価操作の検出

## 🧪 テスト項目

### 単体テスト
- [ ] 評価計算ロジック
- [ ] レビューバリデーション
- [ ] 統計生成機能

### 統合テスト
- [ ] Cloud Natural Language API連携
- [ ] 画像解析機能
- [ ] 通知送信機能

### E2Eテスト
- [ ] 評価投稿フロー
- [ ] レビュー表示・検索
- [ ] 報告・削除機能
- [ ] 統計画面表示

### 品質テスト
- [ ] 不適切コンテンツ検出精度
- [ ] 虚偽レビュー検出テスト
- [ ] 大量データでの性能テスト

## 📂 ファイル構成
```
src/
├── app/
│   ├── reviews/
│   │   ├── create/[bookingId]/page.tsx
│   │   └── skill/[skillId]/page.tsx
│   ├── dashboard/
│   │   └── reviews/page.tsx
│   └── api/reviews/
├── components/
│   ├── reviews/
│   │   ├── ReviewForm.tsx
│   │   ├── ReviewCard.tsx
│   │   ├── RatingStars.tsx
│   │   └── ReviewStats.tsx
│   ├── ratings/
│   │   ├── DetailedRating.tsx
│   │   └── RatingDistribution.tsx
│   └── moderation/
│       └── ReportReviewDialog.tsx
├── hooks/
│   ├── useReviews.ts
│   ├── useRatingStats.ts
│   └── useReviewModeration.ts
└── lib/
    ├── reviewValidation.ts
    └── ratingCalculations.ts
```

## 🔄 進捗状況
- [ ] 要件分析完了
- [ ] 評価システム設計
- [ ] レビューフォーム実装
- [ ] 表示コンポーネント実装
- [ ] 統計機能実装
- [ ] コンテンツ監視設定
- [ ] 品質管理機能実装
- [ ] 不正検出システム
- [ ] テスト実装
- [ ] 運用フロー整備

## 📝 備考
- 高齢者にとって分かりやすい評価項目の日本語表現を検討
- 悪質な評価への対応フローを事前に整備
- 評価の匿名性と責任のバランスを考慮
- 定期的な評価システムの見直し・改善
- 法的問題（名誉毀損等）への対応準備
- 評価データの分析による サービス改善への活用