// スケジュール管理関連の型定義
import { Timestamp } from 'firebase/firestore'

// 空き状況ステータス
export type AvailabilityStatus = 'all_day' | 'am' | 'pm' | 'none'

// 日別空き状況
export interface DailyAvailability {
  date: string // "2025-10-03" 形式
  status: AvailabilityStatus
  updatedAt: Timestamp
}

// 月間空き状況
export interface MonthlyAvailability {
  year: number
  month: number // 1-12
  days: Record<string, AvailabilityStatus> // "2025-10-03": "all_day"
  updatedAt: Timestamp
}

// スケジュール更新用フォームデータ
export interface ScheduleUpdateData {
  date: string
  status: AvailabilityStatus
}

// バッチ更新用データ
export interface BatchScheduleUpdate {
  updates: ScheduleUpdateData[]
}

// 空き状況のラベル表示用
export const AVAILABILITY_LABELS: Record<AvailabilityStatus, string> = {
  all_day: '○（終日）',
  am: '△（午前）',
  pm: '▽（午後）',
  none: '×（不可）'
}

// 空き状況の色分け用
export const AVAILABILITY_COLORS: Record<AvailabilityStatus, string> = {
  all_day: 'bg-green-100 text-green-800 border-green-200',
  am: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  pm: 'bg-blue-100 text-blue-800 border-blue-200',
  none: 'bg-gray-100 text-gray-800 border-gray-200'
}

// 時間帯の定義
export const TIME_SLOTS = {
  am: { start: '09:00', end: '12:00', label: '午前（9:00-12:00）' },
  pm: { start: '13:00', end: '17:00', label: '午後（13:00-17:00）' },
  all_day: { start: '09:00', end: '17:00', label: '終日（9:00-17:00）' }
} as const

// カレンダー表示用のヘルパー型
export interface CalendarDay {
  date: string
  day: number
  isCurrentMonth: boolean
  isToday: boolean
  status?: AvailabilityStatus
}

export interface CalendarMonth {
  year: number
  month: number
  weeks: CalendarDay[][]
}

// API用の型
export interface AvailabilityQuery {
  year: number
  month: number
}

export interface AvailabilityResponse {
  success: boolean
  data?: DailyAvailability[]
  error?: string
}