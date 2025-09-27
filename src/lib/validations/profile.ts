// プロフィール関連のバリデーションスキーマ
import { z } from 'zod'
import { INTEREST_TAGS, PREFECTURES } from '@/types/profile'

// プロフィール更新スキーマ
export const profileUpdateSchema = z.object({
  displayName: z
    .string()
    .min(1, 'ニックネームを入力してください')
    .max(50, 'ニックネームは50文字以内で入力してください'),
  bio: z
    .string()
    .max(500, '自己紹介は500文字以内で入力してください')
    .optional(),
  prefecture: z
    .enum(PREFECTURES)
    .optional(),
  city: z
    .string()
    .max(50, '市区町村は50文字以内で入力してください')
    .optional(),
  address: z
    .string()
    .max(100, '住所は100文字以内で入力してください')
    .optional(),
  interests: z
    .array(z.enum(INTEREST_TAGS))
    .max(10, '興味タグは10個まで選択できます')
    .default([])
})

// プロフィール取得レスポンススキーマ
export const profileResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    uid: z.string(),
    displayName: z.string(),
    bio: z.string().optional(),
    home: z.object({
      prefecture: z.string().optional(),
      city: z.string().optional(),
      address: z.string().optional(),
      lat: z.number().optional(),
      lng: z.number().optional()
    }).nullable(),
    interests: z.array(z.string()),
    createdAt: z.date(),
    updatedAt: z.date()
  }).optional(),
  error: z.string().optional()
})

// 住所ジオコーディング用スキーマ
export const geocodingRequestSchema = z.object({
  address: z.string().min(1, '住所を入力してください')
})

export const geocodingResponseSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  formattedAddress: z.string()
})

// 型エクスポート
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>
export type ProfileResponse = z.infer<typeof profileResponseSchema>
export type GeocodingRequest = z.infer<typeof geocodingRequestSchema>
export type GeocodingResponse = z.infer<typeof geocodingResponseSchema>