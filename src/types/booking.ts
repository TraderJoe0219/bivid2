import { Timestamp } from 'firebase/firestore';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'card' | 'transfer' | 'cash';

export interface BookingPricing {
  baseAmount: number;
  tax: number;
  platformFee: number;
  paymentFee: number;
  totalAmount: number;
  currency: 'JPY';
}

export interface Booking {
  id: string;
  skillId: string;
  teacherId: string;
  studentId: string;
  scheduledAt: Timestamp;
  duration: number;
  participantCount: number;
  
  // 料金情報
  pricing: BookingPricing;
  
  // 決済情報
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentIntentId?: string;
  
  // ステータス
  status: BookingStatus;
  
  // 連絡事項
  studentNotes?: string;
  teacherNotes?: string;
  
  // 連絡先情報
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  
  // システム情報
  createdAt: Timestamp;
  updatedAt: Timestamp;
  confirmedAt?: Timestamp;
  completedAt?: Timestamp;
}

export interface CreateBookingRequest {
  activityId: string;
  participantCount: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  specialRequests?: string;
  paymentMethod: PaymentMethod;
  scheduledAt: Date;
  duration: number;
}

export interface BookingNotification {
  id: string;
  bookingId: string;
  recipientId: string;
  type: 'booking_created' | 'booking_confirmed' | 'booking_cancelled' | 'payment_completed' | 'reminder';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Timestamp;
}

export interface CancellationPolicy {
  hours24Plus: number; // 24時間以上前の返金率 (0-100)
  hours24Minus: number; // 24時間以内の返金率 (0-100)
  sameDay: number; // 当日の返金率 (0-100)
  organizerCancellation: number; // 主催者都合の返金率 (通常100)
}

export const DEFAULT_CANCELLATION_POLICY: CancellationPolicy = {
  hours24Plus: 100,
  hours24Minus: 50,
  sameDay: 0,
  organizerCancellation: 100,
};

export interface RefundCalculation {
  originalAmount: number;
  refundAmount: number;
  refundRate: number;
  cancellationFee: number;
  reason: string;
}

export interface BookingCalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: BookingStatus;
  participantCount: number;
  maxCapacity: number;
  isAvailable: boolean;
}