'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import {
  CreditCard,
  Building2,
  Banknote,
  Lock,
  AlertCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { PaymentMethod } from '@/types/booking';
import { createPaymentIntent, confirmPayment } from '@/lib/stripe';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  bookingId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
  disabled?: boolean;
}

interface StripePaymentFormProps {
  bookingId: string;
  amount: number;
  currency: string;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
  disabled?: boolean;
}

function StripePaymentForm({
  bookingId,
  amount,
  currency,
  onPaymentSuccess,
  onPaymentError,
  disabled = false,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Payment Intent作成
    const createIntent = async () => {
      try {
        const response = await createPaymentIntent({
          amount,
          currency,
          bookingId,
          metadata: {
            activityId: 'temp', // TODO: 実際のactivityIdを渡す
            participantCount: 1, // TODO: 実際の参加人数を渡す
            contactEmail: 'temp@example.com', // TODO: 実際のメールアドレスを渡す
          },
        });
        setClientSecret(response.clientSecret);
      } catch (err) {
        onPaymentError(err instanceof Error ? err.message : '決済の準備に失敗しました');
      }
    };

    if (bookingId && amount > 0) {
      createIntent();
    }
  }, [bookingId, amount, currency, onPaymentError]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);
    setError('');

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('カード情報が見つかりません');
      setIsProcessing(false);
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        setError(error.message || '決済に失敗しました');
        onPaymentError(error.message || '決済に失敗しました');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onPaymentSuccess(paymentIntent.id);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '決済処理中にエラーが発生しました';
      setError(errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: true,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          カード情報
        </label>
        <div className="bg-white p-3 border border-gray-300 rounded-md">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start space-x-2">
        <Lock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-700">
          <p className="font-semibold mb-1">安全な決済</p>
          <p>Stripeによる安全な決済システムを使用しています。カード情報は当サイトに保存されません。</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || !clientSecret || isProcessing || disabled}
        className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>決済処理中...</span>
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4" />
            <span>¥{amount.toLocaleString()}を決済する</span>
          </>
        )}
      </button>
    </form>
  );
}

export function PaymentForm({
  bookingId,
  amount,
  currency,
  paymentMethod,
  onPaymentMethodChange,
  onPaymentSuccess,
  onPaymentError,
  disabled = false,
}: PaymentFormProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  const paymentMethods = [
    {
      id: 'card' as PaymentMethod,
      name: 'クレジットカード',
      icon: CreditCard,
      description: '即座に決済完了',
      available: true,
    },
    {
      id: 'transfer' as PaymentMethod,
      name: '銀行振込',
      icon: Building2,
      description: '振込確認後に予約確定',
      available: true,
    },
    {
      id: 'cash' as PaymentMethod,
      name: '現地決済',
      icon: Banknote,
      description: '活動当日にお支払い',
      available: true,
    },
  ];

  const handleCardPaymentSuccess = (paymentIntentId: string) => {
    setShowSuccess(true);
    setTimeout(() => {
      onPaymentSuccess(paymentIntentId);
    }, 2000);
  };

  const handleOtherPaymentMethod = () => {
    // 銀行振込や現地決済の場合は、すぐに成功として扱う
    setShowSuccess(true);
    setTimeout(() => {
      onPaymentSuccess('manual-payment');
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {paymentMethod === 'card' ? '決済が完了しました' : '予約を受け付けました'}
        </h3>
        <p className="text-gray-600">
          {paymentMethod === 'card' && '予約が確定しました。'}
          {paymentMethod === 'transfer' && '振込先情報をメールでお送りします。'}
          {paymentMethod === 'cash' && '当日、現地でお支払いください。'}
        </p>
      </div>
    );
  }

  const elementsOptions: StripeElementsOptions = {
    appearance: {
      theme: 'stripe',
    },
  };

  return (
    <div className="space-y-6">
      {/* 決済方法選択 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">決済方法を選択</h3>
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                paymentMethod === method.id
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${!method.available ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => method.available && onPaymentMethodChange(method.id)}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  paymentMethod === method.id
                    ? 'border-orange-500 bg-orange-500'
                    : 'border-gray-300'
                }`}>
                  {paymentMethod === method.id && (
                    <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
                  )}
                </div>
                <method.icon className="w-5 h-5 text-gray-600" />
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{method.name}</div>
                  <div className="text-sm text-gray-600">{method.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 決済フォーム */}
      {paymentMethod === 'card' ? (
        <Elements stripe={stripePromise} options={elementsOptions}>
          <StripePaymentForm
            bookingId={bookingId}
            amount={amount}
            currency={currency}
            onPaymentSuccess={handleCardPaymentSuccess}
            onPaymentError={onPaymentError}
            disabled={disabled}
          />
        </Elements>
      ) : paymentMethod === 'transfer' ? (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">銀行振込について</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• 予約確定後、振込先情報をメールでお送りします</p>
              <p>• 振込確認後、正式に予約が確定します</p>
              <p>• 振込期限は3日以内です</p>
            </div>
          </div>
          <button
            onClick={handleOtherPaymentMethod}
            disabled={disabled}
            className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            銀行振込で予約する
          </button>
        </div>
      ) : paymentMethod === 'cash' ? (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">現地決済について</h4>
            <div className="text-sm text-green-700 space-y-1">
              <p>• 活動当日、現地でお支払いください</p>
              <p>• 現金またはキャッシュレス決済が可能です</p>
              <p>• 予約は仮確定となります</p>
            </div>
          </div>
          <button
            onClick={handleOtherPaymentMethod}
            disabled={disabled}
            className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            現地決済で予約する
          </button>
        </div>
      ) : null}
    </div>
  );
}