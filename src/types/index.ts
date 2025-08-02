// ユーザー関連の型
export interface User {
  id: string
  email: string
  displayName: string
  photoURL?: string
  bio?: string
  age?: number
  location?: string
  skills: string[]
  interests: string[]
  rating: number
  reviewCount: number
  createdAt: Date
  updatedAt: Date
}

// スキル関連の型
export interface Skill {
  id: string
  title: string
  description: string
  category: SkillCategory
  teacherId: string
  teacher: User
  price: number
  duration: number // 分単位
  location: string
  isOnline: boolean
  maxStudents: number
  currentStudents: number
  images: string[]
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  rating: number
  reviewCount: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// スキルカテゴリ
export type SkillCategory = 
  | '料理・お菓子作り'
  | '園芸・ガーデニング'
  | '手芸・裁縫'
  | '楽器演奏'
  | 'パソコン・スマホ'
  | '語学'
  | '書道・絵画'
  | '健康・体操'
  | 'その他'

// 予約関連の型
export interface Booking {
  id: string
  skillId: string
  skill: Skill
  studentId: string
  student: User
  teacherId: string
  teacher: User
  scheduledAt: Date
  duration: number
  totalPrice: number
  status: BookingStatus
  paymentStatus: PaymentStatus
  paymentIntentId?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export type BookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'

// レビュー関連の型
export interface Review {
  id: string
  bookingId: string
  skillId: string
  reviewerId: string
  reviewer: User
  revieweeId: string
  reviewee: User
  rating: number
  comment: string
  createdAt: Date
}

// メッセージ関連の型
export interface Message {
  id: string
  conversationId: string
  senderId: string
  sender: User
  content: string
  type: 'text' | 'image' | 'file'
  isRead: boolean
  createdAt: Date
}

export interface Conversation {
  id: string
  participants: string[]
  participantUsers: User[]
  lastMessage?: Message
  lastMessageAt?: Date
  createdAt: Date
}

// 検索関連の型
export interface SearchFilters {
  category?: SkillCategory
  location?: string
  priceRange?: {
    min: number
    max: number
  }
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  isOnline?: boolean
  rating?: number
}

export interface SearchResult {
  skills: Skill[]
  total: number
  page: number
  limit: number
}

// API レスポンス型
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// フォーム関連の型
export interface SkillFormData {
  title: string
  description: string
  category: SkillCategory
  price: number
  duration: number
  location: string
  isOnline: boolean
  maxStudents: number
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export interface UserProfileFormData {
  displayName: string
  bio: string
  age: number
  location: string
  skills: string[]
  interests: string[]
}
