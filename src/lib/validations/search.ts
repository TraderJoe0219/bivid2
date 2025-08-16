import { z } from 'zod'
import { SkillCategory, SocialActivityCategory } from '@/types/skill'

// 位置情報スキーマ
export const locationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  radius: z.number().min(0.1).max(100) // 0.1km～100km
})

// 価格範囲スキーマ
export const priceRangeSchema = z.object({
  min: z.number().min(0),
  max: z.number().min(0)
}).refine(data => data.max >= data.min, {
  message: "最大価格は最小価格以上である必要があります"
})

// 日付範囲スキーマ
export const dateRangeSchema = z.object({
  start: z.date(),
  end: z.date()
}).refine(data => data.end >= data.start, {
  message: "終了日は開始日以降である必要があります"
})

// 時間スロットスキーマ
export const timeSlotSchema = z.object({
  dayOfWeek: z.number().min(0).max(6), // 0=日曜日, 6=土曜日
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "時刻形式が正しくありません"),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "時刻形式が正しくありません")
})

// スキル検索パラメータスキーマ
export const skillSearchParamsSchema = z.object({
  keyword: z.string().max(100).optional(),
  categories: z.array(z.nativeEnum(SkillCategory)).optional(),
  location: locationSchema.optional(),
  priceRange: priceRangeSchema.optional(),
  dateRange: dateRangeSchema.optional(),
  timeSlots: z.array(timeSlotSchema).max(7).optional(), // 最大7件（1週間分）
  difficulty: z.array(z.enum(['beginner', 'intermediate', 'advanced'])).optional(),
  locationType: z.array(z.enum(['offline', 'online', 'hybrid'])).optional(),
  rating: z.number().min(0).max(5).optional(),
  availability: z.enum(['immediate', 'this_week', 'this_month', 'any']).optional(),
  sortBy: z.enum([
    'relevance', 
    'distance', 
    'rating', 
    'price_low', 
    'price_high', 
    'newest', 
    'popular'
  ]).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional()
})

// 社会活動検索パラメータスキーマ
export const socialActivitySearchParamsSchema = z.object({
  keyword: z.string().max(100).optional(),
  categories: z.array(z.nativeEnum(SocialActivityCategory)).optional(),
  location: locationSchema.optional(),
  priceRange: priceRangeSchema.optional(),
  dateRange: dateRangeSchema.optional(),
  difficulty: z.array(z.enum(['beginner', 'intermediate', 'advanced', 'all_levels'])).optional(),
  locationType: z.array(z.enum(['offline', 'online', 'hybrid'])).optional(),
  ageRange: z.object({
    min: z.number().min(0).max(120).optional(),
    max: z.number().min(0).max(120).optional()
  }).optional(),
  registrationStatus: z.array(z.enum(['open', 'waitlist'])).optional(),
  sortBy: z.enum([
    'relevance',
    'date',
    'distance', 
    'rating', 
    'price_low', 
    'price_high', 
    'newest',
    'popular'
  ]).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional()
})

// 高度な検索フィルター
export const advancedFiltersSchema = z.object({
  // 講師・主催者フィルター
  teacherVerified: z.boolean().optional(),
  teacherExperience: z.object({
    min: z.number().min(0),
    max: z.number().min(0)
  }).optional(),
  teacherRating: z.number().min(0).max(5).optional(),
  
  // 参加者設定フィルター
  maxParticipants: z.object({
    min: z.number().min(1),
    max: z.number().min(1)
  }).optional(),
  hasAvailableSlots: z.boolean().optional(),
  
  // 特別フィルター
  isFeatured: z.boolean().optional(),
  hasReviews: z.boolean().optional(),
  hasImages: z.boolean().optional(),
  hasVideos: z.boolean().optional(),
  
  // 除外フィルター
  excludeIds: z.array(z.string()).max(100).optional()
})

// 地図表示用フィルター
export const mapFiltersSchema = z.object({
  showSkills: z.boolean().default(true),
  showSocialActivities: z.boolean().default(true),
  showClusters: z.boolean().default(true),
  clusterMinZoom: z.number().min(1).max(20).default(10),
  selectedCategories: z.array(z.string()).optional(),
  bounds: z.object({
    north: z.number(),
    south: z.number(),
    east: z.number(),
    west: z.number()
  }).optional()
})

// お気に入り操作スキーマ
export const favoriteActionSchema = z.object({
  skillId: z.string().min(1),
  action: z.enum(['add', 'remove'])
})

// レビュー投稿スキーマ
export const reviewSchema = z.object({
  skillId: z.string().min(1),
  rating: z.number().min(1).max(5),
  title: z.string().min(1).max(100).optional(),
  comment: z.string().min(10).max(1000),
  pros: z.array(z.string().max(100)).max(5).optional(),
  cons: z.array(z.string().max(100)).max(5).optional(),
  wouldRecommend: z.boolean()
})

// 予約リクエストスキーマ
export const bookingRequestSchema = z.object({
  skillId: z.string().min(1),
  preferredDates: z.array(z.object({
    date: z.date(),
    startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
  })).min(1).max(3),
  participantCount: z.number().min(1).max(10),
  message: z.string().max(500).optional(),
  contactPreference: z.enum(['email', 'phone', 'message']),
  specialRequirements: z.string().max(300).optional()
})

// 定数定義
export const SKILL_SEARCH_LIMITS = {
  MAX_KEYWORD_LENGTH: 100,
  MAX_CATEGORIES: 10,
  MAX_RADIUS: 100, // km
  MAX_TIME_SLOTS: 7,
  MAX_RESULTS_PER_PAGE: 100,
  DEFAULT_PAGE_SIZE: 20
} as const

export const SORT_OPTIONS = [
  { value: 'relevance', label: '関連度順' },
  { value: 'distance', label: '距離順' },
  { value: 'rating', label: '評価順' },
  { value: 'price_low', label: '価格順（安い順）' },
  { value: 'price_high', label: '価格順（高い順）' },
  { value: 'newest', label: '新着順' },
  { value: 'popular', label: '人気順' }
] as const

export const DISTANCE_OPTIONS = [
  { value: 1, label: '1km以内' },
  { value: 3, label: '3km以内' },
  { value: 5, label: '5km以内' },
  { value: 10, label: '10km以内' },
  { value: 20, label: '20km以内' },
  { value: 50, label: '50km以内' }
] as const

export const PRICE_RANGE_PRESETS = [
  { value: 'free', label: '無料', min: 0, max: 0 },
  { value: 'under_1000', label: '〜1,000円', min: 0, max: 1000 },
  { value: 'under_3000', label: '〜3,000円', min: 0, max: 3000 },
  { value: '1000_to_3000', label: '1,000円〜3,000円', min: 1000, max: 3000 },
  { value: '3000_to_5000', label: '3,000円〜5,000円', min: 3000, max: 5000 },
  { value: 'over_5000', label: '5,000円以上', min: 5000, max: Number.MAX_SAFE_INTEGER }
] as const

export const AVAILABILITY_OPTIONS = [
  { value: 'immediate', label: '今すぐ' },
  { value: 'this_week', label: '今週中' },
  { value: 'this_month', label: '今月中' },
  { value: 'any', label: 'いつでも' }
] as const

export const DIFFICULTY_OPTIONS = [
  { value: 'beginner', label: '初級者向け' },
  { value: 'intermediate', label: '中級者向け' },
  { value: 'advanced', label: '上級者向け' }
] as const

export const LOCATION_TYPE_OPTIONS = [
  { value: 'offline', label: '対面' },
  { value: 'online', label: 'オンライン' },
  { value: 'hybrid', label: 'ハイブリッド' }
] as const

// 型エクスポート
export type SkillSearchParams = z.infer<typeof skillSearchParamsSchema>
export type SocialActivitySearchParams = z.infer<typeof socialActivitySearchParamsSchema>
export type AdvancedFilters = z.infer<typeof advancedFiltersSchema>
export type MapFilters = z.infer<typeof mapFiltersSchema>
export type FavoriteAction = z.infer<typeof favoriteActionSchema>
export type ReviewFormData = z.infer<typeof reviewSchema>
export type BookingRequest = z.infer<typeof bookingRequestSchema>