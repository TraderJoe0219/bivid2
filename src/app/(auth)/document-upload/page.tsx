'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { DocumentUpload } from '@/components/auth/DocumentUpload'
import { Loading } from '@/components/Loading'
import { saveDocumentInfo } from '@/lib/auth'
import type { DocumentUploadFormData } from '@/lib/validations/auth'

export default function DocumentUploadPage() {
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

  // 身分証明書アップロード処理
  const handleSubmit = async (data: DocumentUploadFormData) => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Firebase Storageに書類をアップロード
      // const documentRef = ref(storage, `documents/${user.uid}/${Date.now()}-${data.documentFile.name}`)
      // const uploadResult = await uploadBytes(documentRef, data.documentFile)
      // const documentURL = await getDownloadURL(uploadResult.ref)

      // Firestoreにアップロード情報を保存
      const documentData = {
        documentType: data.documentType,
        documentURL: 'mock-document-url', // 実際にはFirebase StorageのURL
        isDocumentVerified: false, // 管理者による確認待ち
        documentUploadedAt: new Date(),
        updatedAt: new Date()
      }

      // Firestoreへの身分証明書情報保存
      await saveDocumentInfo(user.uid, data.documentType, documentURL)

      setSuccess('身分証明書を提出しました。確認までお時間をいただきます。')

      // 次のステップ（緊急連絡先）へ
      setTimeout(() => {
        router.push('/emergency-contacts')
      }, 2000)

    } catch (err) {
      console.error('書類アップロードエラー:', err)
      setError('書類のアップロードに失敗しました。ファイル形式とサイズをご確認ください。')
    } finally {
      setLoading(false)
    }
  }

  // スキップ処理
  const handleSkip = () => {
    router.push('/emergency-contacts')
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
            安全なコミュニティのために
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
                4
              </div>
              <span className="ml-2 text-blue-600 font-medium">身分証明書</span>
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
          <DocumentUpload
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
            onClick={() => router.push('/profile-setup')}
            className="text-gray-600 hover:text-gray-800 flex items-center"
            disabled={loading}
          >
            ← 前に戻る
          </button>
          <p className="text-gray-600 text-sm">
            ステップ 4 / 5
          </p>
        </div>

        {/* 後で提出の案内 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">
            身分証明書について
          </h3>
          <p className="text-blue-800 text-base">
            身分証明書の提出は任意ですが、提出いただくことで他のユーザーからの信頼度が向上し、
            より多くのマッチング機会を得ることができます。
            後からプロフィール設定で提出することも可能です。
          </p>
        </div>

        {/* セキュリティ情報 */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-base">
            🔒 提出いただいた書類は暗号化され、厳重に管理されます
          </p>
        </div>
      </div>
    </div>
  )
}