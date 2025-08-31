'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { EmergencyContactForm } from '@/components/auth/EmergencyContactForm'
import { Loading } from '@/components/Loading'
import { saveEmergencyContacts } from '@/lib/auth'
import type { EmergencyContactFormData } from '@/lib/validations/auth'

export default function EmergencyContactsClient() {
  const { user } = useAuthStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  if (!user) {
    router.push('/login')
    return <Loading />
  }

  const handleSubmit = async (data: EmergencyContactFormData) => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await saveEmergencyContacts(user.uid, data)
      setSuccess('緊急連絡先を登録しました')
      
      setTimeout(() => {
        router.push('/profile')
      }, 2000)
    } catch (err) {
      console.error('緊急連絡先保存エラー:', err)
      setError('緊急連絡先の保存に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    router.push('/profile')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-600 mb-2">Bivid</h1>
          <p className="text-xl text-gray-600">緊急連絡先の登録</p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <EmergencyContactForm
            onSubmit={handleSubmit}
            onSkip={handleSkip}
            loading={loading}
            error={error}
            success={success}
          />
        </div>
      </div>
    </div>
  )
}