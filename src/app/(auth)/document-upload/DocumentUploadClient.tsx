'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { DocumentUpload } from '@/components/auth/DocumentUpload'
import { Loading } from '@/components/Loading'
import { saveDocumentInfo } from '@/lib/auth'
import type { DocumentUploadFormData } from '@/lib/validations/auth'

export default function DocumentUploadClient() {
  const { user, isLoading } = useAuthStore()
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string>('')

  const handleSubmit = async (data: DocumentUploadFormData) => {
    if (!user) {
      setError('ログインが必要です')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      await saveDocumentInfo(user.uid, data)
      router.push('/emergency-contacts')
    } catch (err) {
      console.error('書類情報保存エラー:', err)
      setError('書類情報の保存に失敗しました')
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoading) {
    return <Loading />
  }

  if (!user) {
    router.push('/login')
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              本人確認書類のアップロード
            </h1>
            <p className="text-gray-600">
              安全なサービス利用のため、本人確認書類をアップロードしてください。
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <DocumentUpload
            onSubmit={handleSubmit}
            isSubmitting={submitting}
          />
        </div>
      </div>
    </div>
  )
}