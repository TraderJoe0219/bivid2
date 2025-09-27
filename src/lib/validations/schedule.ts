// スケジュール関連のバリデーションスキーマ
import { z } from 'zod'

// 空き状況ステータス
export const availabilityStatusSchema = z.enum(['all_day', 'am', 'pm', 'none'])

// 日付バリデーション（YYYY-MM-DD形式）
export const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, '日付はYYYY-MM-DD形式で入力してください')
  .refine((date) => {
    const parsed = new Date(date)
    return !isNaN(parsed.getTime()) && date === parsed.toISOString().split('T')[0]
  }, '有効な日付を入力してください')

// 月間クエリスキーマ
export const monthlyQuerySchema = z.object({
  year: z
    .number()
    .int()
    .min(2020)
    .max(2030),
  month: z
    .number()
    .int()
    .min(1)
    .max(12)
})

// 単一日付の空き状況更新スキーマ
export const dailyAvailabilityUpdateSchema = z.object({
  date: dateStringSchema,
  status: availabilityStatusSchema
})

// バッチ更新スキーマ
export const batchAvailabilityUpdateSchema = z.object({
  updates: z
    .array(dailyAvailabilityUpdateSchema)
    .min(1, '更新データが必要です')
    .max(100, '一度に更新できるのは100日分までです')
})

// 空き状況取得レスポンススキーマ
export const availabilityResponseSchema = z.object({
  success: z.boolean(),
  data: z
    .array(
      z.object({
        date: dateStringSchema,
        status: availabilityStatusSchema,
        updatedAt: z.date()
      })
    )
    .optional(),
  error: z.string().optional()
})

// レコメンド用の日付クエリスキーマ
export const recommendationQuerySchema = z.object({
  date: dateStringSchema.optional().default(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
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

// URLクエリパラメータ用スキーマ
export const monthQuerySchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-\d{2}$/, '月はYYYY-MM形式で入力してください')
    .transform((val) => {
      const [year, month] = val.split('-').map(Number)
      return { year, month }
    })
})

// 型エクスポート
export type AvailabilityStatus = z.infer<typeof availabilityStatusSchema>
export type DailyAvailabilityUpdate = z.infer<typeof dailyAvailabilityUpdateSchema>
export type BatchAvailabilityUpdate = z.infer<typeof batchAvailabilityUpdateSchema>
export type AvailabilityResponse = z.infer<typeof availabilityResponseSchema>
export type RecommendationQuery = z.infer<typeof recommendationQuerySchema>
export type MonthlyQuery = z.infer<typeof monthlyQuerySchema>

// バリデーションヘルパー関数
export function validateDate(dateStr: string): boolean {
  try {
    dateStringSchema.parse(dateStr)
    return true
  } catch {
    return false
  }
}

export function isValidMonth(year: number, month: number): boolean {
  try {
    monthlyQuerySchema.parse({ year, month })
    return true
  } catch {
    return false
  }
}