'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import Loading from '@/components/Loading'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  // 既にログイン済みの場合はリダイレクト
  if (isAuthenticated) {
    router.push('/')
    return <Loading text="リダイレクト中..." />
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/')
    } catch (error: any) {
      console.error('Login error:', error)
      setError(getErrorMessage(error.code))
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError('')

    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      router.push('/')
    } catch (error: any) {
      console.error('Google login error:', error)
      setError(getErrorMessage(error.code))
    } finally {
      setIsLoading(false)
    }
  }

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'このメールアドレスは登録されていません'
      case 'auth/wrong-password':
        return 'パスワードが正しくありません'
      case 'auth/invalid-email':
        return 'メールアドレスの形式が正しくありません'
      case 'auth/too-many-requests':
        return 'ログイン試行回数が多すぎます。しばらく待ってから再試行してください'
      default:
        return 'ログインに失敗しました。もう一度お試しください'
    }
  }

  return (
    <div className="min-h-screen bg-elder-bg">
      <Header />
      
      <main className="container-elder py-12">
        <div className="max-w-md mx-auto">
          <div className="card-elder">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-elder-text mb-2">
                ログイン
              </h1>
              <p className="text-gray-600">
                Bividアカウントにログインしてください
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-elder">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleEmailLogin} className="spacing-elder">
              <div>
                <label htmlFor="email" className="block text-lg font-medium mb-2">
                  メールアドレス
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-elder pl-12"
                    placeholder="example@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-lg font-medium mb-2">
                  パスワード
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-elder pl-12 pr-12"
                    placeholder="パスワードを入力"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full"
              >
                {isLoading ? 'ログイン中...' : 'ログイン'}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">または</span>
                </div>
              </div>

              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="btn-secondary w-full mt-4"
              >
                Googleでログイン
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                アカウントをお持ちでない方は{' '}
                <Link href="/register" className="text-elder-accent font-medium hover:underline">
                  新規登録
                </Link>
              </p>
              <p className="mt-2">
                <Link href="/forgot-password" className="text-elder-accent hover:underline">
                  パスワードを忘れた方はこちら
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
