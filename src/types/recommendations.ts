// おすすめ活動関連の型定義
import { Timestamp } from 'firebase/firestore'
import { Location } from './profile'

// 活動データ
export interface Activity {
  id: string
  title: string
  category: ActivityCategory
  tags: string[]
  start: string // ISO形式 "2025-10-03T10:00:00+09:00"
  end: string   // ISO形式
  location: ActivityLocation
  org?: string     // 主催者
  cost?: number    // 0=無料
  url?: string     // 詳細URL
  rating?: number  // 将来用
  description?: string
  maxParticipants?: number
  currentParticipants?: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

// 活動場所情報
export interface ActivityLocation {
  lat: number
  lng: number
  address: string
  city?: string
  prefecture?: string
  name?: string // 施設名など
}

// 活動カテゴリ
export type ActivityCategory =
  | 'ボランティア'
  | '学び'
  | '生活支援'
  | '健康・運動'
  | '文化・趣味'
  | '交流・イベント'
  | '地域活動'
  | 'その他'

// レコメンドクエリ
export interface RecommendationQuery {
  date: string // "2025-10-03"
  sortBy?: 'distance' | 'recommendation' | 'time' | 'rating'
  limit?: number
}

// レコメンド結果
export interface RecommendationResult {
  activity: Activity
  score: number
  reasons: RecommendationReason[]
  distance?: number // km
  timeMatch?: boolean
  tagMatches?: string[]
}

// レコメンド理由
export interface RecommendationReason {
  type: 'tag_match' | 'distance' | 'time_match' | 'rating' | 'popularity'
  value: number
  description: string
}

// レコメンドレスポンス
export interface RecommendationResponse {
  success: boolean
  data?: {
    date: string
    userAvailability: string
    recommendations: RecommendationResult[]
    total: number
  }
  error?: string
}

// フィルタ設定
export interface DiscoverFilters {
  categories?: ActivityCategory[]
  maxDistance?: number // km
  timeSlot?: 'am' | 'pm' | 'all_day'
  cost?: 'free' | 'paid' | 'any'
  tags?: string[]
}

// ソート設定
export type SortOption = 'distance' | 'recommendation' | 'time' | 'rating'

export const SORT_OPTIONS: Record<SortOption, string> = {
  distance: '距離順',
  recommendation: '推奨度順',
  time: '時間順',
  rating: '評価順'
}

// 活動カードの表示用データ
export interface ActivityCardData extends Activity {
  distance?: number
  timeUntilStart?: string
  isBookmarked?: boolean
  canParticipate?: boolean
}

// 参加アクション
export interface ParticipationAction {
  activityId: string
  action: 'join' | 'leave' | 'bookmark' | 'unbookmark'
}

// 地図表示用のマーカーデータ
export interface ActivityMarker {
  id: string
  position: { lat: number; lng: number }
  title: string
  category: ActivityCategory
  start: string
  isRecommended?: boolean
}

// 空き状況なしの場合のヒント
export interface NoRecommendationsHint {
  title: string
  description: string
  action?: {
    label: string
    href: string
  }
}

export const NO_RECOMMENDATIONS_HINTS: NoRecommendationsHint[] = [
  {
    title: 'スケジュールを確認してみませんか？',
    description: '今日の空き状況が「×（不可）」になっている可能性があります。',
    action: {
      label: 'スケジュールを編集',
      href: '/me/schedule'
    }
  },
  {
    title: '興味のあるタグを追加してみませんか？',
    description: 'より多くの活動が見つかるように、プロフィールの興味タグを増やしてみてください。',
    action: {
      label: 'プロフィールを編集',
      href: '/me'
    }
  },
  {
    title: '活動範囲を広げてみませんか？',
    description: 'お住まいの地域から少し離れた場所でも素敵な活動が見つかるかもしれません。',
    action: {
      label: 'フィルタを調整',
      href: '/discover'
    }
  }
]