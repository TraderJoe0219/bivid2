import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
  typescript: true,
});

export interface CreatePaymentIntentParams {
  amount: number;
  currency: string;
  metadata: {
    bookingId: string;
    activityId: string;
    participantCount: string;
    contactEmail: string;
  };
}

export const createPaymentIntent = async (params: CreatePaymentIntentParams) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: params.amount,
      currency: params.currency,
      metadata: params.metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error('Stripe payment intent creation failed:', error);
    throw new Error('Failed to create payment intent');
  }
};

export const confirmPaymentIntent = async (paymentIntentId: string) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error('Stripe payment intent confirmation failed:', error);
    throw new Error('Failed to confirm payment intent');
  }
};

export const refundPayment = async (
  paymentIntentId: string,
  amount?: number,
  reason?: string
) => {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount,
      reason: reason as Stripe.RefundCreateParams.Reason,
    });

    return refund;
  } catch (error) {
    console.error('Stripe refund failed:', error);
    throw new Error('Failed to process refund');
  }
};

export const constructWebhookEvent = (
  body: string | Buffer,
  signature: string,
  secret: string
) => {
  try {
    return stripe.webhooks.constructEvent(body, signature, secret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    throw new Error('Invalid webhook signature');
  }
};

export const handleWebhookEvent = async (event: Stripe.Event) => {
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('Payment succeeded:', paymentIntent.id);
      // Here you would update the booking status in your database
      break;
    
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object as Stripe.PaymentIntent;
      console.log('Payment failed:', failedPayment.id);
      // Here you would handle the failed payment
      break;
    
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
};