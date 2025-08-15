/**
 * 活動詳細表示用の型定義
 */

// レビュー情報
export interface ActivityReview {
  id: string;
  rating: number;
  comment: string;
  reviewerName: string;
  reviewerId: string;
  date: string;
  helpful: number;
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
}

// 活動の基本情報
export interface SocialActivity {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  subCategory: string;
  tags: string[];
  
  // 日時・場所情報
  date: string; // 開催日時（表示用）
  duration: string; // 所要時間（表示用）
  capacity: number; // 定員
  
  // 価格
  price: number; // 金額（円）
  
  // 位置情報
  location: {
    address: string;
    coordinates?: google.maps.LatLngLiteral;
  };
  
  // 評価・レビュー
  rating: number; // 平均評価（数値）
  reviewCount: number; // レビュー数
  reviews?: ActivityReview[];
  
  // 提供者情報
  organizer: ActivityOrganizer;
  
  // メディア
  images?: string[];
  
  // その他の属性
  maxStudents: number;
  currentBookings: number;
  availableSlots: Array<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }>;
  videoURL: string | null;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  targetAudience: string[];
  requirements: string[];
  isActive: boolean;
  isApproved: boolean;
  viewCount: number;
  favoriteCount: number;
  createdAt: Date;
  updatedAt: Date;
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
