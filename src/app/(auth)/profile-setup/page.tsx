'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { ProfileSetupForm } from '@/components/auth/ProfileSetupForm'
import { Loading } from '@/components/Loading'
import { updateUserProfile } from '@/lib/auth'
import type { ProfileSetupFormData } from '@/lib/validations/auth'

export default function ProfileSetupPage() {
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

  // プロフィール設定送信処理
  const handleSubmit = async (data: ProfileSetupFormData) => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // プロフィール写真のアップロード処理
      let profilePhotoURL = ''
      if (data.profilePhoto) {
        // TODO: Firebase Storageへのアップロード
        // const photoRef = ref(storage, `profile-photos/${user.uid}/${Date.now()}`)
        // const uploadResult = await uploadBytes(photoRef, data.profilePhoto)
        // profilePhotoURL = await getDownloadURL(uploadResult.ref)
        
        // 一時的なモック処理
        profilePhotoURL = URL.createObjectURL(data.profilePhoto)
      }

      // Firestoreにプロフィール情報を保存
      const profileData = {
        profile: {
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: new Date(data.dateOfBirth),
          gender: data.gender,
          address: {
            prefecture: data.prefecture,
            city: data.city,
            area: data.area,
            postalCode: data.postalCode
          },
          bio: data.bio
        },
        profilePhotoURL,
        updatedAt: new Date()
      }

      // Firestoreへの保存
      await updateUserProfile(user.uid, profileData)

      setSuccess('プロフィール情報を保存しました！')

      // 次のステップ（身分証明書アップロード）へ
      setTimeout(() => {
        router.push('/document-upload')
      }, 1500)

    } catch (err) {
      console.error('プロフィール設定エラー:', err)
      setError('プロフィール情報の保存に失敗しました。再度お試しください。')
    } finally {
      setLoading(false)
    }
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
            あなたについて教えてください
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
                3
              </div>
              <span className="ml-2 text-blue-600 font-medium">プロフィール設定</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                4
              </div>
              <span className="ml-2 text-gray-600">身分証明書</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                5
              </div>
              <span className="ml-2 text-gray-600">緊急連絡先</span>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="bg-white py-10 px-8 shadow-xl rounded-xl border border-gray-100">
          <ProfileSetupForm
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            success={success}
          />
        </div>

        {/* ナビゲーション */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => router.push('/verify')}
            className="text-gray-600 hover:text-gray-800 flex items-center"
            disabled={loading}
          >
            ← 前に戻る
          </button>
          <p className="text-gray-600 text-sm">
            ステップ 3 / 5
          </p>
        </div>

        {/* セキュリティ情報 */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-base">
            🔒 入力いただいた情報は暗号化され、安全に保護されます
          </p>
        </div>
      </div>
    </div>
  )
}