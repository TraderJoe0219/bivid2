'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { PhoneVerification } from '@/components/auth/PhoneVerification'
import { Loading } from '@/components/Loading'
import type { PhoneVerificationFormData } from '@/lib/validations/auth'

export default function VerifyPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [step, setStep] = useState<'phone' | 'verification'>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuthStore()

  // URLパラメータから初期値を設定
  useEffect(() => {
    const phoneParam = searchParams.get('phone')
    const stepParam = searchParams.get('step')
    
    if (phoneParam) {
      setPhoneNumber(phoneParam)
    }
    if (stepParam === 'verification') {
      setStep('verification')
    }
  }, [searchParams])

  // 未ログインユーザーはログインページへリダイレクト
  if (!user) {
    router.push('/login')
    return <Loading />
  }

  // 電話番号送信処理
  const handlePhoneSubmit = async (data: PhoneVerificationFormData) => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // TODO: Firebase Phone Authの実装
      // const confirmationResult = await signInWithPhoneNumber(auth, data.phoneNumber, recaptchaVerifier)
      
      // 一時的なモック処理
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setPhoneNumber(data.phoneNumber)
      setStep('verification')
      setSuccess('認証コードを送信しました。SMS（ショートメッセージ）をご確認ください。')
      
      // URLを更新
      router.push(`/verify?phone=${data.phoneNumber}&step=verification`)
      
    } catch (err) {
      setError('認証コードの送信に失敗しました。電話番号をご確認の上、再度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  // 認証コード確認処理
  const handleVerificationSubmit = async (data: PhoneVerificationFormData) => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // TODO: Firebase Phone Authの認証コード確認
      // await confirmationResult.confirm(data.verificationCode)
      
      // 一時的なモック処理
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (data.verificationCode !== '123456') {
        throw new Error('Invalid verification code')
      }

      // 電話番号認証成功後、次のステップへ
      setSuccess('電話番号の認証が完了しました！')
      
      setTimeout(() => {
        router.push('/profile-setup')
      }, 1500)
      
    } catch (err) {
      setError('認証コードが正しくありません。再度ご確認ください。')
    } finally {
      setLoading(false)
    }
  }

  // 認証コード再送信処理
  const handleResend = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // TODO: 認証コード再送信
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccess('認証コードを再送信しました。')
    } catch (err) {
      setError('認証コードの再送信に失敗しました。')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = step === 'phone' ? handlePhoneSubmit : handleVerificationSubmit

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-600 mb-2">
            Bivid
          </h1>
          <p className="text-xl text-gray-600">
            安全なコミュニティを作るために
          </p>
        </div>

        {/* プログレスバー */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <span className="ml-2 text-blue-600 font-medium">アカウント作成</span>
            </div>
            <div className="w-8 h-0.5 bg-blue-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="ml-2 text-blue-600 font-medium">電話番号認証</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <span className="ml-2 text-gray-600">プロフィール設定</span>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="bg-white py-10 px-8 shadow-xl rounded-xl border border-gray-100">
          <PhoneVerification
            onSubmit={handleSubmit}
            onResend={step === 'verification' ? handleResend : undefined}
            loading={loading}
            error={error}
            success={success}
            step={step}
            phoneNumber={phoneNumber}
          />
        </div>

        {/* ヘルプリンク */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-base">
            問題が発生した場合は
            <a href="/support" className="text-orange-600 hover:text-orange-500 underline ml-1">
              サポートまでご連絡ください
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}