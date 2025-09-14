'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Upload, MapPin, Clock, Calendar } from 'lucide-react'
import { TeacherRegistrationService } from '@/lib/teacherRegistration'
import { useAuth } from '@/hooks/useAuth'

type FormData = {
  // Step 1: スキル登録
  title: string
  description: string
  category: string

  // Step 2: プロフィール入力
  name: string
  photo?: File
  experienceYears: string
  coverageArea: string

  // Step 3: 初回枠登録
  sessionDate: string
  sessionTime: string
  sessionLocation: string
}

const CATEGORIES = [
  { value: 'cooking', label: '料理・食事' },
  { value: 'crafts', label: '手工芸・DIY' },
  { value: 'technology', label: 'IT・技術' },
  { value: 'language', label: '語学' },
  { value: 'music', label: '音楽・芸術' },
  { value: 'sports', label: 'スポーツ・運動' },
  { value: 'gardening', label: 'ガーデニング' },
  { value: 'business', label: 'ビジネス・経営' },
  { value: 'health', label: '健康・医療' },
  { value: 'other', label: 'その他' }
]

export default function TeachPage() {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    name: '',
    experienceYears: '',
    coverageArea: '',
    sessionDate: '',
    sessionTime: '',
    sessionLocation: ''
  })

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateFormData = (field: keyof FormData, value: string | File) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = 'タイトルを入力してください'
      if (!formData.description.trim()) newErrors.description = '説明を入力してください'
      if (!formData.category) newErrors.category = 'カテゴリを選択してください'
    } else if (step === 2) {
      if (!formData.name.trim()) newErrors.name = '名前を入力してください'
      if (!formData.experienceYears.trim()) newErrors.experienceYears = '経験年数を入力してください'
      if (!formData.coverageArea.trim()) newErrors.coverageArea = '対応エリアを入力してください'
    } else if (step === 3) {
      if (!formData.sessionDate) newErrors.sessionDate = '日付を選択してください'
      if (!formData.sessionTime) newErrors.sessionTime = '時間を選択してください'
      if (!formData.sessionLocation.trim()) newErrors.sessionLocation = '場所を入力してください'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(3) || !user) return

    setIsSubmitting(true)
    try {
      const result = await TeacherRegistrationService.registerTeacher(user.uid, formData)

      alert('登録が完了しました！審査後にスキルが公開されます。')

      // プロフィールページにリダイレクト
      window.location.href = '/profile'
    } catch (error) {
      console.error('保存エラー:', error)
      alert('エラーが発生しました。もう一度お試しください。')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      updateFormData('photo', file)
    }
  }

  // 認証が必要
  if (!user) {
    return (
      <div className="min-h-screen bg-elder-bg-primary flex items-center justify-center px-4">
        <Card className="p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-semibold text-elder-text-primary mb-4">
            ログインが必要です
          </h2>
          <p className="text-elder-text-muted mb-6">
            講師登録するにはログインしてください
          </p>
          <Button
            onClick={() => window.location.href = '/login'}
            fullWidth
          >
            ログインページへ
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-elder-bg-primary py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* プログレスバー */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-elder-text-primary">
              スキル講師登録
            </h1>
            <span className="text-elder-text-muted">
              {currentStep} / 3
            </span>
          </div>

          <div className="flex items-center gap-2">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold',
                    step < currentStep
                      ? 'bg-elder-success text-white'
                      : step === currentStep
                      ? 'bg-elder-interactive-primary text-white'
                      : 'bg-elder-bg-secondary text-elder-text-muted'
                  )}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={cn(
                      'flex-1 h-1 rounded',
                      step < currentStep
                        ? 'bg-elder-success'
                        : 'bg-elder-bg-secondary'
                    )}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <Card className="p-8">
          {/* Step 1: スキル登録 */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-elder-text-primary mb-2">
                  教えるスキルについて
                </h2>
                <p className="text-elder-text-muted">
                  あなたが教えることができるスキルの詳細を入力してください
                </p>
              </div>

              <Input
                label="スキルタイトル"
                placeholder="例：初心者向けパソコン教室"
                value={formData.title}
                onChange={(e) => updateFormData('title', e.target.value)}
                error={errors.title}
                required
              />

              <div className="space-y-2">
                <label className="block font-medium text-elder-text-primary">
                  カテゴリ <span className="text-elder-error">*</span>
                </label>
                <select
                  className={cn(
                    'w-full px-4 py-3 rounded-elder border bg-elder-bg-primary',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-elder-interactive-primary',
                    errors.category
                      ? 'border-elder-error'
                      : 'border-elder-border-medium'
                  )}
                  value={formData.category}
                  onChange={(e) => updateFormData('category', e.target.value)}
                >
                  <option value="">カテゴリを選択してください</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-sm text-elder-error">{errors.category}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block font-medium text-elder-text-primary">
                  詳細説明 <span className="text-elder-error">*</span>
                </label>
                <textarea
                  className={cn(
                    'w-full px-4 py-3 rounded-elder border bg-elder-bg-primary',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-elder-interactive-primary',
                    'min-h-[120px] resize-vertical',
                    errors.description
                      ? 'border-elder-error'
                      : 'border-elder-border-medium'
                  )}
                  placeholder="どのようなスキルを教えるのか、どんな人におすすめなのか、具体的に説明してください"
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                />
                {errors.description && (
                  <p className="text-sm text-elder-error">{errors.description}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: プロフィール入力 */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-elder-text-primary mb-2">
                  プロフィール情報
                </h2>
                <p className="text-elder-text-muted">
                  生徒さんに見せるプロフィール情報を入力してください
                </p>
              </div>

              <Input
                label="お名前"
                placeholder="山田太郎"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                error={errors.name}
                required
              />

              <div className="space-y-2">
                <label className="block font-medium text-elder-text-primary">
                  プロフィール写真
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-elder-bg-secondary flex items-center justify-center">
                    {formData.photo ? (
                      <img
                        src={URL.createObjectURL(formData.photo)}
                        alt="プロフィール"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <Upload className="w-8 h-8 text-elder-text-muted" />
                    )}
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => document.getElementById('photo-upload')?.click()}
                  >
                    <Upload className="w-4 h-4" />
                    写真をアップロード
                  </Button>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>

              <Input
                label="経験年数"
                placeholder="5年"
                value={formData.experienceYears}
                onChange={(e) => updateFormData('experienceYears', e.target.value)}
                error={errors.experienceYears}
                required
              />

              <Input
                label="対応エリア"
                placeholder="東京都渋谷区周辺"
                value={formData.coverageArea}
                onChange={(e) => updateFormData('coverageArea', e.target.value)}
                error={errors.coverageArea}
                leftIcon={<MapPin className="w-5 h-5" />}
                required
              />
            </div>
          )}

          {/* Step 3: 初回枠登録 */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-elder-text-primary mb-2">
                  初回レッスン枠
                </h2>
                <p className="text-elder-text-muted">
                  最初のレッスンの日時と場所を設定してください
                </p>
              </div>

              <Input
                type="date"
                label="レッスン日"
                value={formData.sessionDate}
                onChange={(e) => updateFormData('sessionDate', e.target.value)}
                error={errors.sessionDate}
                leftIcon={<Calendar className="w-5 h-5" />}
                required
              />

              <Input
                type="time"
                label="開始時間"
                value={formData.sessionTime}
                onChange={(e) => updateFormData('sessionTime', e.target.value)}
                error={errors.sessionTime}
                leftIcon={<Clock className="w-5 h-5" />}
                required
              />

              <Input
                label="レッスン場所"
                placeholder="渋谷駅周辺のカフェ、またはオンライン"
                value={formData.sessionLocation}
                onChange={(e) => updateFormData('sessionLocation', e.target.value)}
                error={errors.sessionLocation}
                leftIcon={<MapPin className="w-5 h-5" />}
                required
              />

              {/* 確認情報 */}
              <div className="mt-8 p-4 bg-elder-bg-accent rounded-elder">
                <h3 className="font-semibold text-elder-text-primary mb-4">
                  入力内容の確認
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">スキル：</span>
                    {formData.title}
                  </div>
                  <div>
                    <span className="font-medium">講師名：</span>
                    {formData.name}
                  </div>
                  <div>
                    <span className="font-medium">初回レッスン：</span>
                    {formData.sessionDate} {formData.sessionTime} @{formData.sessionLocation}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ナビゲーションボタン */}
          <div className="flex justify-between mt-8">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              leftIcon={<ChevronLeft className="w-5 h-5" />}
            >
              前へ
            </Button>

            {currentStep < 3 ? (
              <Button
                onClick={handleNext}
                rightIcon={<ChevronRight className="w-5 h-5" />}
              >
                次へ
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                loading={isSubmitting}
                variant="success"
              >
                登録を完了
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}