/**
 * 活動詳細表示用の型定義
 */
import { SocialActivityCategory } from './skill'

// レビュー情報
export interface ActivityReview {
  id: string;
  rating: number;
  comment: string;
  reviewerName: string;
  reviewerId: string;
  date: string;
  helpful: number;
  pros?: string[];
  cons?: string[];
  wouldRecommend: boolean;
}

// 提供者プロフィール
export interface ActivityOrganizer {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  rating: number;
  reviewCount: number;
  joinedDate: string;
  verifiedStatus: boolean;
  specialties: string[];
  location: string;
  experience: number; // 年数
}

// 活動の基本情報
export interface SocialActivity {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: SocialActivityCategory;
  subCategory?: string;
  tags: string[];
  
  // 日時・場所情報
  schedule: {
    type: 'single' | 'recurring' | 'flexible';
    dates?: Array<{
      date: Date;
      startTime: string;
      endTime: string;
      maxParticipants: number;
      currentParticipants: number;
    }>;
    recurring?: {
      pattern: 'daily' | 'weekly' | 'monthly';
      daysOfWeek?: number[];
      startTime: string;
      endTime: string;
      startDate: Date;
      endDate?: Date;
    };
  };
  duration: number; // 分
  
  // 価格情報
  pricing: {
    type: 'free' | 'paid' | 'donation';
    amount: number;
    currency: 'JPY';
    unit: string; // "回", "日", "時間"
  };
  
  // 位置情報
  location: {
    type: 'offline' | 'online' | 'hybrid';
    address?: string;
    coordinates?: google.maps.LatLngLiteral;
    onlineLink?: string;
    directions?: string;
  };
  
  // 評価・レビュー
  rating: {
    average: number;
    count: number;
    distribution: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };
  reviews: ActivityReview[];
  
  // 主催者情報
  organizer: ActivityOrganizer;
  
  // メディア
  images: string[];
  videos?: string[];
  
  // 参加者設定
  capacity: {
    maxParticipants: number;
    minParticipants: number;
    currentParticipants: number;
    waitingList: number;
  };
  
  // レベル・対象者
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'all_levels';
  targetAudience: string[];
  ageRange: {
    min?: number;
    max?: number;
    description: string;
  };
  requirements: string[];
  materials?: string[];
  
  // 統計情報
  statistics: {
    viewCount: number;
    favoriteCount: number;
    participantCount: number;
    completionRate: number;
    repeatParticipantRate: number;
  };
  
  // ステータス
  isActive: boolean;
  isApproved: boolean;
  isFeatured: boolean;
  registrationStatus: 'open' | 'closed' | 'waitlist' | 'cancelled';
  
  // タイムスタンプ
  createdAt: Date;
  updatedAt: Date;
  lastParticipatedAt?: Date;

  // 下位互換性のための追加プロパティ
  teacherName?: string;
  teacherPhotoURL?: string;
  teacherLocation?: string;
  price: {
    amount: number;
    unit: string;
  };
  maxStudents: number;
  currentBookings: number;
}

// お気に入り状態
export interface FavoriteStatus {
  [activityId: string]: boolean;
}

// 予約データ
export interface BookingData {
  activityId: string;
  participantCount: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  specialRequests?: string;
  totalAmount: number;
}
