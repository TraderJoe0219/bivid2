'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Phone, MessageSquare, Clock, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { phoneVerificationSchema, type PhoneVerificationFormData } from '@/lib/validations/auth'

interface PhoneVerificationProps {
  onSubmit: (data: PhoneVerificationFormData) => Promise<void>
  onResend?: () => Promise<void>
  loading: boolean
  error?: string
  success?: string
  step: 'phone' | 'verification'
  phoneNumber?: string
}

export function PhoneVerification({ 
  onSubmit, 
  onResend, 
  loading, 
  error, 
  success,
  step,
  phoneNumber 
}: PhoneVerificationProps) {
  const [countdown, setCountdown] = useState(0)
  const [resendAvailable, setResendAvailable] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<PhoneVerificationFormData>({
    resolver: zodResolver(phoneVerificationSchema),
    defaultValues: {
      phoneNumber: phoneNumber || '',
      verificationCode: ''
    }
  })

  // カウントダウンタイマー
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setResendAvailable(true)
    }
  }, [countdown])

  // 電話番号送信時のカウントダウン開始
  const handlePhoneSubmit = async (data: PhoneVerificationFormData) => {
    await onSubmit(data)
    if (step === 'phone') {
      setCountdown(60) // 60秒のカウントダウン
      setResendAvailable(false)
    }
  }

  const handleResend = async () => {
    if (onResend && resendAvailable) {
      await onResend()
      setCountdown(60)
      setResendAvailable(false)
    }
  }

  // 電話番号入力時の自動フォーマット
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setValue('phoneNumber', formatted.replace(/-/g, ''))
  }

  if (step === 'phone') {
    return (
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            電話番号認証
          </h2>
          <p className="text-lg text-gray-600">
            安全のため、電話番号の認証を行います。<br />
            SMS（ショートメッセージ）で認証コードを送信いたします。
          </p>
        </div>

        <form onSubmit={handleSubmit(handlePhoneSubmit)} className="space-y-6">
          {/* エラーメッセージ */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-700 text-lg font-medium">{error}</p>
                <p className="text-red-600 text-base mt-1">
                  正しい電話番号を入力しているかご確認ください。
                </p>
              </div>
            </div>
          )}

          {/* 成功メッセージ */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-green-700 text-lg font-medium">{success}</p>
            </div>
          )}

          {/* 電話番号入力 */}
          <div>
            <label htmlFor="phoneNumber" className="block text-xl font-medium text-gray-700 mb-3">
              携帯電話番号 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <Input
                id="phoneNumber"
                type="tel"
                {...register('phoneNumber')}
                onChange={handlePhoneChange}
                placeholder="09012345678"
                className={`pl-14 h-14 text-lg ${errors.phoneNumber ? 'border-red-300' : ''}`}
                disabled={loading}
              />
            </div>
            {errors.phoneNumber && (
              <p className="mt-2 text-red-600 text-lg">{errors.phoneNumber.message}</p>
            )}
            <p className="mt-2 text-gray-600 text-base">
              ※ 携帯電話番号をハイフンなしで入力してください
            </p>
          </div>

          {/* 送信ボタン */}
          <Button
            type="submit"
            className="w-full h-14 text-lg"
            loading={loading}
            disabled={loading}
          >
            認証コードを送信する
          </Button>
        </form>

        {/* 注意事項 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-900 mb-2">ご注意</h3>
          <ul className="text-blue-800 text-base space-y-1">
            <li>• SMS（ショートメッセージ）が受信できる携帯電話番号を入力してください</li>
            <li>• 認証コードの送信には数分かかる場合があります</li>
            <li>• 迷惑メールフィルターをご確認ください</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          認証コード入力
        </h2>
        <p className="text-lg text-gray-600">
          {phoneNumber} に送信された<br />
          6桁の認証コードを入力してください
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* エラーメッセージ */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-700 text-lg font-medium">{error}</p>
              <p className="text-red-600 text-base mt-1">
                認証コードが正しくない可能性があります。再度ご確認ください。
              </p>
            </div>
          </div>
        )}

        {/* 認証コード入力 */}
        <div>
          <label htmlFor="verificationCode" className="block text-xl font-medium text-gray-700 mb-3">
            認証コード（6桁） <span className="text-red-500">*</span>
          </label>
          <Input
            id="verificationCode"
            type="text"
            {...register('verificationCode')}
            placeholder="123456"
            maxLength={6}
            className={`h-14 text-2xl text-center tracking-widest ${errors.verificationCode ? 'border-red-300' : ''}`}
            disabled={loading}
          />
          {errors.verificationCode && (
            <p className="mt-2 text-red-600 text-lg">{errors.verificationCode.message}</p>
          )}
        </div>

        {/* 確認ボタン */}
        <Button
          type="submit"
          className="w-full h-14 text-lg"
          loading={loading}
          disabled={loading}
        >
          認証コードを確認する
        </Button>

        {/* 再送信 */}
        <div className="text-center">
          {countdown > 0 ? (
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <Clock className="w-5 h-5" />
              <span className="text-lg">
                再送信まであと {countdown} 秒
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={!resendAvailable || loading}
              className="text-blue-600 hover:text-blue-800 text-lg font-medium disabled:text-gray-400"
            >
              認証コードを再送信する
            </button>
          )}
        </div>
      </form>

      {/* ヘルプ */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-yellow-900 mb-2">
          認証コードが届かない場合
        </h3>
        <ul className="text-yellow-800 text-base space-y-1">
          <li>• 電話番号に間違いがないかご確認ください</li>
          <li>• 迷惑メールフィルターの設定をご確認ください</li>
          <li>• 数分待ってから再送信をお試しください</li>
          <li>• 問題が解決しない場合はサポートまでご連絡ください</li>
        </ul>
      </div>
    </div>
  )
}