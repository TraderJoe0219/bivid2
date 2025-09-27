'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save, MapPin, Tag, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { profileUpdateSchema, ProfileUpdateData } from '@/lib/validations/profile'
import { ExtendedUserProfile, INTEREST_TAGS, PREFECTURES } from '@/types/profile'
import { cn } from '@/lib/utils'

interface ExtendedProfileFormProps {
  profile?: ExtendedUserProfile | null
  onSave: (data: ProfileUpdateData) => Promise<void>
  isLoading?: boolean
}

export function ExtendedProfileForm({ profile, onSave, isLoading = false }: ExtendedProfileFormProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(profile?.interests || [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<ProfileUpdateData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      displayName: profile?.displayName || '',
      bio: profile?.bio || '',
      prefecture: profile?.home?.prefecture,
      city: profile?.home?.city || '',
      address: profile?.home?.address || '',
      interests: profile?.interests || []
    }
  })

  // プロフィールが更新されたらフォームをリセット
  useEffect(() => {
    if (profile) {
      reset({
        displayName: profile.displayName || '',
        bio: profile.bio || '',
        prefecture: profile.home?.prefecture,
        city: profile.home?.city || '',
        address: profile.home?.address || '',
        interests: profile.interests || []
      })
      setSelectedInterests(profile.interests || [])
    }
  }, [profile, reset])

  // 興味タグの切り替え
  const toggleInterest = useCallback((interest: string) => {
    setSelectedInterests(prev => {
      const newInterests = prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]

      setValue('interests', newInterests)
      return newInterests
    })
  }, [setValue])

  // フォーム送信
  const onSubmit = async (data: ProfileUpdateData) => {
    try {
      setIsSubmitting(true)
      await onSave({ ...data, interests: selectedInterests })
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('プロフィール保存エラー:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const watchedPrefecture = watch('prefecture')

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* 成功メッセージ */}
      {showSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="font-medium text-green-800">プロフィールを保存しました</span>
          </div>
        </div>
      )}

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* ヘッダー */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">マイプロフィール</h1>
              <p className="text-gray-600 mt-1">
                基本情報や興味のあることを設定して、あなたに合った活動をおすすめします。
              </p>
            </div>
            <Button
              type="submit"
              loading={isSubmitting || isLoading}
              leftIcon={<Save className="w-5 h-5" />}
              size="lg"
            >
              保存
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 基本情報 */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                基本情報
              </h2>

              {/* ニックネーム */}
              <Input
                label="ニックネーム"
                required
                {...register('displayName')}
                error={errors.displayName?.message}
                placeholder="呼び方を教えてください"
                size="lg"
              />

              {/* 自己紹介 */}
              <div className="space-y-2">
                <label className="block font-medium text-gray-900 text-base">
                  自己紹介
                </label>
                <textarea
                  {...register('bio')}
                  rows={4}
                  maxLength={500}
                  className={cn(
                    'w-full px-4 py-3 text-base min-h-touch rounded-elder border',
                    'bg-elder-bg-primary placeholder-elder-text-muted',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-elder-interactive-primary focus-visible:ring-offset-1',
                    'transition-all duration-200',
                    errors.bio
                      ? 'border-elder-error focus-visible:border-elder-error focus-visible:ring-elder-error'
                      : 'border-elder-border-medium focus-visible:border-elder-interactive-primary'
                  )}
                  placeholder="簡単な自己紹介をお願いします..."
                />
                {errors.bio && (
                  <p className="text-sm text-elder-error">{errors.bio.message}</p>
                )}
                <div className="text-right text-sm text-gray-500">
                  {watch('bio')?.length || 0}/500文字
                </div>
              </div>

              {/* 居住地域 */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">居住地域</h3>

                {/* 都道府県 */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    都道府県
                  </label>
                  <select
                    {...register('prefecture')}
                    className={cn(
                      'w-full px-4 py-3 text-base min-h-touch rounded-elder border',
                      'bg-elder-bg-primary',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-elder-interactive-primary focus-visible:ring-offset-1',
                      'transition-all duration-200',
                      errors.prefecture
                        ? 'border-elder-error'
                        : 'border-elder-border-medium focus-visible:border-elder-interactive-primary'
                    )}
                  >
                    <option value="">都道府県を選択</option>
                    {PREFECTURES.map((prefecture) => (
                      <option key={prefecture} value={prefecture}>
                        {prefecture}
                      </option>
                    ))}
                  </select>
                  {errors.prefecture && (
                    <p className="text-sm text-elder-error">{errors.prefecture.message}</p>
                  )}
                </div>

                {/* 市区町村 */}
                <Input
                  label="市区町村"
                  {...register('city')}
                  error={errors.city?.message}
                  placeholder="例：豊中市"
                />

                {/* 住所詳細 */}
                <Input
                  label="住所詳細（任意）"
                  {...register('address')}
                  error={errors.address?.message}
                  placeholder="例：中桜塚"
                  helperText="おすすめの活動を探すために使用します"
                />
              </div>
            </div>

            {/* 興味・関心 */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Tag className="w-5 h-5 mr-2 text-green-500" />
                興味・関心
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-gray-700 mb-4">
                    興味のあることや参加したい活動を選択してください。（最大10個）
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {INTEREST_TAGS.map((interest) => {
                      const isSelected = selectedInterests.includes(interest)
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          disabled={!isSelected && selectedInterests.length >= 10}
                          className={cn(
                            'px-4 py-3 text-sm font-medium rounded-elder border-2 transition-all duration-200',
                            'min-h-touch text-left',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-elder-interactive-primary focus-visible:ring-offset-1',
                            'disabled:opacity-50 disabled:cursor-not-allowed',
                            isSelected
                              ? 'bg-elder-interactive-primary border-elder-interactive-primary text-white'
                              : 'bg-elder-bg-primary border-elder-border-medium text-elder-text-primary hover:border-elder-interactive-primary hover:bg-elder-bg-accent'
                          )}
                        >
                          {interest}
                        </button>
                      )
                    })}
                  </div>
                  <div className="mt-3 text-sm text-gray-500">
                    選択中: {selectedInterests.length}/10個
                  </div>
                </div>
              </div>

              {/* 選択した興味タグの表示 */}
              {selectedInterests.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">選択した興味・関心</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedInterests.map((interest) => (
                      <span
                        key={interest}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </Card>
    </div>
  )
}