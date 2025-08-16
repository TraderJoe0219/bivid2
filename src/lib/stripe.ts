import { Stripe, loadStripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );
  }
  return stripePromise;
};

export interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
  bookingId: string;
  metadata: {
    activityId: string;
    participantCount: number;
    contactEmail: string;
  };
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export const createPaymentIntent = async (
  data: CreatePaymentIntentRequest
): Promise<CreatePaymentIntentResponse> => {
  const response = await fetch('/api/payments/create-intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create payment intent');
  }

  return response.json();
};

export const confirmPayment = async (paymentIntentId: string) => {
  const response = await fetch('/api/payments/confirm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ paymentIntentId }),
  });

  if (!response.ok) {
    throw new Error('Failed to confirm payment');
  }

  return response.json();
};

export const refundPayment = async (
  paymentIntentId: string,
  amount?: number,
  reason?: string
) => {
  const response = await fetch('/api/payments/refund', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      paymentIntentId,
      amount,
      reason,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refund payment');
  }

  return response.json();
};

export const formatCurrency = (amount: number, currency = 'JPY'): string => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const calculateTax = (baseAmount: number, taxRate = 0.1): number => {
  return Math.floor(baseAmount * taxRate);
};

export const calculatePlatformFee = (baseAmount: number, feeRate = 0.05): number => {
  return Math.floor(baseAmount * feeRate);
};

export interface PricingBreakdown {
  baseAmount: number;
  tax: number;
  platformFee: number;
  paymentFee: number;
  totalAmount: number;
}

export const calculatePricing = (
  baseAmount: number,
  taxRate = 0.1,
  platformFeeRate = 0.05,
  paymentFeeRate = 0.036
): PricingBreakdown => {
  const tax = calculateTax(baseAmount, taxRate);
  const platformFee = calculatePlatformFee(baseAmount, platformFeeRate);
  const subtotal = baseAmount + tax + platformFee;
  const paymentFee = Math.floor(subtotal * paymentFeeRate);
  const totalAmount = subtotal + paymentFee;

  return {
    baseAmount,
    tax,
    platformFee,
    paymentFee,
    totalAmount,
  };
};