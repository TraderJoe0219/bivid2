import { NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent, handleWebhookEvent } from '@/lib/stripe-server';
import BookingService from '@/lib/bookings';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing Stripe signature' },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not set');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Stripe署名検証
    const event = constructWebhookEvent(body, signature, webhookSecret);

    // イベント処理
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const bookingId = paymentIntent.metadata?.bookingId;

        if (bookingId) {
          // 予約の決済ステータスを更新
          await BookingService.updatePaymentStatus(bookingId, 'paid');
          
          // 予約を確定状態にする
          const booking = await BookingService.getBooking(bookingId);
          if (booking && booking.status === 'pending') {
            await BookingService.updateBookingStatus(bookingId, 'confirmed');
          }

          console.log(`Payment succeeded for booking ${bookingId}`);
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const bookingId = paymentIntent.metadata?.bookingId;

        if (bookingId) {
          // 決済失敗ステータスを更新
          await BookingService.updatePaymentStatus(bookingId, 'failed');
          console.log(`Payment failed for booking ${bookingId}`);
        }
        break;
      }

      case 'charge.dispute.created': {
        const dispute = event.data.object;
        console.log('Dispute created:', dispute.id);
        // チャージバック対応ロジックを実装
        break;
      }

      case 'refund.created': {
        const refund = event.data.object;
        console.log('Refund created:', refund.id);
        // 返金処理通知ロジックを実装
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}