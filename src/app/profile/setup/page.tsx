'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { updateUserProfile } from '@/lib/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Loading } from '@/components/Loading'
import { SkillCategory } from '@/types'

const skillCategories: SkillCategory[] = [
  '料理・お菓子作り',
  '園芸・ガーデニング',
  '手芸・裁縫',
  '楽器演奏',
  'パソコン・スマホ',
  '語学',
  '書道・絵画',
  '健康・体操',
  'その他'
]

export default function ProfileSetupPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    age: '',
    location: '',
    skills: [] as string[],
    interests: [] as string[]
  })
  
  const router = useRouter()
  const { user, userProfile } = useAuthStore()

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    // 既にプロフィールが設定済みの場合はホームへ
    if (userProfile) {
      router.push('/')
      return
    }

    // Firebase Authから基本情報を取得
    if (user.displayName) {
      setFormData(prev => ({
        ...prev,
        displayName: user.displayName || ''
      }))
    }
  }, [user, userProfile, router])

  if (!user) {
    return <Loading />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const profileData = {
        displayName: formData.displayName,
        bio: formData.bio,
        age: formData.age ? parseInt(formData.age) : undefined,
        location: formData.location,
        skills: formData.skills,
        interests: formData.interests
      }

      const { error: updateError } = await updateUserProfile(user.uid, profileData)
      
      if (updateError) {
        setError(updateError)
      } else {
        router.push('/')
      }
    } catch (err) {
      setError('プロフィールの保存に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            プロフィール設定
          </h1>
          <p className="text-lg text-gray-600">
            あなたのことを教えてください
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-base">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 基本情報 */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">基本情報</h2>
              <div className="space-y-6">
                <Input
                  label="お名前 *"
                  value={formData.displayName}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                  placeholder="山田太郎"
                  required
                />

                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    自己紹介
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                    className="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="あなたの趣味や特技、Bividで何をしたいかなどを教えてください"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="年齢"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    placeholder="65"
                    min="18"
                    max="120"
                  />

                  <Input
                    label="お住まいの地域"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="東京都世田谷区"
                  />
                </div>
              </div>
            </div>

            {/* スキル選択 */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                教えられるスキル
              </h2>
              <p className="text-gray-600 mb-4">
                あなたが他の人に教えることができるスキルを選択してください
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {skillCategories.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleSkillToggle(skill)}
                    className={`p-3 text-sm font-medium rounded-lg border transition-colors ${
                      formData.skills.includes(skill)
                        ? 'bg-orange-100 border-orange-300 text-orange-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* 興味のあるスキル */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                学びたいスキル
              </h2>
              <p className="text-gray-600 mb-4">
                あなたが学んでみたいスキルを選択してください
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {skillCategories.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    className={`p-3 text-sm font-medium rounded-lg border transition-colors ${
                      formData.interests.includes(interest)
                        ? 'bg-blue-100 border-blue-300 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {/* 送信ボタン */}
            <div className="pt-6">
              <Button
                type="submit"
                loading={loading}
                className="w-full"
                size="lg"
              >
                プロフィールを保存してBividを始める
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
