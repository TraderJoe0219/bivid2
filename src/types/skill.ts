// スキル検索・発見機能用の型定義

export enum SkillCategory {
  COOKING = 'cooking',           // 料理・お菓子作り
  GARDENING = 'gardening',       // 園芸・ガーデニング
  HANDICRAFT = 'handicraft',     // 手芸・裁縫
  MUSIC = 'music',               // 楽器演奏
  TECHNOLOGY = 'technology',     // パソコン・スマホ
  LANGUAGE = 'language',         // 語学
  ART = 'art',                   // 書道・絵画
  HEALTH = 'health',             // 健康・体操
  OTHER = 'other'                // その他
}

export enum SocialActivityCategory {
  WORK = 'work',                 // 仕事・軽作業
  VOLUNTEER = 'volunteer',       // ボランティア
  HOBBY = 'hobby',               // 趣味・サークル
  EVENT = 'event',               // 地域イベント
  SEMINAR = 'seminar',           // 講演会・セミナー
  MEETING = 'meeting'            // 集会
}

// スキル詳細情報
export interface Skill {
  id: string
  title: string
  description: string
  shortDescription: string
  category: SkillCategory
  subCategory?: string
  tags: string[]
  
  // 講師情報
  teacherId: string
  teacher: {
    id: string
    name: string
    displayName: string
    photoURL?: string
    bio?: string
    location: string
    joinedDate: Date
    verificationStatus: {
      isEmailVerified: boolean
      isPhoneVerified: boolean
      isDocumentVerified: boolean
    }
    rating: {
      average: number
      count: number
      asTeacher: number
    }
    teachingExperience: number // 年数
    specialties: string[]
    languages: string[]
  }
  
  // 開催情報
  schedule: {
    type: 'flexible' | 'fixed' | 'on_demand'
    availableSlots?: Array<{
      dayOfWeek: number // 0=日曜日, 1=月曜日, ...
      startTime: string // "09:00"
      endTime: string   // "18:00"
      isAvailable: boolean
    }>
    fixedDates?: Array<{
      date: Date
      startTime: string
      endTime: string
      maxStudents: number
      currentBookings: number
    }>
  }
  
  // 場所・形式
  location: {
    type: 'offline' | 'online' | 'hybrid'
    address?: string
    coordinates?: {
      lat: number
      lng: number
    }
    onlineTools?: string[] // Zoom, Skype, etc.
    directions?: string
  }
  
  // 料金・時間
  pricing: {
    type: 'per_hour' | 'per_session' | 'per_course' | 'free'
    amount: number
    currency: 'JPY'
    unit: string // "時間", "回", "コース"
    discounts?: Array<{
      type: 'bulk' | 'early_bird' | 'senior'
      description: string
      discount: number // パーセンテージまたは固定額
    }>
  }
  
  duration: {
    typical: number // 分
    minimum: number
    maximum: number
    flexible: boolean
  }
  
  // 参加者設定
  capacity: {
    maxStudents: number
    minStudents: number
    currentBookings: number
    waitingList: number
  }
  
  // レベル・対象者
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'all_levels'
  targetAudience: string[]
  ageRange: {
    min?: number
    max?: number
    description: string
  }
  prerequisites: string[]
  materials: string[]
  
  // メディア
  images: string[]
  videos?: string[]
  documents?: Array<{
    title: string
    url: string
    type: 'pdf' | 'doc' | 'other'
  }>
  
  // 評価・レビュー
  rating: {
    average: number
    count: number
    distribution: {
      5: number
      4: number
      3: number
      2: number
      1: number
    }
  }
  reviews: SkillReview[]
  
  // 統計情報
  statistics: {
    viewCount: number
    favoriteCount: number
    bookingCount: number
    completionRate: number
    repeatCustomerRate: number
  }
  
  // 設定・ステータス
  isActive: boolean
  isApproved: boolean
  isFeatured: boolean
  isAvailableForBooking: boolean
  
  // タイムスタンプ
  createdAt: Date
  updatedAt: Date
  lastBookedAt?: Date
}

// スキルレビュー
export interface SkillReview {
  id: string
  skillId: string
  studentId: string
  student: {
    name: string
    photoURL?: string
    verifiedStatus: boolean
  }
  rating: number
  title?: string
  comment: string
  pros?: string[]
  cons?: string[]
  wouldRecommend: boolean
  helpfulCount: number
  reportedCount: number
  createdAt: Date
  updatedAt: Date
}

// 検索パラメータ
export interface SkillSearchParams {
  keyword?: string
  categories?: SkillCategory[]
  location?: {
    lat: number
    lng: number
    radius: number // km
  }
  priceRange?: {
    min: number
    max: number
  }
  dateRange?: {
    start: Date
    end: Date
  }
  timeSlots?: Array<{
    dayOfWeek: number
    startTime: string
    endTime: string
  }>
  difficulty?: Array<'beginner' | 'intermediate' | 'advanced'>
  locationType?: Array<'offline' | 'online' | 'hybrid'>
  rating?: number // 最低評価
  availability?: 'immediate' | 'this_week' | 'this_month' | 'any'
  sortBy?: 'relevance' | 'distance' | 'rating' | 'price_low' | 'price_high' | 'newest' | 'popular'
  page?: number
  limit?: number
}

// 検索結果
export interface SkillSearchResult {
  skills: Skill[]
  total: number
  page: number
  limit: number
  hasMore: boolean
  facets: {
    categories: Array<{
      category: SkillCategory
      count: number
    }>
    priceRanges: Array<{
      range: string
      count: number
    }>
    ratings: Array<{
      rating: number
      count: number
    }>
    locations: Array<{
      type: string
      count: number
    }>
  }
}

// フィルターオプション
export interface FilterOptions {
  categories: Array<{
    value: SkillCategory
    label: string
    icon: string
    color: string
    count?: number
  }>
  priceRanges: Array<{
    value: string
    label: string
    min: number
    max?: number
    count?: number
  }>
  distances: Array<{
    value: number
    label: string
    count?: number
  }>
  difficulties: Array<{
    value: string
    label: string
    count?: number
  }>
  locationTypes: Array<{
    value: string
    label: string
    count?: number
  }>
}

// お気に入り情報
export interface SkillFavorite {
  id: string
  userId: string
  skillId: string
  createdAt: Date
}

// 検索履歴
export interface SearchHistory {
  id: string
  userId: string
  query: string
  params: SkillSearchParams
  resultCount: number
  createdAt: Date
}

// マップマーカー情報
export interface SkillMarker {
  id: string
  skillId: string
  position: {
    lat: number
    lng: number
  }
  title: string
  category: SkillCategory
  rating: number
  price: number
  isOnline: boolean
  teacherName: string
  distance?: number
}

// マーカークラスター情報
export interface SkillCluster {
  position: {
    lat: number
    lng: number
  }
  count: number
  skills: SkillMarker[]
  averageRating: number
  priceRange: {
    min: number
    max: number
  }
}

// カテゴリー設定
export const SKILL_CATEGORIES: FilterOptions['categories'] = [
  {
    value: SkillCategory.COOKING,
    label: '料理・お菓子作り',
    icon: '🍳',
    color: 'orange'
  },
  {
    value: SkillCategory.GARDENING,
    label: '園芸・ガーデニング',
    icon: '🌱',
    color: 'green'
  },
  {
    value: SkillCategory.HANDICRAFT,
    label: '手芸・裁縫',
    icon: '🧵',
    color: 'pink'
  },
  {
    value: SkillCategory.MUSIC,
    label: '楽器演奏',
    icon: '🎵',
    color: 'purple'
  },
  {
    value: SkillCategory.TECHNOLOGY,
    label: 'パソコン・スマホ',
    icon: '💻',
    color: 'blue'
  },
  {
    value: SkillCategory.LANGUAGE,
    label: '語学',
    icon: '🗣️',
    color: 'indigo'
  },
  {
    value: SkillCategory.ART,
    label: '書道・絵画',
    icon: '🎨',
    color: 'red'
  },
  {
    value: SkillCategory.HEALTH,
    label: '健康・体操',
    icon: '🏃‍♂️',
    color: 'teal'
  },
  {
    value: SkillCategory.OTHER,
    label: 'その他',
    icon: '📝',
    color: 'gray'
  }
]

// デフォルト検索パラメータ
export const DEFAULT_SEARCH_PARAMS: SkillSearchParams = {
  keyword: '',
  categories: [],
  location: undefined,
  priceRange: undefined,
  dateRange: undefined,
  difficulty: [],
  locationType: [],
  rating: 0,
  availability: 'any',
  sortBy: 'relevance',
  page: 1,
  limit: 20
}