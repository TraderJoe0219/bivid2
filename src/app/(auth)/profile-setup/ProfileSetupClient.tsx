'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { ProfileSetupForm } from '@/components/auth/ProfileSetupForm'
import { Loading } from '@/components/Loading'
import { saveUserProfile } from '@/lib/profile'
import type { ProfileSetupFormData } from '@/lib/validations/auth'

export default function ProfileSetupClient() {
  const { user } = useAuthStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!user) {
    router.push('/login')
    return <Loading />
  }

  const handleSubmit = async (data: ProfileSetupFormData) => {
    setLoading(true)
    setError('')

    try {
      await saveUserProfile({
        uid: user.uid,
        displayName: data.displayName,
        bio: data.bio,
        location: data.location,
        skills: data.skills,
        wantedSkills: data.wantedSkills,
        updatedAt: new Date()
      })

      router.push('/document-upload')
    } catch (err) {
      console.error('プロフィール保存エラー:', err)
      setError('プロフィールの保存に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-600 mb-2">Bivid</h1>
          <p className="text-xl text-gray-600">プロフィール設定</p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <ProfileSetupForm
            onSubmit={handleSubmit}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}