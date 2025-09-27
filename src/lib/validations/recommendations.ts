// レコメンド機能関連のバリデーションスキーマ
import { z } from 'zod'
import { dateStringSchema } from './schedule'

// 活動カテゴリ
export const activityCategorySchema = z.enum([
  'ボランティア',
  '学び',
  '生活支援',
  '健康・運動',
  '文化・趣味',
  '交流・イベント',
  '地域活動',
  'その他'
])

// 活動場所スキーマ
export const activityLocationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  address: z.string().min(1),
  city: z.string().optional(),
  prefecture: z.string().optional(),
  name: z.string().optional()
})

// 活動データスキーマ
export const activitySchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(100),
  category: activityCategorySchema,
  tags: z.array(z.string()).max(10),
  start: z.string().datetime(), // ISO形式
  end: z.string().datetime(),   // ISO形式
  location: activityLocationSchema,
  org: z.string().optional(),
  cost: z.number().min(0).optional(),
  url: z.string().url().optional(),
  rating: z.number().min(0).max(5).optional(),
  description: z.string().max(1000).optional(),
  maxParticipants: z.number().int().min(1).optional(),
  currentParticipants: z.number().int().min(0).optional()
})

// レコメンドクエリスキーマ
export const recommendationQuerySchema = z.object({
  date: dateStringSchema.optional().default(() => {
    return new Date().toISOString().split('T')[0]
  }),
  sortBy: z
    .enum(['distance', 'recommendation', 'time', 'rating'])
    .optional()
    .default('recommendation'),
  limit: z
    .number()
    .int()
    .min(1)
    .max(50)
    .optional()
    .default(20)
})

// フィルタスキーマ
export const discoverFiltersSchema = z.object({
  categories: z.array(activityCategorySchema).optional(),
  maxDistance: z.number().min(0).max(100).optional(), // km
  timeSlot: z.enum(['am', 'pm', 'all_day']).optional(),
  cost: z.enum(['free', 'paid', 'any']).optional().default('any'),
  tags: z.array(z.string()).optional()
})

// レコメンド理由スキーマ
export const recommendationReasonSchema = z.object({
  type: z.enum(['tag_match', 'distance', 'time_match', 'rating', 'popularity']),
  value: z.number(),
  description: z.string()
})

// レコメンド結果スキーマ
export const recommendationResultSchema = z.object({
  activity: activitySchema,
  score: z.number().min(0),
  reasons: z.array(recommendationReasonSchema),
  distance: z.number().min(0).optional(),
  timeMatch: z.boolean().optional(),
  tagMatches: z.array(z.string()).optional()
})

// レコメンドレスポンススキーマ
export const recommendationResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    date: dateStringSchema,
    userAvailability: z.enum(['all_day', 'am', 'pm', 'none']),
    recommendations: z.array(recommendationResultSchema),
    total: z.number().int().min(0)
  }).optional(),
  error: z.string().optional()
})

// 参加アクションスキーマ
export const participationActionSchema = z.object({
  activityId: z.string().min(1),
  action: z.enum(['join', 'leave', 'bookmark', 'unbookmark'])
})

// 型エクスポート
export type ActivityCategory = z.infer<typeof activityCategorySchema>
export type ActivityLocation = z.infer<typeof activityLocationSchema>
export type Activity = z.infer<typeof activitySchema>
export type RecommendationQuery = z.infer<typeof recommendationQuerySchema>
export type DiscoverFilters = z.infer<typeof discoverFiltersSchema>
export type RecommendationReason = z.infer<typeof recommendationReasonSchema>
export type RecommendationResult = z.infer<typeof recommendationResultSchema>
export type RecommendationResponse = z.infer<typeof recommendationResponseSchema>
export type ParticipationAction = z.infer<typeof participationActionSchema>

// バリデーションヘルパー関数
export function validateISODateTime(dateTimeStr: string): boolean {
  try {
    const date = new Date(dateTimeStr)
    return !isNaN(date.getTime()) && dateTimeStr === date.toISOString()
  } catch {
    return false
  }
}

export function validateCoordinates(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
}