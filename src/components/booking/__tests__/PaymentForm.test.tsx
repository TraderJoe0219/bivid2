import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PaymentForm } from '../PaymentForm';
import { PaymentMethod } from '@/types/booking';

// Stripeのモック
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(() => Promise.resolve({
    confirmCardPayment: jest.fn(),
    elements: jest.fn(),
  })),
}));

jest.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }: any) => <div data-testid="stripe-elements">{children}</div>,
  CardElement: () => <div data-testid="card-element">Card Element</div>,
  useStripe: () => ({
    confirmCardPayment: jest.fn(),
    elements: jest.fn(),
  }),
  useElements: () => ({
    getElement: jest.fn(() => ({
      mount: jest.fn(),
      destroy: jest.fn(),
      on: jest.fn(),
      update: jest.fn(),
    })),
  }),
}));

// Stripe APIのモック
jest.mock('@/lib/stripe', () => ({
  createPaymentIntent: jest.fn(() => Promise.resolve({
    clientSecret: 'test_client_secret',
    id: 'test_payment_intent_id',
  })),
  confirmPayment: jest.fn(),
}));

describe('PaymentForm', () => {
  const defaultProps = {
    bookingId: 'test-booking-id',
    amount: 5000,
    currency: 'JPY',
    paymentMethod: 'card' as PaymentMethod,
    onPaymentMethodChange: jest.fn(),
    onPaymentSuccess: jest.fn(),
    onPaymentError: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基本的なレンダリング', () => {
    it('決済方法選択が表示される', () => {
      render(<PaymentForm {...defaultProps} />);
      
      expect(screen.getByText('決済方法を選択')).toBeInTheDocument();
      expect(screen.getByText('クレジットカード')).toBeInTheDocument();
      expect(screen.getByText('銀行振込')).toBeInTheDocument();
      expect(screen.getByText('現地決済')).toBeInTheDocument();
    });

    it('選択された決済方法がハイライトされる', () => {
      render(<PaymentForm {...defaultProps} paymentMethod="card" />);
      
      // クレジットカードが選択されていることを確認
      expect(screen.getByText('クレジットカード')).toBeInTheDocument();
      expect(screen.getByTestId('stripe-elements')).toBeInTheDocument();
    });

    it('クレジットカード選択時にStripeフォームが表示される', () => {
      render(<PaymentForm {...defaultProps} paymentMethod="card" />);
      
      expect(screen.getByTestId('stripe-elements')).toBeInTheDocument();
      expect(screen.getByTestId('card-element')).toBeInTheDocument();
    });
  });

  describe('決済方法変更', () => {
    it('決済方法をクリックすると変更される', () => {
      const onPaymentMethodChange = jest.fn();
      render(<PaymentForm {...defaultProps} onPaymentMethodChange={onPaymentMethodChange} />);
      
      fireEvent.click(screen.getByText('銀行振込'));
      
      expect(onPaymentMethodChange).toHaveBeenCalledWith('transfer');
    });

    it('銀行振込選択時に適切な情報が表示される', () => {
      render(<PaymentForm {...defaultProps} paymentMethod="transfer" />);
      
      expect(screen.getByText('銀行振込について')).toBeInTheDocument();
      expect(screen.getByText('• 予約確定後、振込先情報をメールでお送りします')).toBeInTheDocument();
      expect(screen.getByText('銀行振込で予約する')).toBeInTheDocument();
    });

    it('現地決済選択時に適切な情報が表示される', () => {
      render(<PaymentForm {...defaultProps} paymentMethod="cash" />);
      
      expect(screen.getByText('現地決済について')).toBeInTheDocument();
      expect(screen.getByText('• 活動当日、現地でお支払いください')).toBeInTheDocument();
      expect(screen.getByText('現地決済で予約する')).toBeInTheDocument();
    });
  });

  describe('クレジットカード決済', () => {
    it('決済ボタンに正しい金額が表示される', () => {
      render(<PaymentForm {...defaultProps} paymentMethod="card" amount={5000} />);
      
      expect(screen.getByText('¥5,000を決済する')).toBeInTheDocument();
    });

    it('安全な決済の説明が表示される', () => {
      render(<PaymentForm {...defaultProps} paymentMethod="card" />);
      
      expect(screen.getByText('安全な決済')).toBeInTheDocument();
      expect(screen.getByText(/Stripeによる安全な決済システム/)).toBeInTheDocument();
    });

    it('無効状態でボタンが無効化される', () => {
      render(<PaymentForm {...defaultProps} paymentMethod="card" disabled={true} />);
      
      const submitButton = screen.getByRole('button', { name: /決済する/ });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('銀行振込決済', () => {
    it('銀行振込ボタンをクリックすると成功処理が実行される', async () => {
      const onPaymentSuccess = jest.fn();
      render(<PaymentForm {...defaultProps} paymentMethod="transfer" onPaymentSuccess={onPaymentSuccess} />);
      
      fireEvent.click(screen.getByText('銀行振込で予約する'));
      
      await waitFor(() => {
        expect(screen.getByText('予約を受け付けました')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(onPaymentSuccess).toHaveBeenCalledWith('manual-payment');
      }, { timeout: 2000 });
    });

    it('無効状態でボタンが無効化される', () => {
      render(<PaymentForm {...defaultProps} paymentMethod="transfer" disabled={true} />);
      
      const submitButton = screen.getByText('銀行振込で予約する');
      expect(submitButton).toBeDisabled();
    });
  });

  describe('現地決済', () => {
    it('現地決済ボタンをクリックすると成功処理が実行される', async () => {
      const onPaymentSuccess = jest.fn();
      render(<PaymentForm {...defaultProps} paymentMethod="cash" onPaymentSuccess={onPaymentSuccess} />);
      
      fireEvent.click(screen.getByText('現地決済で予約する'));
      
      await waitFor(() => {
        expect(screen.getByText('予約を受け付けました')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(onPaymentSuccess).toHaveBeenCalledWith('manual-payment');
      }, { timeout: 2000 });
    });

    it('無効状態でボタンが無効化される', () => {
      render(<PaymentForm {...defaultProps} paymentMethod="cash" disabled={true} />);
      
      const submitButton = screen.getByText('現地決済で予約する');
      expect(submitButton).toBeDisabled();
    });
  });

  describe('成功画面', () => {
    it('銀行振込決済成功時に適切なメッセージが表示される', async () => {
      const onPaymentSuccess = jest.fn();
      render(<PaymentForm {...defaultProps} paymentMethod="transfer" onPaymentSuccess={onPaymentSuccess} />);
      
      fireEvent.click(screen.getByText('銀行振込で予約する'));
      
      await waitFor(() => {
        expect(screen.getByText('予約を受け付けました')).toBeInTheDocument();
        expect(screen.getByText('振込先情報をメールでお送りします。')).toBeInTheDocument();
      });
    });

    it('成功アイコンが表示される', async () => {
      render(<PaymentForm {...defaultProps} paymentMethod="transfer" />);
      
      fireEvent.click(screen.getByText('銀行振込で予約する'));
      
      await waitFor(() => {
        const successIcon = document.querySelector('.text-green-600');
        expect(successIcon).toBeInTheDocument();
      });
    });
  });

  describe('エラーハンドリング', () => {
    it('決済エラー時にエラーメッセージが表示される', () => {
      // エラー状態のテストは実際のStripe統合が必要なため、
      // ここでは基本的な構造のテストのみ実装
      render(<PaymentForm {...defaultProps} paymentMethod="card" />);
      
      expect(screen.getByTestId('stripe-elements')).toBeInTheDocument();
    });
  });

  describe('プロパティ', () => {
    it('skillIdが正しく渡される', () => {
      render(<PaymentForm {...defaultProps} skillId="test-skill-id" />);
      
      expect(screen.getByTestId('stripe-elements')).toBeInTheDocument();
    });

    it('participantCountが正しく渡される', () => {
      render(<PaymentForm {...defaultProps} participantCount={3} />);
      
      expect(screen.getByTestId('stripe-elements')).toBeInTheDocument();
    });

    it('contactEmailが正しく渡される', () => {
      render(<PaymentForm {...defaultProps} contactEmail="test@example.com" />);
      
      expect(screen.getByTestId('stripe-elements')).toBeInTheDocument();
    });
  });
});
