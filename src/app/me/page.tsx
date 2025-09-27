'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { ExtendedProfileForm } from '@/components/profile/ExtendedProfileForm'
import { Loading } from '@/components/Loading'
import { ExtendedUserProfile } from '@/types/profile'
import { ProfileUpdateData } from '@/lib/validations/profile'

export default function MyProfilePage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [profile, setProfile] = useState<ExtendedUserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 認証チェック
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  // プロフィール取得
  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('プロフィールの取得に失敗しました')
      }

      const result = await response.json()
      if (result.success) {
        setProfile(result.data)
      } else {
        throw new Error(result.error || 'プロフィールの取得に失敗しました')
      }
    } catch (error) {
      console.error('プロフィール取得エラー:', error)
      setError(error instanceof Error ? error.message : 'エラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  // プロフィール保存
  const handleSave = async (data: ProfileUpdateData) => {
    try {
      setIsSaving(true)
      setError(null)

      const response = await fetch('/api/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('プロフィールの保存に失敗しました')
      }

      const result = await response.json()
      if (result.success) {
        setProfile(result.data)
        // トーストなどで成功通知は ExtendedProfileForm 内で行う
      } else {
        throw new Error(result.error || 'プロフィールの保存に失敗しました')
      }
    } catch (error) {
      console.error('プロフィール保存エラー:', error)
      setError(error instanceof Error ? error.message : 'エラーが発生しました')
      throw error // ExtendedProfileForm でエラーハンドリングするため再スロー
    } finally {
      setIsSaving(false)
    }
  }

  // 認証中の場合
  if (authLoading) {
    return <Loading />
  }

  // ユーザーが認証されていない場合
  if (!user) {
    return null
  }

  // プロフィール読み込み中
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  // エラー表示
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-red-800 mb-2">エラーが発生しました</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={fetchProfile}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              再試行
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ExtendedProfileForm
          profile={profile}
          onSave={handleSave}
          isLoading={isSaving}
        />
      </div>
    </div>
  )
}