'use client';

import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Users, 
  CreditCard, 
  User,
  Phone,
  Mail,
  MessageSquare,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { SocialActivity } from '@/types/activity';

interface BookingModalProps {
  activity: SocialActivity;
  onClose: () => void;
  onConfirm: (bookingData: BookingData) => void;
}

export interface BookingData {
  activityId: string;
  participantCount: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  specialRequests?: string;
  totalAmount: number;
}

export function BookingModal({ activity, onClose, onConfirm }: BookingModalProps) {
  const [step, setStep] = useState<'details' | 'confirmation' | 'success'>('details');
  const [participantCount, setParticipantCount] = useState(1);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalAmount = activity.price * participantCount;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!contactName.trim()) {
      newErrors.contactName = 'お名前を入力してください';
    }

    if (!contactEmail.trim()) {
      newErrors.contactEmail = 'メールアドレスを入力してください';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      newErrors.contactEmail = '正しいメールアドレスを入力してください';
    }

    if (!contactPhone.trim()) {
      newErrors.contactPhone = '電話番号を入力してください';
    } else if (!/^[\d-+().\s]+$/.test(contactPhone)) {
      newErrors.contactPhone = '正しい電話番号を入力してください';
    }

    if (participantCount < 1 || participantCount > activity.capacity) {
      newErrors.participantCount = `参加人数は1〜${activity.capacity}名で入力してください`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      setStep('confirmation');
    }
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    
    try {
      const bookingData: BookingData = {
        activityId: activity.id,
        participantCount,
        contactName,
        contactEmail,
        contactPhone,
        specialRequests: specialRequests.trim() || undefined,
        totalAmount
      };

      await onConfirm(bookingData);
      setStep('success');
    } catch (error) {
      console.error('予約処理に失敗:', error);
      // エラー処理は親コンポーネントで行う
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return price === 0 ? '無料' : `¥${price.toLocaleString()}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {step === 'details' && '予約詳細'}
            {step === 'confirmation' && '予約確認'}
            {step === 'success' && '予約完了'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {step === 'details' && (
            <div className="p-6 space-y-6">
              {/* 活動情報 */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">{activity.title}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{activity.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{activity.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>定員 {activity.capacity}名</span>
                  </div>
                </div>
              </div>

              {/* 参加人数 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  参加人数 <span className="text-red-500">*</span>
                </label>
                <select
                  value={participantCount}
                  onChange={(e) => setParticipantCount(Number(e.target.value))}
                  className={`w-full px-4 py-3 border rounded-lg text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.participantCount ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  {Array.from({ length: Math.min(activity.capacity, 10) }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num}名</option>
                  ))}
                </select>
                {errors.participantCount && (
                  <p className="text-red-500 text-sm mt-1">{errors.participantCount}</p>
                )}
              </div>

              {/* 連絡先情報 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">連絡先情報</h3>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    お名前 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.contactName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="山田太郎"
                    />
                  </div>
                  {errors.contactName && (
                    <p className="text-red-500 text-sm mt-1">{errors.contactName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    メールアドレス <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.contactEmail ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="example@email.com"
                    />
                  </div>
                  {errors.contactEmail && (
                    <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    電話番号 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.contactPhone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="090-1234-5678"
                    />
                  </div>
                  {errors.contactPhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    特別なご要望（任意）
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                      placeholder="アレルギーや配慮が必要な事項があればお書きください"
                    />
                  </div>
                </div>
              </div>

              {/* 料金表示 */}
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">参加費 × {participantCount}名</span>
                  <span className="font-semibold">{formatPrice(activity.price)} × {participantCount}</span>
                </div>
                <div className="border-t border-orange-200 pt-2 flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-800">合計金額</span>
                  <span className="text-2xl font-bold text-orange-600">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {step === 'confirmation' && (
            <div className="p-6 space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">予約内容をご確認ください</p>
                  <p>確認後、主催者に予約リクエストが送信されます。</p>
                </div>
              </div>

              {/* 予約内容確認 */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">活動情報</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">活動名</span>
                      <span className="font-medium">{activity.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">開催日時</span>
                      <span className="font-medium">{activity.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">参加人数</span>
                      <span className="font-medium">{participantCount}名</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">連絡先情報</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">お名前</span>
                      <span className="font-medium">{contactName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">メール</span>
                      <span className="font-medium">{contactEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">電話番号</span>
                      <span className="font-medium">{contactPhone}</span>
                    </div>
                    {specialRequests && (
                      <div>
                        <span className="text-gray-600">特別なご要望</span>
                        <p className="font-medium mt-1">{specialRequests}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-800">合計金額</span>
                    <span className="text-2xl font-bold text-orange-600">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="p-6 text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">予約リクエストを送信しました</h3>
                <p className="text-gray-600">
                  主催者からの返答をお待ちください。<br />
                  確認メールを {contactEmail} に送信いたします。
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg text-left">
                <h4 className="font-semibold text-blue-800 mb-2">今後の流れ</h4>
                <ol className="text-sm text-blue-700 space-y-1">
                  <li>1. 主催者が予約内容を確認します</li>
                  <li>2. 承認後、詳細な案内をお送りします</li>
                  <li>3. 当日は指定の場所にお越しください</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="border-t border-gray-200 p-4">
          {step === 'details' && (
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleNext}
                className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
              >
                確認画面へ
              </button>
            </div>
          )}

          {step === 'confirmation' && (
            <div className="flex space-x-3">
              <button
                onClick={() => setStep('details')}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                disabled={isSubmitting}
              >
                戻る
              </button>
              <button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>送信中...</span>
                  </>
                ) : (
                  <span>予約リクエストを送信</span>
                )}
              </button>
            </div>
          )}

          {step === 'success' && (
            <button
              onClick={onClose}
              className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              閉じる
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
