import { z } from 'zod';

export const createBookingSchema = z.object({
  activityId: z.string().min(1, 'Activity ID is required'),
  participantCount: z.number().min(1, '参加人数は1名以上である必要があります').max(50, '参加人数は50名以下である必要があります'),
  contactName: z.string().min(1, 'お名前を入力してください').max(100, 'お名前は100文字以下で入力してください'),
  contactEmail: z.string().email('正しいメールアドレスを入力してください'),
  contactPhone: z.string()
    .min(1, '電話番号を入力してください')
    .regex(/^[\d-+().\s]+$/, '正しい電話番号を入力してください'),
  specialRequests: z.string().max(500, '特別なご要望は500文字以下で入力してください').optional(),
  paymentMethod: z.enum(['card', 'transfer', 'cash'], {
    required_error: '決済方法を選択してください',
  }),
  scheduledAt: z.date({
    required_error: '予約日時を選択してください',
  }),
  duration: z.number().min(30, '所要時間は30分以上である必要があります').max(480, '所要時間は8時間以下である必要があります'),
});

export const updateBookingSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']).optional(),
  teacherNotes: z.string().max(500, '主催者メモは500文字以下で入力してください').optional(),
  studentNotes: z.string().max(500, '参加者メモは500文字以下で入力してください').optional(),
});

export const paymentIntentSchema = z.object({
  amount: z.number().min(0, '金額は0以上である必要があります'),
  currency: z.string().min(3, '通貨コードは3文字以上である必要があります'),
  bookingId: z.string().min(1, 'Booking ID is required'),
  metadata: z.object({
    activityId: z.string(),
    participantCount: z.number(),
    contactEmail: z.string().email(),
  }),
});

export const refundSchema = z.object({
  paymentIntentId: z.string().min(1, 'Payment Intent ID is required'),
  amount: z.number().min(0, '返金額は0以上である必要があります').optional(),
  reason: z.string().max(200, '返金理由は200文字以下で入力してください').optional(),
});

export const calendarAvailabilitySchema = z.object({
  date: z.date({
    required_error: '日付を選択してください',
  }),
  timeSlots: z.array(z.object({
    start: z.string().regex(/^\d{2}:\d{2}$/, '正しい時刻形式（HH:MM）で入力してください'),
    end: z.string().regex(/^\d{2}:\d{2}$/, '正しい時刻形式（HH:MM）で入力してください'),
    available: z.boolean(),
    capacity: z.number().min(1, '定員は1名以上である必要があります'),
    bookedCount: z.number().min(0, '予約済み人数は0以上である必要があります'),
  })),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
export type PaymentIntentInput = z.infer<typeof paymentIntentSchema>;
export type RefundInput = z.infer<typeof refundSchema>;
export type CalendarAvailabilityInput = z.infer<typeof calendarAvailabilitySchema>;