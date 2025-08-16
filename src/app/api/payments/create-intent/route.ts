import { NextRequest, NextResponse } from 'next/server';
import { paymentIntentSchema } from '@/lib/validations/booking';
import { createPaymentIntent } from '@/lib/stripe-server';
import BookingService from '@/lib/bookings';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // リクエストデータのバリデーション
    const validatedData = paymentIntentSchema.parse(body);
    
    // 認証チェック
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'ユーザー認証が必要です' },
        { status: 401 }
      );
    }

    // 予約の存在確認
    const booking = await BookingService.getBooking(validatedData.bookingId);
    if (!booking) {
      return NextResponse.json(
        { error: '予約が見つかりません' },
        { status: 404 }
      );
    }

    // 予約者チェック
    if (booking.studentId !== user.uid) {
      return NextResponse.json(
        { error: 'この予約の決済権限がありません' },
        { status: 403 }
      );
    }

    // 予約状態チェック
    if (booking.status === 'cancelled') {
      return NextResponse.json(
        { error: 'キャンセルされた予約は決済できません' },
        { status: 400 }
      );
    }

    if (booking.paymentStatus === 'paid') {
      return NextResponse.json(
        { error: 'この予約は既に決済済みです' },
        { status: 400 }
      );
    }

    // 金額検証
    if (validatedData.amount !== booking.pricing.totalAmount) {
      return NextResponse.json(
        { error: '決済金額が予約金額と一致しません' },
        { status: 400 }
      );
    }

    // Stripe Payment Intent作成
    const paymentIntent = await createPaymentIntent({
      amount: validatedData.amount,
      currency: validatedData.currency,
      metadata: {
        bookingId: validatedData.bookingId,
        activityId: validatedData.metadata.activityId,
        participantCount: validatedData.metadata.participantCount.toString(),
        contactEmail: validatedData.metadata.contactEmail,
      },
    });

    // 予約にPayment Intent IDを保存
    await BookingService.updatePaymentStatus(
      validatedData.bookingId,
      'pending',
      paymentIntent.paymentIntentId
    );

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.clientSecret,
      paymentIntentId: paymentIntent.paymentIntentId,
    });

  } catch (error) {
    console.error('Payment intent creation error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: '決済の準備に失敗しました' },
      { status: 500 }
    );
  }
}