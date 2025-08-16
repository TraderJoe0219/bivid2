'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUpWithEmail, signInWithGoogle } from '@/lib/auth'
import { useAuthStore } from '@/store/authStore'
import { AuthForm, AuthFormData } from '@/components/auth/AuthForm'
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton'
import { Loading } from '@/components/Loading'

export default function SignupPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { user } = useAuthStore()

  // 既にログイン済みの場合はホームにリダイレクト
  React.useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  if (user) {
    return <Loading />
  }

  const handleEmailSignup = async (data: AuthFormData) => {
    console.log('新規登録フォーム送信:', data)
    setLoading(true)
    setError('')

    try {
      const { user, error: signupError } = await signUpWithEmail(
        data.email,
        data.password,
        data.displayName || ''
      )
      
      setLoading(false)

      if (signupError) {
        console.error('新規登録エラー:', signupError)
        setError(signupError)
      } else if (user) {
        console.log('新規登録成功:', user.uid)
        router.push('/profile/setup') // プロフィール初期設定ページへ
      }
    } catch (error) {
      console.error('予期しないエラー:', error)
      setLoading(false)
      setError('予期しないエラーが発生しました。再度お試しください。')
    }
  }

  const handleGoogleSignup = async () => {
    setError('')
    const { user, error: signupError } = await signInWithGoogle()
    
    if (signupError) {
      setError(signupError)
    } else if (user) {
      router.push('/profile/setup') // プロフィール初期設定ページへ
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-600 mb-2">
            Bivid
          </h1>
          <p className="text-xl text-gray-600">
            スキルシェアでつながる
          </p>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-8 shadow-xl rounded-xl border border-gray-100">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              新規登録
            </h2>
            <p className="text-gray-600 text-center text-base">
              アカウントを作成してBividを始めましょう
            </p>
          </div>

          {/* メール/パスワード新規登録フォーム */}
          <AuthForm
            mode="signup"
            onSubmit={handleEmailSignup}
            loading={loading}
            error={error}
          />

          {/* 区切り線 */}
          <div className="my-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-base">
                <span className="px-4 bg-white text-gray-500 font-medium">または</span>
              </div>
            </div>
          </div>

          {/* Google新規登録ボタン */}
          <GoogleAuthButton
            onSignIn={handleGoogleSignup}
            disabled={loading}
            text="Googleで新規登録"
          />

          {/* ログインリンク */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-base text-gray-600">
              既にアカウントをお持ちの方は
            </p>
            <div className="mt-3 text-center">
              <Link
                href="/login"
                className="inline-block w-full py-3 px-4 border border-orange-300 rounded-lg text-orange-600 hover:bg-orange-50 font-medium text-base transition-colors"
              >
                ログインはこちら
              </Link>
            </div>
          </div>

          {/* 利用規約とプライバシーポリシー */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              登録することで、
              <Link href="/terms" className="text-orange-600 hover:text-orange-500 underline">
                利用規約
              </Link>
              と
              <Link href="/privacy" className="text-orange-600 hover:text-orange-500 underline">
                プライバシーポリシー
              </Link>
              に同意したものとみなされます。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
