'use client'

import { useState } from 'react'
import { X, Mail, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { resetPassword } from '@/lib/auth'

interface PasswordResetModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PasswordResetModal({ isOpen, onClose }: PasswordResetModalProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError('メールアドレスを入力してください')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('メールアドレスの形式が正しくありません')
      return
    }

    setLoading(true)
    setError('')

    const { error: resetError } = await resetPassword(email)
    
    setLoading(false)

    if (resetError) {
      setError(resetError)
    } else {
      setSuccess(true)
    }
  }

  const handleClose = () => {
    setEmail('')
    setError('')
    setSuccess(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            パスワードリセット
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {success ? (
          /* 成功画面 */
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              メールを送信しました
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {email} にパスワードリセット用のメールを送信しました。
              メール内のリンクをクリックして、新しいパスワードを設定してください。
            </p>
            <p className="text-sm text-gray-500 mb-6">
              メールが届かない場合は、迷惑メールフォルダもご確認ください。
            </p>
            <Button
              onClick={handleClose}
              className="w-full"
              size="lg"
            >
              閉じる
            </Button>
          </div>
        ) : (
          /* 入力フォーム */
          <form onSubmit={handleSubmit}>
            <p className="text-gray-600 mb-6 leading-relaxed">
              登録されているメールアドレスを入力してください。
              パスワードリセット用のメールをお送りします。
            </p>

            {/* エラーメッセージ */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3 mb-4">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-base">{error}</p>
              </div>
            )}

            {/* メールアドレス入力 */}
            <div className="mb-6">
              <label htmlFor="reset-email" className="block text-lg font-medium text-gray-700 mb-2">
                メールアドレス
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError('')
                  }}
                  placeholder="example@email.com"
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            {/* ボタン */}
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                size="lg"
                disabled={loading}
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                className="flex-1"
                size="lg"
                loading={loading}
                disabled={loading || !email}
              >
                送信
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
