'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { updateUserProfile } from '@/lib/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Loading } from '@/components/Loading'
import { SkillCategory } from '@/types'
import { prefectures } from '@/lib/validations/auth'
import { Calendar, MapPin, User, Camera, AlertCircle } from 'lucide-react'

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

interface ProfileFormData {
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other'
  prefecture: string
  city: string
  area: string
  postalCode: string
  bio: string
  skills: string[]
  interests: string[]
}

export default function ProfileSetupPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null)
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'male',
    prefecture: '',
    city: '',
    area: '',
    postalCode: '',
    bio: '',
    skills: [],
    interests: []
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
  }, [user, userProfile, router])

  if (!user) {
    return <Loading />
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const profileData = {
        ...formData,
        displayName: `${formData.lastName} ${formData.firstName}`,
        fullName: `${formData.lastName} ${formData.firstName}`,
        age: formData.dateOfBirth ? new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear() : undefined,
        location: `${formData.prefecture} ${formData.city}`,
        address: {
          prefecture: formData.prefecture,
          city: formData.city,
          area: formData.area,
          postalCode: formData.postalCode
        }
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

  const nextStep = () => {
    if (step < 3) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
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
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              {[1, 2, 3].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {stepNumber}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit}>
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  基本情報
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      姓
                    </label>
                    <Input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="田中"
                      required
                      className="text-lg p-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      名
                    </label>
                    <Input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="太郎"
                      required
                      className="text-lg p-3"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    生年月日
                  </label>
                  <Input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    required
                    className="text-lg p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    性別
                  </label>
                  <div className="flex space-x-4">
                    {[
                      { value: 'male', label: '男性' },
                      { value: 'female', label: '女性' },
                      { value: 'other', label: 'その他' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value={option.value}
                          checked={formData.gender === option.value}
                          onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as 'male' | 'female' | 'other' }))}
                          className="mr-2"
                        />
                        <span className="text-lg">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 text-lg"
                  >
                    次へ
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  <MapPin className="inline h-5 w-5 mr-2" />
                  住所情報
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      都道府県
                    </label>
                    <select
                      value={formData.prefecture}
                      onChange={(e) => setFormData(prev => ({ ...prev, prefecture: e.target.value }))}
                      required
                      className="w-full p-3 text-lg border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">選択してください</option>
                      {prefectures.map((pref) => (
                        <option key={pref} value={pref}>
                          {pref}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      市区町村
                    </label>
                    <Input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="豊中市"
                      required
                      className="text-lg p-3"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      町域・番地
                    </label>
                    <Input
                      type="text"
                      value={formData.area}
                      onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                      placeholder="本町1-2-3"
                      className="text-lg p-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      郵便番号
                    </label>
                    <Input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                      placeholder="560-0021"
                      pattern="[0-9]{3}-[0-9]{4}"
                      className="text-lg p-3"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    自己紹介
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="あなたの趣味や特技、どんなことに興味があるかを教えてください..."
                    rows={4}
                    className="w-full p-3 text-lg border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    onClick={prevStep}
                    variant="secondary"
                    className="px-8 py-3 text-lg"
                  >
                    戻る
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 text-lg"
                  >
                    次へ
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  スキル・興味
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    あなたのスキル（複数選択可）
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {skillCategories.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleSkillToggle(skill)}
                        className={`p-3 text-sm rounded-lg border-2 transition-colors ${
                          formData.skills.includes(skill)
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    興味のある分野（複数選択可）
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {skillCategories.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => handleInterestToggle(interest)}
                        className={`p-3 text-sm rounded-lg border-2 transition-colors ${
                          formData.interests.includes(interest)
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    onClick={prevStep}
                    variant="secondary"
                    className="px-8 py-3 text-lg"
                  >
                    戻る
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 text-lg"
                  >
                    {loading ? '保存中...' : 'プロフィールを保存'}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
