import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  Booking, 
  CreateBookingRequest, 
  BookingStatus, 
  PaymentStatus,
  CancellationPolicy,
  DEFAULT_CANCELLATION_POLICY,
  RefundCalculation,
  BookingPricing
} from '@/types/booking';
import { calculatePricing } from './stripe';

export class BookingService {
  private static readonly COLLECTION_NAME = 'bookings';

  static async createBooking(
    request: CreateBookingRequest,
    userId: string,
    teacherId: string
  ): Promise<string> {
    try {
      // 料金計算
      const baseAmount = await this.getActivityPrice(request.activityId);
      const totalBaseAmount = baseAmount * request.participantCount;
      const pricing = calculatePricing(totalBaseAmount);

      const bookingData: Omit<Booking, 'id'> = {
        skillId: request.activityId,
        teacherId,
        studentId: userId,
        scheduledAt: Timestamp.fromDate(request.scheduledAt),
        duration: request.duration,
        participantCount: request.participantCount,
        pricing: {
          ...pricing,
          currency: 'JPY',
        },
        paymentMethod: request.paymentMethod,
        paymentStatus: 'pending',
        status: 'pending',
        studentNotes: request.specialRequests,
        contactInfo: {
          name: request.contactName,
          email: request.contactEmail,
          phone: request.contactPhone,
        },
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp,
      };

      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), bookingData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw new Error('予約の作成に失敗しました');
    }
  }

  static async getBooking(bookingId: string): Promise<Booking | null> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, bookingId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Booking;
      }
      return null;
    } catch (error) {
      console.error('Error getting booking:', error);
      throw new Error('予約情報の取得に失敗しました');
    }
  }

  static async updateBookingStatus(
    bookingId: string,
    status: BookingStatus,
    notes?: string
  ): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, bookingId);
      const updateData: Partial<Booking> = {
        status,
        updatedAt: serverTimestamp() as Timestamp,
      };

      if (status === 'confirmed') {
        updateData.confirmedAt = serverTimestamp() as Timestamp;
      } else if (status === 'completed') {
        updateData.completedAt = serverTimestamp() as Timestamp;
      }

      if (notes) {
        updateData.teacherNotes = notes;
      }

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw new Error('予約ステータスの更新に失敗しました');
    }
  }

  static async updatePaymentStatus(
    bookingId: string,
    paymentStatus: PaymentStatus,
    paymentIntentId?: string
  ): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, bookingId);
      const updateData: Partial<Booking> = {
        paymentStatus,
        updatedAt: serverTimestamp() as Timestamp,
      };

      if (paymentIntentId) {
        updateData.paymentIntentId = paymentIntentId;
      }

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw new Error('決済ステータスの更新に失敗しました');
    }
  }

  static async getUserBookings(
    userId: string,
    role: 'student' | 'teacher' = 'student'
  ): Promise<Booking[]> {
    try {
      const field = role === 'student' ? 'studentId' : 'teacherId';
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where(field, '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];
    } catch (error) {
      console.error('Error getting user bookings:', error);
      throw new Error('予約履歴の取得に失敗しました');
    }
  }

  static async getActivityBookings(activityId: string): Promise<Booking[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('skillId', '==', activityId),
        orderBy('scheduledAt', 'asc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];
    } catch (error) {
      console.error('Error getting activity bookings:', error);
      throw new Error('活動の予約情報取得に失敗しました');
    }
  }

  static calculateCancellationRefund(
    booking: Booking,
    cancellationPolicy: CancellationPolicy = DEFAULT_CANCELLATION_POLICY,
    isByOrganizer = false
  ): RefundCalculation {
    const now = new Date();
    const scheduledDate = booking.scheduledAt.toDate();
    const hoursUntilEvent = (scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    let refundRate: number;
    let reason: string;

    if (isByOrganizer) {
      refundRate = cancellationPolicy.organizerCancellation;
      reason = '主催者都合によるキャンセル';
    } else if (hoursUntilEvent >= 24) {
      refundRate = cancellationPolicy.hours24Plus;
      reason = '24時間以上前のキャンセル';
    } else if (hoursUntilEvent > 0) {
      refundRate = cancellationPolicy.hours24Minus;
      reason = '24時間以内のキャンセル';
    } else {
      refundRate = cancellationPolicy.sameDay;
      reason = '当日キャンセル';
    }

    const originalAmount = booking.pricing.totalAmount;
    const refundAmount = Math.floor(originalAmount * (refundRate / 100));
    const cancellationFee = originalAmount - refundAmount;

    return {
      originalAmount,
      refundAmount,
      refundRate,
      cancellationFee,
      reason,
    };
  }

  static async cancelBooking(
    bookingId: string,
    reason: string,
    isByOrganizer = false
  ): Promise<RefundCalculation> {
    try {
      const booking = await this.getBooking(bookingId);
      if (!booking) {
        throw new Error('予約が見つかりません');
      }

      if (booking.status === 'cancelled') {
        throw new Error('この予約は既にキャンセルされています');
      }

      if (booking.status === 'completed') {
        throw new Error('完了した予約はキャンセルできません');
      }

      const refundCalculation = this.calculateCancellationRefund(booking, undefined, isByOrganizer);

      // 予約ステータスを更新
      await this.updateBookingStatus(bookingId, 'cancelled', reason);

      // 返金処理が必要な場合は、Stripe返金処理を呼び出す
      if (refundCalculation.refundAmount > 0 && booking.paymentIntentId) {
        // この部分は実際のStripe返金APIと連携する
        console.log('Refund needed:', refundCalculation);
      }

      return refundCalculation;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw new Error('予約のキャンセルに失敗しました');
    }
  }

  private static async getActivityPrice(activityId: string): Promise<number> {
    // 実際の実装では、activitiesコレクションから価格を取得
    // ここでは仮の値を返す
    try {
      const activityDoc = await getDoc(doc(db, 'activities', activityId));
      if (activityDoc.exists()) {
        return activityDoc.data().price || 0;
      }
      return 0;
    } catch (error) {
      console.error('Error getting activity price:', error);
      return 0;
    }
  }
}

export default BookingService;