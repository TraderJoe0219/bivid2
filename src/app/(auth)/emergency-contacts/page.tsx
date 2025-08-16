'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { EmergencyContactForm } from '@/components/auth/EmergencyContactForm'
import { Loading } from '@/components/Loading'
import type { EmergencyContact } from '@/types/auth'

export default function EmergencyContactsPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const router = useRouter()
  const { user } = useAuthStore()

  // 未ログインユーザーはログインページへリダイレクト
  if (!user) {
    router.push('/login')
    return <Loading />
  }

  // 緊急連絡先保存処理
  const handleSubmit = async (contacts: EmergencyContact[]) => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Firestoreに緊急連絡先を保存
      const emergencyContactsData = {
        emergencyContacts: contacts.map(contact => ({
          ...contact,
          createdAt: new Date(),
          isVerified: false // 後で連絡先確認を行う
        })),
        registrationCompleted: true,
        registrationCompletedAt: new Date(),
        updatedAt: new Date()
      }

      // TODO: Firestoreへの保存
      // await updateDoc(doc(db, 'users', user.uid), emergencyContactsData)
      
      // 一時的なモック処理
      await new Promise(resolve => setTimeout(resolve, 2000))

      setSuccess('緊急連絡先を登録しました！ユーザー登録が完了しました。')

      // 登録完了後、メインアプリケーションへ
      setTimeout(() => {
        router.push('/')
      }, 2000)

    } catch (err) {
      console.error('緊急連絡先登録エラー:', err)
      setError('緊急連絡先の登録に失敗しました。再度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  // スキップ処理
  const handleSkip = () => {
    // 緊急連絡先をスキップした場合も登録完了とする
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-600 mb-2">
            Bivid
          </h1>
          <p className="text-xl text-gray-600">
            もうすぐ完了です！
          </p>
        </div>

        {/* プログレスバー */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                ✓
              </div>
              <span className="ml-2 text-blue-600 font-medium">アカウント作成</span>
            </div>
            <div className="w-8 h-0.5 bg-blue-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                ✓
              </div>
              <span className="ml-2 text-blue-600 font-medium">電話番号認証</span>
            </div>
            <div className="w-8 h-0.5 bg-blue-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                ✓
              </div>
              <span className="ml-2 text-blue-600 font-medium">プロフィール設定</span>
            </div>
            <div className="w-8 h-0.5 bg-blue-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                ✓
              </div>
              <span className="ml-2 text-blue-600 font-medium">身分証明書</span>
            </div>
            <div className="w-8 h-0.5 bg-blue-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                5
              </div>
              <span className="ml-2 text-orange-600 font-medium">緊急連絡先</span>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="bg-white py-10 px-8 shadow-xl rounded-xl border border-gray-100">
          <EmergencyContactForm
            onSubmit={handleSubmit}
            onSkip={handleSkip}
            loading={loading}
            error={error}
            success={success}
          />
        </div>

        {/* ナビゲーション */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => router.push('/document-upload')}
            className="text-gray-600 hover:text-gray-800 flex items-center"
            disabled={loading}
          >
            ← 前に戻る
          </button>
          <p className="text-gray-600 text-sm">
            ステップ 5 / 5（最後のステップ！）
          </p>
        </div>

        {/* 完了までのメッセージ */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-green-900 mb-2">
            🎉 ユーザー登録まであと少し！
          </h3>
          <p className="text-green-800 text-base">
            緊急連絡先の登録を完了すると、Bividのすべての機能をご利用いただけます。
            安全で楽しいスキルシェア体験をお楽しみください！
          </p>
        </div>

        {/* セキュリティ情報 */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-base">
            🔒 緊急連絡先情報は厳重に管理され、緊急時のみに使用されます
          </p>
        </div>
      </div>
    </div>
  )
}