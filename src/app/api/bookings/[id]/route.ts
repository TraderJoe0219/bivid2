import { NextRequest, NextResponse } from 'next/server';
import { updateBookingSchema } from '@/lib/validations/booking';
import BookingService from '@/lib/bookings';
import { getCurrentUser } from '@/lib/auth';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    
    // 認証チェック
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'ユーザー認証が必要です' },
        { status: 401 }
      );
    }

    const booking = await BookingService.getBooking(id);
    
    if (!booking) {
      return NextResponse.json(
        { error: '予約が見つかりません' },
        { status: 404 }
      );
    }

    // アクセス権限チェック（予約者または主催者のみ）
    if (booking.studentId !== user.uid && booking.teacherId !== user.uid && !user.admin) {
      return NextResponse.json(
        { error: 'アクセス権限がありません' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      booking,
    });

  } catch (error) {
    console.error('Booking fetch error:', error);
    
    return NextResponse.json(
      { error: '予約情報の取得に失敗しました' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // リクエストデータのバリデーション
    const validatedData = updateBookingSchema.parse(body);
    
    // 認証チェック
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'ユーザー認証が必要です' },
        { status: 401 }
      );
    }

    const booking = await BookingService.getBooking(id);
    
    if (!booking) {
      return NextResponse.json(
        { error: '予約が見つかりません' },
        { status: 404 }
      );
    }

    // 権限チェック（主催者のみステータス変更可能）
    if (validatedData.status && booking.teacherId !== user.uid && !user.admin) {
      return NextResponse.json(
        { error: 'ステータス変更の権限がありません' },
        { status: 403 }
      );
    }

    // ステータス更新
    if (validatedData.status) {
      await BookingService.updateBookingStatus(
        id,
        validatedData.status,
        validatedData.teacherNotes
      );
    }

    return NextResponse.json({
      success: true,
      message: '予約情報を更新しました',
    });

  } catch (error) {
    console.error('Booking update error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: '予約情報の更新に失敗しました' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const reason = searchParams.get('reason') || 'ユーザーによるキャンセル';
    
    // 認証チェック
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'ユーザー認証が必要です' },
        { status: 401 }
      );
    }

    const booking = await BookingService.getBooking(id);
    
    if (!booking) {
      return NextResponse.json(
        { error: '予約が見つかりません' },
        { status: 404 }
      );
    }

    // キャンセル権限チェック（予約者または主催者）
    if (booking.studentId !== user.uid && booking.teacherId !== user.uid && !user.admin) {
      return NextResponse.json(
        { error: 'キャンセル権限がありません' },
        { status: 403 }
      );
    }

    const isByOrganizer = booking.teacherId === user.uid;
    const refundCalculation = await BookingService.cancelBooking(id, reason, isByOrganizer);

    return NextResponse.json({
      success: true,
      message: '予約をキャンセルしました',
      refund: refundCalculation,
    });

  } catch (error) {
    console.error('Booking cancellation error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: '予約のキャンセルに失敗しました' },
      { status: 500 }
    );
  }
}