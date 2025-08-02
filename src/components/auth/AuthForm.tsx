'use client'

import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

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
}

export function AuthForm({ mode, onSubmit, loading, error }: AuthFormProps) {
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    displayName: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const isSignup = mode === 'signup'

  // バリデーション
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    // メールアドレス
    if (!formData.email) {
      errors.email = 'メールアドレスを入力してください'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'メールアドレスの形式が正しくありません'
    }

    // パスワード
    if (!formData.password) {
      errors.password = 'パスワードを入力してください'
    } else if (formData.password.length < 6) {
      errors.password = 'パスワードは6文字以上で入力してください'
    }

    // 新規登録の場合の追加バリデーション
    if (isSignup) {
      if (!formData.displayName) {
        errors.displayName = 'お名前を入力してください'
      } else if (formData.displayName.length < 2) {
        errors.displayName = 'お名前は2文字以上で入力してください'
      }

      if (!formData.confirmPassword) {
        errors.confirmPassword = 'パスワード（確認）を入力してください'
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'パスワードが一致しません'
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    await onSubmit(formData)
  }

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // エラーをクリア
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* エラーメッセージ */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-red-700 text-base font-medium">{error}</p>
        </div>
      )}

      {/* 新規登録の場合：お名前 */}
      {isSignup && (
        <div>
          <label htmlFor="displayName" className="block text-lg font-medium text-gray-700 mb-2">
            お名前 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="displayName"
              type="text"
              value={formData.displayName || ''}
              onChange={(e) => handleInputChange('displayName', e.target.value)}
              placeholder="田中太郎"
              className={`pl-10 ${validationErrors.displayName ? 'border-red-300' : ''}`}
              disabled={loading}
            />
          </div>
          {validationErrors.displayName && (
            <p className="mt-1 text-red-600 text-base">{validationErrors.displayName}</p>
          )}
        </div>
      )}

      {/* メールアドレス */}
      <div>
        <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
          メールアドレス <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="example@email.com"
            className={`pl-10 ${validationErrors.email ? 'border-red-300' : ''}`}
            disabled={loading}
          />
        </div>
        {validationErrors.email && (
          <p className="mt-1 text-red-600 text-base">{validationErrors.email}</p>
        )}
      </div>

      {/* パスワード */}
      <div>
        <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-2">
          パスワード <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="6文字以上"
            className={`pl-10 pr-10 ${validationErrors.password ? 'border-red-300' : ''}`}
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {validationErrors.password && (
          <p className="mt-1 text-red-600 text-base">{validationErrors.password}</p>
        )}
      </div>

      {/* 新規登録の場合：パスワード確認 */}
      {isSignup && (
        <div>
          <label htmlFor="confirmPassword" className="block text-lg font-medium text-gray-700 mb-2">
            パスワード（確認） <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword || ''}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="パスワードを再入力"
              className={`pl-10 pr-10 ${validationErrors.confirmPassword ? 'border-red-300' : ''}`}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {validationErrors.confirmPassword && (
            <p className="mt-1 text-red-600 text-base">{validationErrors.confirmPassword}</p>
          )}
        </div>
      )}

      {/* 送信ボタン */}
      <Button
        type="submit"
        className="w-full"
        size="lg"
        loading={loading}
        disabled={loading}
      >
        {isSignup ? '新規登録' : 'ログイン'}
      </Button>
    </form>
  )
}
