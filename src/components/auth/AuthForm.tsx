'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { signUpSchema, signInSchema } from '@/lib/validations/auth'

interface AuthFormProps {
  mode: 'login' | 'signup'
  onSubmit: (data: AuthFormData) => Promise<void>
  loading: boolean
  error?: string
}

export interface AuthFormData {
  email: string
  password: string
  displayName?: string
  confirmPassword?: string
  agreeToTerms?: boolean
}

export function AuthForm({ mode, onSubmit, loading, error }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const isSignup = mode === 'signup'
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<AuthFormData>({
    resolver: zodResolver(isSignup ? signUpSchema : signInSchema),
    defaultValues: {
      email: '',
      password: '',
      displayName: '',
      confirmPassword: '',
      agreeToTerms: false
    }
  })

  const watchedPassword = watch('password')

  // パスワード強度インジケーター
  const getPasswordStrength = (password: string) => {
    if (!password) return null
    
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++
    
    const strength = score < 2 ? 'weak' : score < 3 ? 'fair' : score < 4 ? 'good' : 'strong'
    const color = strength === 'weak' ? 'red' : strength === 'fair' ? 'yellow' : strength === 'good' ? 'blue' : 'green'
    
    return { strength, score, color }
  }

  const passwordStrength = isSignup ? getPasswordStrength(watchedPassword) : null

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* エラーメッセージ */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-red-700 text-lg font-medium">{error}</p>
        </div>
      )}

      {/* 新規登録の場合：お名前 */}
      {isSignup && (
        <div>
          <label htmlFor="displayName" className="block text-xl font-medium text-gray-700 mb-3">
            お名前 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <Input
              id="displayName"
              type="text"
              {...register('displayName')}
              placeholder="田中太郎"
              className={`pl-14 h-14 text-lg ${errors.displayName ? 'border-red-300' : ''}`}
              disabled={loading}
            />
          </div>
          {errors.displayName && (
            <p className="mt-2 text-red-600 text-lg">{errors.displayName.message}</p>
          )}
        </div>
      )}

      {/* メールアドレス */}
      <div>
        <label htmlFor="email" className="block text-xl font-medium text-gray-700 mb-3">
          メールアドレス <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="example@email.com"
            className={`pl-14 h-14 text-lg ${errors.email ? 'border-red-300' : ''}`}
            disabled={loading}
          />
        </div>
        {errors.email && (
          <p className="mt-2 text-red-600 text-lg">{errors.email.message}</p>
        )}
      </div>

      {/* パスワード */}
      <div>
        <label htmlFor="password" className="block text-xl font-medium text-gray-700 mb-3">
          パスワード <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            placeholder={isSignup ? "6文字以上で入力してください" : "パスワードを入力"}
            className={`pl-14 pr-14 h-14 text-lg ${errors.password ? 'border-red-300' : ''}`}
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
          </button>
        </div>
        {/* パスワード強度インジケーター */}
        {isSignup && passwordStrength && (
          <div className="mt-2">
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 bg-${passwordStrength.color}-500`}
                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                ></div>
              </div>
              <span className={`text-sm font-medium text-${passwordStrength.color}-600`}>
                {passwordStrength.strength === 'weak' && '弱い'}
                {passwordStrength.strength === 'fair' && '普通'}
                {passwordStrength.strength === 'good' && '良い'}
                {passwordStrength.strength === 'strong' && '強い'}
              </span>
            </div>
          </div>
        )}
        {errors.password && (
          <p className="mt-2 text-red-600 text-lg">{errors.password.message}</p>
        )}
      </div>

      {/* 新規登録の場合：パスワード確認 */}
      {isSignup && (
        <div>
          <label htmlFor="confirmPassword" className="block text-xl font-medium text-gray-700 mb-3">
            パスワード（確認） <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword')}
              placeholder="パスワードを再入力"
              className={`pl-14 pr-14 h-14 text-lg ${errors.confirmPassword ? 'border-red-300' : ''}`}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              {showConfirmPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-2 text-red-600 text-lg">{errors.confirmPassword.message}</p>
          )}
        </div>
      )}

      {/* 利用規約同意（新規登録の場合） */}
      {isSignup && (
        <div className="flex items-start space-x-3">
          <input
            id="agreeToTerms"
            type="checkbox"
            {...register('agreeToTerms')}
            className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            disabled={loading}
          />
          <label htmlFor="agreeToTerms" className="text-lg text-gray-700">
            <a href="/terms" className="text-blue-600 hover:text-blue-500 underline" target="_blank">
              利用規約
            </a>
            と
            <a href="/privacy" className="text-blue-600 hover:text-blue-500 underline" target="_blank">
              プライバシーポリシー
            </a>
            に同意します <span className="text-red-500">*</span>
          </label>
        </div>
      )}
      {isSignup && errors.agreeToTerms && (
        <p className="text-red-600 text-lg">{errors.agreeToTerms.message}</p>
      )}

      {/* 送信ボタン */}
      <Button
        type="submit"
        className="w-full h-14 text-lg"
        loading={loading}
        disabled={loading}
      >
        {isSignup ? 'アカウントを作成する' : 'ログインする'}
      </Button>
    </form>
  )
}
