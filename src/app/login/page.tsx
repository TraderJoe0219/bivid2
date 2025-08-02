'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signInWithEmail, signInWithGoogle } from '@/lib/auth'
import { useAuthStore } from '@/store/authStore'
import { AuthForm, AuthFormData } from '@/components/auth/AuthForm'
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton'
import { PasswordResetModal } from '@/components/auth/PasswordResetModal'
import { Loading } from '@/components/Loading'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPasswordReset, setShowPasswordReset] = useState(false)
  const router = useRouter()
  const { user } = useAuthStore()

  // 既にログイン済みの場合はホームにリダイレクト
  if (user) {
    router.push('/')
    return <Loading />
  }

  const handleEmailLogin = async (data: AuthFormData) => {
    setLoading(true)
    setError('')

    const { user, error: loginError } = await signInWithEmail(data.email, data.password)
    
    setLoading(false)

    if (loginError) {
      setError(loginError)
    } else if (user) {
      router.push('/')
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    const { user, error: loginError } = await signInWithGoogle()
    
    if (loginError) {
      setError(loginError)
    } else if (user) {
      router.push('/')
    }
  }

  return (
    <>
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
                ログイン
              </h2>
              <p className="text-gray-600 text-center text-base">
                アカウントにログインしてください
              </p>
            </div>

            {/* メール/パスワードログインフォーム */}
            <AuthForm
              mode="login"
              onSubmit={handleEmailLogin}
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

            {/* Googleログインボタン */}
            <GoogleAuthButton
              onSignIn={handleGoogleLogin}
              disabled={loading}
              text="Googleでログイン"
            />

            {/* パスワードリセットリンク */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowPasswordReset(true)}
                className="text-orange-600 hover:text-orange-500 text-base font-medium underline"
                disabled={loading}
              >
                パスワードをお忘れの方
              </button>
            </div>

            {/* 新規登録リンク */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-base text-gray-600">
                アカウントをお持ちでない方は
              </p>
              <div className="mt-3 text-center">
                <Link
                  href="/signup"
                  className="inline-block w-full py-3 px-4 border border-orange-300 rounded-lg text-orange-600 hover:bg-orange-50 font-medium text-base transition-colors"
                >
                  新規登録はこちら
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* パスワードリセットモーダル */}
      <PasswordResetModal
        isOpen={showPasswordReset}
        onClose={() => setShowPasswordReset(false)}
      />
    </>
  )
}
