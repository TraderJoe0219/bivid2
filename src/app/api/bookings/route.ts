import { NextRequest, NextResponse } from 'next/server';
import { createBookingSchema } from '@/lib/validations/booking';
import BookingService from '@/lib/bookings';
import { getCurrentUser } from '@/lib/server-auth';
import { cors } from '@/middleware/cors';
import { rateLimit } from '@/middleware/rateLimit';
import { sanitizeInput } from '@/lib/security/validation';

// CORS preflight
export async function OPTIONS(request: NextRequest) {
  const preflight = cors(request)
  if (preflight instanceof NextResponse) return preflight
  return new NextResponse(null, { status: 204, headers: preflight })
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const rl = rateLimit(request, { windowMs: 60_000, max: 30 });
    const corsHeaders = cors(request) as Record<string, string>;
    if ('allowed' in rl && !rl.allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: corsHeaders }
      );
    }

    const raw = await request.json();
    const body = sanitizeInput(raw);
    
    // リクエストデータのバリデーション
    const validatedData = createBookingSchema.parse(body);
    
    // 認証チェック
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'ユーザー認証が必要です' },
        { status: 401, headers: corsHeaders }
      );
    }

    // 活動の主催者IDを取得（実際の実装では、activitiesコレクションから取得）
    const teacherId = body.teacherId; // 一時的な実装
    
    // 予約作成
    const bookingId = await BookingService.createBooking(
      {
        ...validatedData,
        scheduledAt: new Date(validatedData.scheduledAt),
      },
      user.uid,
      teacherId
    );

    return NextResponse.json(
      { 
        success: true, 
        bookingId,
        message: '予約リクエストを受け付けました' 
      },
      { status: 201, headers: corsHeaders }
    );

  } catch (error) {
    console.error('Booking creation error:', error);
    const corsHeaders = cors(request) as Record<string, string>;
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { error: '予約の作成に失敗しました' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Rate limit
    const rl = rateLimit(request, { windowMs: 60_000, max: 60 });
    const corsHeaders = cors(request) as Record<string, string>;
    if ('allowed' in rl && !rl.allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: corsHeaders }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const role = searchParams.get('role') as 'student' | 'teacher' || 'student';

    // 認証チェック
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'ユーザー認証が必要です' },
        { status: 401, headers: corsHeaders }
      );
    }

    // 自分の予約のみ取得可能
    const targetUserId = userId || user.uid;
    if (targetUserId !== user.uid && !user.admin) {
      return NextResponse.json(
        { error: 'アクセス権限がありません' },
        { status: 403, headers: corsHeaders }
      );
    }

    const bookings = await BookingService.getUserBookings(targetUserId, role);

    return NextResponse.json({
      success: true,
      bookings,
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Bookings fetch error:', error);
    const corsHeaders = cors(request) as Record<string, string>;
    
    return NextResponse.json(
      { error: '予約情報の取得に失敗しました' },
      { status: 500, headers: corsHeaders }
    );
  }
}