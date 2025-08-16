import { NextRequest, NextResponse } from 'next/server';
import { refundSchema } from '@/lib/validations/booking';
import { refundPayment } from '@/lib/stripe-server';
import BookingService from '@/lib/bookings';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // リクエストデータのバリデーション
    const validatedData = refundSchema.parse(body);
    
    // 認証チェック
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'ユーザー認証が必要です' },
        { status: 401 }
      );
    }

    // Payment Intent IDから予約を検索
    // 実際の実装では、bookingIdをリクエストに含めるか、
    // Payment Intent IDから予約を逆引きする仕組みが必要
    const bookingId = body.bookingId;
    if (!bookingId) {
      return NextResponse.json(
        { error: '予約IDが必要です' },
        { status: 400 }
      );
    }

    const booking = await BookingService.getBooking(bookingId);
    if (!booking) {
      return NextResponse.json(
        { error: '予約が見つかりません' },
        { status: 404 }
      );
    }

    // 返金権限チェック（主催者またはシステム管理者）
    if (booking.teacherId !== user.uid && !user.admin) {
      return NextResponse.json(
        { error: '返金処理の権限がありません' },
        { status: 403 }
      );
    }

    // 決済状況チェック
    if (booking.paymentStatus !== 'paid') {
      return NextResponse.json(
        { error: '決済が完了していない予約は返金できません' },
        { status: 400 }
      );
    }

    if (!booking.paymentIntentId) {
      return NextResponse.json(
        { error: '決済情報が見つかりません' },
        { status: 400 }
      );
    }

    // Stripe返金処理
    const refund = await refundPayment(
      booking.paymentIntentId,
      validatedData.amount,
      validatedData.reason
    );

    // 予約の決済ステータスを更新
    await BookingService.updatePaymentStatus(bookingId, 'refunded');

    return NextResponse.json({
      success: true,
      refundId: refund.id,
      amount: refund.amount,
      status: refund.status,
      message: '返金処理を開始しました',
    });

  } catch (error) {
    console.error('Refund processing error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: '返金処理に失敗しました' },
      { status: 500 }
    );
  }
}