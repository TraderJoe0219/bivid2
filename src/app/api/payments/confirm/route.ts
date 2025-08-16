import { NextRequest, NextResponse } from 'next/server';
import { confirmPaymentIntent } from '@/lib/stripe-server';
import BookingService from '@/lib/bookings';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId } = await request.json();
    
    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment Intent IDが必要です' },
        { status: 400 }
      );
    }

    // 認証チェック
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'ユーザー認証が必要です' },
        { status: 401 }
      );
    }

    // Stripeで決済状況を確認
    const paymentIntent = await confirmPaymentIntent(paymentIntentId);
    
    if (!paymentIntent.metadata || !paymentIntent.metadata.bookingId) {
      return NextResponse.json(
        { error: '予約情報が見つかりません' },
        { status: 400 }
      );
    }

    const bookingId = paymentIntent.metadata.bookingId;
    
    // 予約の存在確認
    const booking = await BookingService.getBooking(bookingId);
    if (!booking) {
      return NextResponse.json(
        { error: '予約が見つかりません' },
        { status: 404 }
      );
    }

    // 予約者チェック
    if (booking.studentId !== user.uid) {
      return NextResponse.json(
        { error: 'この予約の確認権限がありません' },
        { status: 403 }
      );
    }

    // 決済状況に応じて予約ステータスを更新
    if (paymentIntent.status === 'succeeded') {
      await BookingService.updatePaymentStatus(bookingId, 'paid');
      
      // 決済完了時は予約を確定状態にする
      if (booking.status === 'pending') {
        await BookingService.updateBookingStatus(bookingId, 'confirmed');
      }
    } else if (paymentIntent.status === 'payment_failed') {
      await BookingService.updatePaymentStatus(bookingId, 'failed');
    }

    return NextResponse.json({
      success: true,
      paymentStatus: paymentIntent.status,
      message: paymentIntent.status === 'succeeded' 
        ? '決済が完了しました' 
        : '決済処理中です',
    });

  } catch (error) {
    console.error('Payment confirmation error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: '決済確認に失敗しました' },
      { status: 500 }
    );
  }
}