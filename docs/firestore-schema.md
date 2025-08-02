# Firestore データベース設計

## コレクション構造

### 1. users コレクション
```typescript
/users/{userId}
{
  // 基本情報
  id: string,
  email: string,
  displayName: string,
  photoURL?: string,
  phoneNumber?: string,
  
  // プロフィール情報
  bio?: string,
  age?: number,
  location: {
    prefecture: string,      // 都道府県
    city: string,           // 市区町村
    area?: string,          // エリア（駅名など）
    coordinates?: {         // 位置情報（オプション）
      lat: number,
      lng: number
    }
  },
  
  // スキル関連
  teachingSkills: string[],  // 教えられるスキル
  learningInterests: string[], // 学びたいスキル
  
  // 評価情報
  rating: {
    average: number,         // 平均評価
    count: number,          // 評価数
    asTeacher: number,      // 教師としての評価
    asStudent: number       // 生徒としての評価
  },
  
  // 設定
  preferences: {
    isOnlineAvailable: boolean,    // オンライン対応可能
    maxTravelDistance: number,     // 移動可能距離（km）
    preferredTimeSlots: string[],  // 希望時間帯
    notifications: {
      email: boolean,
      push: boolean
    }
  },
  
  // システム情報
  isActive: boolean,
  lastLoginAt: Timestamp,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### 2. skills コレクション
```typescript
/skills/{skillId}
{
  // 基本情報
  id: string,
  title: string,
  description: string,
  shortDescription: string,    // 一覧表示用の短い説明
  
  // カテゴリ・タグ
  category: string,           // メインカテゴリ
  subCategory?: string,       // サブカテゴリ
  tags: string[],             // 検索用タグ
  
  // 教師情報
  teacherId: string,
  teacherName: string,        // 非正規化（検索効率化）
  teacherPhotoURL?: string,   // 非正規化
  teacherLocation: string,    // 非正規化
  
  // レッスン詳細
  duration: number,           // 1回のレッスン時間（分）
  price: {
    amount: number,           // 料金
    currency: 'JPY',
    unit: 'per_lesson' | 'per_hour'
  },
  
  // 開催情報
  location: {
    type: 'online' | 'offline' | 'both',
    address?: string,         // オフラインの場合
    prefecture: string,
    city: string,
    area?: string
  },
  
  // 定員・スケジュール
  maxStudents: number,        // 最大受講者数
  currentBookings: number,    // 現在の予約数
  availableSlots: {           // 利用可能な時間枠
    dayOfWeek: number,        // 0-6 (日-土)
    startTime: string,        // "09:00"
    endTime: string,          // "17:00"
    isAvailable: boolean
  }[],
  
  // メディア
  images: string[],           // 画像URL配列
  videoURL?: string,          // 紹介動画
  
  // 評価・レビュー
  rating: {
    average: number,
    count: number,
    distribution: {           // 星の分布
      5: number,
      4: number,
      3: number,
      2: number,
      1: number
    }
  },
  
  // 難易度・対象
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  targetAudience: string[],   // 対象者（例：初心者歓迎、経験者向け）
  requirements?: string[],    // 必要な道具・準備
  
  // システム情報
  isActive: boolean,
  isApproved: boolean,        // 管理者承認済み
  viewCount: number,          // 閲覧数
  favoriteCount: number,      // お気に入り数
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### 3. bookings コレクション
```typescript
/bookings/{bookingId}
{
  // 基本情報
  id: string,
  skillId: string,
  skillTitle: string,         // 非正規化
  
  // 参加者情報
  teacherId: string,
  teacherName: string,        // 非正規化
  studentId: string,
  studentName: string,        // 非正規化
  
  // スケジュール
  scheduledAt: Timestamp,     // 開始日時
  duration: number,           // 時間（分）
  endTime: Timestamp,         // 終了日時
  
  // 場所
  location: {
    type: 'online' | 'offline',
    address?: string,
    meetingURL?: string,      // オンラインの場合
    meetingId?: string,       // 会議ID
    notes?: string            // 場所に関する補足
  },
  
  // 料金・支払い
  pricing: {
    baseAmount: number,
    tax: number,
    totalAmount: number,
    currency: 'JPY'
  },
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded',
  paymentIntentId?: string,   // Stripe Payment Intent ID
  
  // ステータス管理
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled',
  cancellationReason?: string,
  cancellationPolicy: {
    refundPercentage: number,
    deadlineHours: number     // キャンセル期限（時間前）
  },
  
  // コミュニケーション
  notes?: string,             // 生徒からの備考
  teacherNotes?: string,      // 教師からの備考
  
  // 評価・レビュー
  isReviewedByStudent: boolean,
  isReviewedByTeacher: boolean,
  
  // システム情報
  createdAt: Timestamp,
  updatedAt: Timestamp,
  confirmedAt?: Timestamp,
  completedAt?: Timestamp
}
```

### 4. reviews コレクション
```typescript
/reviews/{reviewId}
{
  // 基本情報
  id: string,
  bookingId: string,
  skillId: string,
  skillTitle: string,         // 非正規化
  
  // レビュー者・対象者
  reviewerId: string,         // レビューする人
  reviewerName: string,       // 非正規化
  reviewerType: 'student' | 'teacher',
  revieweeId: string,         // レビューされる人
  revieweeName: string,       // 非正規化
  
  // 評価内容
  rating: number,             // 1-5の評価
  comment: string,            // コメント
  
  // 詳細評価（教師の場合）
  detailedRating?: {
    teaching: number,         // 教え方
    communication: number,    // コミュニケーション
    punctuality: number,      // 時間の正確性
    preparation: number       // 準備の充実度
  },
  
  // 詳細評価（生徒の場合）
  studentRating?: {
    attitude: number,         // 学習態度
    punctuality: number,      // 時間の正確性
    communication: number     // コミュニケーション
  },
  
  // システム情報
  isPublic: boolean,          // 公開設定
  isApproved: boolean,        // 管理者承認
  helpfulCount: number,       // 参考になった数
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### 5. conversations コレクション（メッセージ）
```typescript
/conversations/{conversationId}
{
  // 参加者
  participants: string[],     // [userId1, userId2]
  participantNames: string[], // 非正規化
  
  // 関連情報
  skillId?: string,           // 関連するスキル
  bookingId?: string,         // 関連する予約
  
  // 最新メッセージ情報
  lastMessage: {
    content: string,
    senderId: string,
    senderName: string,
    timestamp: Timestamp,
    type: 'text' | 'image' | 'file' | 'system'
  },
  
  // 未読管理
  unreadCount: {
    [userId: string]: number
  },
  
  // システム情報
  isActive: boolean,
  createdAt: Timestamp,
  updatedAt: Timestamp
}

// サブコレクション: messages
/conversations/{conversationId}/messages/{messageId}
{
  id: string,
  senderId: string,
  senderName: string,         // 非正規化
  content: string,
  type: 'text' | 'image' | 'file' | 'system',
  
  // メディア情報（type が image/file の場合）
  mediaURL?: string,
  mediaType?: string,         // MIME type
  fileName?: string,
  fileSize?: number,
  
  // 既読管理
  readBy: {
    [userId: string]: Timestamp
  },
  
  // システム情報
  createdAt: Timestamp,
  editedAt?: Timestamp,
  isDeleted: boolean
}
```

### 6. categories コレクション（マスターデータ）
```typescript
/categories/{categoryId}
{
  id: string,
  name: string,               // カテゴリ名
  description: string,        // 説明
  icon: string,               // アイコン名
  color: string,              // テーマカラー
  
  // 階層構造
  parentId?: string,          // 親カテゴリID
  level: number,              // 階層レベル（0: 大カテゴリ, 1: 中カテゴリ）
  
  // 表示順・設定
  sortOrder: number,          // 表示順
  isActive: boolean,          // 有効フラグ
  isPopular: boolean,         // 人気カテゴリフラグ
  
  // 統計情報
  skillCount: number,         // このカテゴリのスキル数
  
  // システム情報
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## インデックス設計

### 複合インデックス
```javascript
// スキル検索用
skills: [
  ['category', 'isActive', 'rating.average'],
  ['location.prefecture', 'isActive', 'createdAt'],
  ['teacherId', 'isActive'],
  ['tags', 'isActive', 'rating.average']
]

// 予約検索用
bookings: [
  ['teacherId', 'status', 'scheduledAt'],
  ['studentId', 'status', 'scheduledAt'],
  ['skillId', 'status', 'scheduledAt']
]

// レビュー検索用
reviews: [
  ['revieweeId', 'isPublic', 'createdAt'],
  ['skillId', 'isPublic', 'rating']
]
```

## セキュリティ考慮事項

1. **個人情報保護**: 電話番号、詳細住所は必要最小限
2. **非正規化**: 検索効率とリアルタイム更新のバランス
3. **階層構造**: カテゴリの柔軟な管理
4. **統計情報**: 集計処理の効率化
5. **未読管理**: リアルタイムメッセージング対応
