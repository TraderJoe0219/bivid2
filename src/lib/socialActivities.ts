/**
 * 社会活動データの取得とフィルタリング機能
 */

import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  GeoPoint,
  Timestamp 
} from 'firebase/firestore'
import { db } from './firebase'

export interface SocialActivity {
  id: string
  title: string
  description: string
  shortDescription: string
  category: string
  subCategory: string
  tags: string[]
  teacherId: string
  teacherName: string
  teacherPhotoURL: string | null
  teacherLocation: string
  duration: number
  price: {
    amount: number
    currency: string
    unit: string
  }
  location: {
    type: 'offline' | 'online' | 'both'
    address: string
    prefecture: string
    city: string
    area: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  maxStudents: number
  currentBookings: number
  availableSlots: Array<{
    dayOfWeek: number
    startTime: string
    endTime: string
    isAvailable: boolean
  }>
  images: string[]
  videoURL: string | null
  rating: {
    average: number
    count: number
    distribution: Record<number, number>
  }
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  targetAudience: string[]
  requirements: string[]
  isActive: boolean
  isApproved: boolean
  viewCount: number
  favoriteCount: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface ActivityFilters {
  categories?: string[]
  maxDistance?: number
  minRating?: number
  priceRange?: {
    min: number
    max: number
  }
  hasAvailableSlots?: boolean
  location?: {
    lat: number
    lng: number
  }
}

export interface CategoryOption {
  id: string
  name: string
  icon: string
  color: string
}

export const CATEGORY_OPTIONS: CategoryOption[] = [
  {
    id: 'work',
    name: '仕事・作業',
    icon: '💼',
    color: 'blue'
  },
  {
    id: 'help',
    name: 'お手伝い',
    icon: '🤝',
    color: 'green'
  },
  {
    id: 'volunteer',
    name: 'ボランティア',
    icon: '❤️',
    color: 'red'
  },
  {
    id: 'seminar',
    name: 'セミナー',
    icon: '📚',
    color: 'purple'
  },
  {
    id: 'event',
    name: 'イベント',
    icon: '🎉',
    color: 'orange'
  },
  {
    id: 'meeting',
    name: '会議',
    icon: '👥',
    color: 'gray'
  }
];

/**
 * 社会活動データを取得
 */
export async function getSocialActivities(filters: ActivityFilters = {}): Promise<SocialActivity[]> {
  try {
    let q = query(collection(db, 'skills'))

    // 開発中は最もシンプルなクエリのみ使用（インデックス不要）
    q = query(q, orderBy('createdAt', 'desc'))

    // 取得件数制限
    q = query(q, limit(100))

    const querySnapshot = await getDocs(q)
    const activities: SocialActivity[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      activities.push({
        id: doc.id,
        ...data,
      } as SocialActivity)
    })

    // クライアントサイドフィルタリング
    let filteredActivities = activities
    
    // アクティブ状態フィルター
    filteredActivities = filteredActivities.filter(activity => activity.isActive === true)
    
    // 承認状態フィルター
    filteredActivities = filteredActivities.filter(activity => activity.isApproved === true)
    
    // カテゴリフィルター
    if (filters.categories && filters.categories.length > 0) {
      filteredActivities = filteredActivities.filter(activity => 
        filters.categories!.includes(activity.category)
      )
    }
    
    // 評価フィルター
    if (filters.minRating) {
      filteredActivities = filteredActivities.filter(activity => 
        activity.rating && activity.rating.average >= filters.minRating!
      )
    }
    
    // 距離フィルタリング
    if (filters.location && filters.maxDistance) {
      filteredActivities = filteredActivities.filter(activity => {
        if (!activity.location.coordinates) return false
        
        const distance = calculateDistance(
          filters.location!.lat,
          filters.location!.lng,
          activity.location.coordinates.lat,
          activity.location.coordinates.lng
        )
        
        return distance <= filters.maxDistance!
      })
    }

    // 価格フィルタリング
    if (filters.priceRange) {
      filteredActivities = filteredActivities.filter(activity => {
        const price = activity.price.amount
        return price >= filters.priceRange!.min && price <= filters.priceRange!.max
      })
    }

    // 空きスロットフィルタリング
    if (filters.hasAvailableSlots) {
      filteredActivities = filteredActivities.filter(activity => {
        return activity.availableSlots && activity.availableSlots.some(slot => slot.isAvailable)
      })
    }

    return filteredActivities

  } catch (error) {
    console.error('社会活動データの取得に失敗しました:', error)
    throw error
  }
}

/**
 * 社会活動カテゴリのみを取得
 */
export async function getSocialActivityCategories(): Promise<string[]> {
  return ['work', 'help', 'volunteer', 'seminar', 'event', 'meeting']
}

/**
 * 特定のカテゴリの社会活動を取得
 */
export async function getSocialActivitiesByCategory(category: string): Promise<SocialActivity[]> {
  return getSocialActivities({ categories: [category] })
}

/**
 * 位置情報に基づいて近くの社会活動を取得
 */
export async function getNearbyActivities(
  lat: number, 
  lng: number, 
  radiusKm: number = 10
): Promise<SocialActivity[]> {
  return getSocialActivities({
    location: { lat, lng },
    maxDistance: radiusKm
  })
}

/**
 * 2点間の距離を計算（ハーバーサイン公式）
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // 地球の半径（km）
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * 活動の空き状況を確認
 */
export function hasAvailableSlots(activity: SocialActivity): boolean {
  return activity.availableSlots && activity.availableSlots.some(slot => slot.isAvailable)
}

/**
 * 活動の距離を計算
 */
export function calculateActivityDistance(
  activity: SocialActivity, 
  userLat: number, 
  userLng: number
): number | null {
  if (!activity.location.coordinates) return null
  
  return calculateDistance(
    userLat,
    userLng,
    activity.location.coordinates.lat,
    activity.location.coordinates.lng
  )
}

/**
 * 価格を表示用にフォーマット
 */
export function formatPrice(price: SocialActivity['price']): string {
  if (price.amount === 0) {
    if (price.unit === 'volunteer') return '無料（ボランティア）'
    if (price.unit === 'free') return '無料'
    return '無料'
  }
  
  const unitLabels: Record<string, string> = {
    per_session: '回',
    per_day: '日',
    per_shift: 'シフト',
    per_hour: '時間',
    per_lesson: 'レッスン'
  }
  
  const unitLabel = unitLabels[price.unit] || ''
  return `¥${price.amount.toLocaleString()}${unitLabel ? `/${unitLabel}` : ''}`
}

/**
 * 曜日を日本語に変換
 */
export function getDayOfWeekName(dayOfWeek: number): string {
  const days = ['日', '月', '火', '水', '木', '金', '土']
  return days[dayOfWeek] || ''
}
