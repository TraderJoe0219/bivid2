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
export const getSocialActivities = async (filters?: {
  categories?: string[]
  location?: { lat: number; lng: number }
  maxDistance?: number
  hasAvailableSlots?: boolean
  minRating?: number
}): Promise<SocialActivity[]> => {
  console.log('🔍 getSocialActivities: フィルター条件:', filters)
  
  // Firebase が利用できない場合はモックデータを返す
  if (!db) {
    console.warn('🔥 Firebase not available, returning mock data')
    return getMockSocialActivities(filters)
  }
  
  try {
    // Firestoreクエリの構築
    let q = query(collection(db, 'skills'))
    
    // カテゴリフィルター
    if (filters?.categories && filters.categories.length > 0) {
      q = query(q, where('category', 'in', filters.categories))
    }
    
    // 空きスロットフィルター
    if (filters?.hasAvailableSlots) {
      q = query(q, where('hasAvailableSlots', '==', true))
    }
    
    // 評価フィルター
    if (filters?.minRating) {
      q = query(q, where('rating.average', '>=', filters.minRating))
    }
    
    // 作成日時で並び替え（新しい順）
    q = query(q, orderBy('createdAt', 'desc'))
    
    // 結果数制限
    q = query(q, limit(50))
    
    console.log('🔍 getSocialActivities: Firestoreクエリ実行中...')
    const querySnapshot = await getDocs(q)
    
    const activities: SocialActivity[] = []
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      console.log('📄 Document data:', doc.id, data)
      
      // データ変換
      const activity: SocialActivity = {
        id: doc.id,
        title: data.title || '',
        description: data.description || '',
        shortDescription: data.shortDescription || data.description?.substring(0, 100) || '',
        category: data.category || 'other',
        subCategory: data.subCategory || '',
        tags: data.tags || [],
        teacherId: data.teacherId || '',
        teacherName: data.teacherName || 'Unknown',
        teacherPhotoURL: data.teacherPhotoURL || null,
        teacherLocation: data.teacherLocation || '',
        duration: data.duration || 60,
        price: {
          amount: data.price?.amount || 0,
          currency: data.price?.currency || 'JPY',
          unit: data.price?.unit || 'session'
        },
        location: {
          type: data.location?.type || 'offline',
          address: data.location?.address || '',
          prefecture: data.location?.prefecture || '',
          city: data.location?.city || '',
          area: data.location?.area || '',
          coordinates: data.location?.coordinates || { lat: 0, lng: 0 }
        },
        maxStudents: data.maxStudents || 1,
        currentBookings: data.currentBookings || 0,
        availableSlots: [{
          dayOfWeek: 1,
          startTime: '09:00',
          endTime: '17:00',
          isAvailable: (data.maxStudents || 1) > (data.currentBookings || 0)
        }],
        difficulty: data.difficulty || 'beginner',
        targetAudience: data.targetAudience || [],
        requirements: data.requirements || [],
        rating: {
          average: data.rating?.average || 4.0,
          count: data.rating?.count || 0,
          distribution: data.rating?.distribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        },
        viewCount: data.viewCount || 0,
        favoriteCount: data.favoriteCount || 0,
        createdAt: data.createdAt || new Date(),
        updatedAt: data.updatedAt || new Date()
      }
      
      activities.push(activity)
    })
    
    console.log('✅ getSocialActivities: 取得完了:', activities.length, '件')
    
    // 距離フィルター（クライアントサイドで実行）
    if (filters?.location && filters?.maxDistance) {
      const filteredActivities = activities.filter(activity => {
        const distance = calculateDistance(
          filters.location!,
          activity.location.coordinates
        )
        return distance <= filters.maxDistance!
      })
      
      console.log('🎯 距離フィルター適用後:', filteredActivities.length, '件')
      return filteredActivities
    }
    
    return activities
    
  } catch (error) {
    console.error('❌ getSocialActivities: エラー:', error)
    console.warn('🔄 Falling back to mock data')
    return getMockSocialActivities(filters)
  }
}

/**
 * モック社会活動データを取得
 */
function getMockSocialActivities(filters?: {
  categories?: string[]
  location?: { lat: number; lng: number }
  maxDistance?: number
  hasAvailableSlots?: boolean
  minRating?: number
}): SocialActivity[] {
  const mockActivities: SocialActivity[] = [
    {
      id: 'mock-1',
      title: '豊中駅周辺でのチラシ配布スタッフ',
      description: '地域のイベント告知チラシを配布するお仕事です。高齢者の方も歓迎！',
      shortDescription: '地域のイベント告知チラシを配布するお仕事です。',
      category: 'work',
      subCategory: 'distribution',
      tags: ['チラシ配布', '豊中駅', '短時間'],
      teacherId: 'teacher-1',
      teacherName: '田中 太郎',
      teacherPhotoURL: null,
      teacherLocation: '豊中市',
      duration: 120,
      price: {
        amount: 1500,
        currency: 'JPY',
        unit: 'hour'
      },
      location: {
        type: 'offline',
        address: '大阪府豊中市本町1-1-1 豊中駅前',
        prefecture: '大阪府',
        city: '豊中市',
        area: '本町',
        coordinates: { lat: 34.7816, lng: 135.4956 }
      },
      maxStudents: 5,
      currentBookings: 2,
      hasAvailableSlots: true,
      difficulty: 'beginner',
      targetAudience: ['高齢者', '初心者歓迎'],
      requirements: ['体力に自信がある方'],
      rating: {
        average: 4.2,
        count: 15,
        distribution: { 1: 0, 2: 1, 3: 2, 4: 7, 5: 5 }
      },
      viewCount: 245,
      favoriteCount: 12,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'mock-2',
      title: '千里中央公園での清掃ボランティア',
      description: '地域の公園清掃活動に参加しませんか？みんなで協力して美しい街づくりを！',
      shortDescription: '地域の公園清掃活動に参加しませんか？',
      category: 'volunteer',
      subCategory: 'cleaning',
      tags: ['清掃', '公園', 'ボランティア'],
      teacherId: 'teacher-2',
      teacherName: '佐藤 花子',
      teacherPhotoURL: null,
      teacherLocation: '豊中市',
      duration: 90,
      price: {
        amount: 0,
        currency: 'JPY',
        unit: 'session'
      },
      location: {
        type: 'offline',
        address: '大阪府豊中市新千里東町1-2-2 千里中央公園',
        prefecture: '大阪府',
        city: '豊中市',
        area: '新千里東町',
        coordinates: { lat: 34.7889, lng: 135.4889 }
      },
      maxStudents: 20,
      currentBookings: 8,
      hasAvailableSlots: true,
      difficulty: 'beginner',
      targetAudience: ['地域住民', '環境意識の高い方'],
      requirements: ['軍手持参'],
      rating: {
        average: 4.8,
        count: 32,
        distribution: { 1: 0, 2: 0, 3: 1, 4: 6, 5: 25 }
      },
      viewCount: 156,
      favoriteCount: 28,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  // カテゴリフィルター適用
  if (filters?.categories && filters.categories.length > 0) {
    return mockActivities.filter(activity => filters.categories!.includes(activity.category))
  }

  return mockActivities
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
