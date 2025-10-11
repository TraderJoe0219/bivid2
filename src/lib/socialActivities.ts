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
 * モック社会活動データを生成
 */
function getMockActivities(): SocialActivity[] {
  const now = Timestamp.now()

  return [
    {
      id: 'activity-001',
      title: '地域清掃ボランティア',
      description: '地域の公園や道路の清掃活動を行います。軍手とゴミ袋は用意しますので、汚れても良い服装でお越しください。',
      shortDescription: '地域の公園や道路の清掃活動',
      category: 'volunteer',
      subCategory: '環境保全',
      tags: ['交流', '地域貢献', '健康'],
      teacherId: 'volunteer-org-001',
      teacherName: '豊中市ボランティア協会',
      teacherPhotoURL: null,
      teacherLocation: '豊中市',
      duration: 90,
      price: { amount: 0, currency: 'JPY', unit: 'volunteer' },
      location: {
        type: 'offline',
        address: '大阪府豊中市中桜塚3丁目 桜塚公園',
        prefecture: '大阪府',
        city: '豊中市',
        area: '中桜塚',
        coordinates: { lat: 34.7804, lng: 135.4686 }
      },
      maxStudents: 20,
      currentBookings: 8,
      availableSlots: [{ dayOfWeek: 6, startTime: '10:00', endTime: '11:30', isAvailable: true }],
      images: [],
      videoURL: null,
      rating: { average: 4.5, count: 15, distribution: { 5: 10, 4: 3, 3: 2, 2: 0, 1: 0 } },
      difficulty: 'beginner',
      targetAudience: ['シニア', '初心者歓迎', '地域住民'],
      requirements: ['動きやすい服装', '飲み物持参'],
      isActive: true,
      isApproved: true,
      viewCount: 120,
      favoriteCount: 15,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'activity-002',
      title: 'スマホ教室：基本操作編',
      description: 'スマートフォンの基本的な使い方を学びます。電話のかけ方、メールの送受信、アプリの使い方などを丁寧に説明します。',
      shortDescription: 'スマホの基本操作を学ぶ教室',
      category: 'seminar',
      subCategory: 'IT・デジタル',
      tags: ['スマホサポート', '学習', 'IT'],
      teacherId: 'senior-it-001',
      teacherName: 'シニアIT支援の会',
      teacherPhotoURL: null,
      teacherLocation: '豊中市',
      duration: 90,
      price: { amount: 500, currency: 'JPY', unit: 'per_session' },
      location: {
        type: 'offline',
        address: '大阪府豊中市南桜塚1丁目 豊中市立中央公民館',
        prefecture: '大阪府',
        city: '豊中市',
        area: '南桜塚',
        coordinates: { lat: 34.7736, lng: 135.4690 }
      },
      maxStudents: 15,
      currentBookings: 12,
      availableSlots: [{ dayOfWeek: 0, startTime: '13:30', endTime: '15:00', isAvailable: true }],
      images: [],
      videoURL: null,
      rating: { average: 4.8, count: 25, distribution: { 5: 20, 4: 3, 3: 2, 2: 0, 1: 0 } },
      difficulty: 'beginner',
      targetAudience: ['シニア', 'スマホ初心者', 'IT学習希望者'],
      requirements: ['スマートフォン持参'],
      isActive: true,
      isApproved: true,
      viewCount: 250,
      favoriteCount: 30,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'activity-003',
      title: '買い物同行サポート',
      description: '重い荷物の買い物や、商品選びをお手伝いします。一緒に楽しくお買い物しましょう。',
      shortDescription: '買い物のお手伝いサービス',
      category: 'help',
      subCategory: '生活支援',
      tags: ['買い物同行', '生活支援', '交流'],
      teacherId: 'support-center-001',
      teacherName: '豊中生活支援センター',
      teacherPhotoURL: null,
      teacherLocation: '豊中市',
      duration: 90,
      price: { amount: 0, currency: 'JPY', unit: 'volunteer' },
      location: {
        type: 'offline',
        address: '大阪府豊中市岡町北1丁目 阪急オアシス岡町店',
        prefecture: '大阪府',
        city: '豊中市',
        area: '岡町北',
        coordinates: { lat: 34.7820, lng: 135.4620 }
      },
      maxStudents: 5,
      currentBookings: 3,
      availableSlots: [{ dayOfWeek: 1, startTime: '09:30', endTime: '11:00', isAvailable: true }],
      images: [],
      videoURL: null,
      rating: { average: 4.2, count: 10, distribution: { 5: 5, 4: 3, 3: 2, 2: 0, 1: 0 } },
      difficulty: 'beginner',
      targetAudience: ['シニア', '買い物支援が必要な方'],
      requirements: [],
      isActive: true,
      isApproved: true,
      viewCount: 80,
      favoriteCount: 10,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'activity-004',
      title: '朝のラジオ体操',
      description: '毎朝のラジオ体操で健康的な一日をスタートしましょう。初心者の方も大歓迎です。',
      shortDescription: '毎朝の健康ラジオ体操',
      category: 'event',
      subCategory: '健康・運動',
      tags: ['健康', '体操', 'ウォーキング'],
      teacherId: 'health-group-001',
      teacherName: '豊中健康づくりの会',
      teacherPhotoURL: null,
      teacherLocation: '豊中市',
      duration: 30,
      price: { amount: 0, currency: 'JPY', unit: 'free' },
      location: {
        type: 'offline',
        address: '大阪府豊中市本町1丁目 豊中市立文化芸術センター前広場',
        prefecture: '大阪府',
        city: '豊中市',
        area: '本町',
        coordinates: { lat: 34.7850, lng: 135.4650 }
      },
      maxStudents: 30,
      currentBookings: 18,
      availableSlots: [{ dayOfWeek: 2, startTime: '06:30', endTime: '07:00', isAvailable: true }],
      images: [],
      videoURL: null,
      rating: { average: 4.0, count: 50, distribution: { 5: 15, 4: 20, 3: 10, 2: 3, 1: 2 } },
      difficulty: 'beginner',
      targetAudience: ['全年齢', 'シニア', '健康維持希望者'],
      requirements: ['運動しやすい服装'],
      isActive: true,
      isApproved: true,
      viewCount: 300,
      favoriteCount: 45,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'activity-005',
      title: '手芸サークル：秋の小物作り',
      description: '秋らしい小物を手作りします。材料費込みの参加費です。裁縫道具はお貸しします。',
      shortDescription: '秋の小物を手作り',
      category: 'event',
      subCategory: '文化・趣味',
      tags: ['手芸', '裁縫', '創作活動'],
      teacherId: 'craft-circle-001',
      teacherName: '豊中手芸サークル',
      teacherPhotoURL: null,
      teacherLocation: '豊中市',
      duration: 120,
      price: { amount: 300, currency: 'JPY', unit: 'per_session' },
      location: {
        type: 'offline',
        address: '大阪府豊中市南桜塚2丁目 豊中市立老人福祉センター',
        prefecture: '大阪府',
        city: '豊中市',
        area: '南桜塚',
        coordinates: { lat: 34.7789, lng: 135.4723 }
      },
      maxStudents: 12,
      currentBookings: 9,
      availableSlots: [{ dayOfWeek: 3, startTime: '14:00', endTime: '16:00', isAvailable: true }],
      images: [],
      videoURL: null,
      rating: { average: 4.6, count: 20, distribution: { 5: 14, 4: 4, 3: 2, 2: 0, 1: 0 } },
      difficulty: 'beginner',
      targetAudience: ['シニア', '手芸好き', '初心者歓迎'],
      requirements: [],
      isActive: true,
      isApproved: true,
      viewCount: 150,
      favoriteCount: 25,
      createdAt: now,
      updatedAt: now
    }
  ]
}

/**
 * 社会活動データを取得
 */
export async function getSocialActivities(filters: ActivityFilters = {}): Promise<SocialActivity[]> {
  try {
    // Firebaseが設定されていない場合、モックデータを返す
    const mockActivities: SocialActivity[] = getMockActivities()

    // クライアントサイドフィルタリング
    let filteredActivities = mockActivities

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
