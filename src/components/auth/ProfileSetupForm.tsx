'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  User, 
  Calendar, 
  MapPin, 
  FileText, 
  Camera,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  profileSetupSchema, 
  type ProfileSetupFormData, 
  prefectures 
} from '@/lib/validations/auth'

interface ProfileSetupFormProps {
  onSubmit: (data: ProfileSetupFormData) => Promise<void>
  loading: boolean
  error?: string
  success?: string
  initialData?: Partial<ProfileSetupFormData>
}

export function ProfileSetupForm({ 
  onSubmit, 
  loading, 
  error, 
  success, 
  initialData 
}: ProfileSetupFormProps) {
  const [profilePreview, setProfilePreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<ProfileSetupFormData>({
    resolver: zodResolver(profileSetupSchema),
    defaultValues: {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      dateOfBirth: initialData?.dateOfBirth || '',
      gender: initialData?.gender || '',
      prefecture: initialData?.prefecture || '',
      city: initialData?.city || '',
      area: initialData?.area || '',
      postalCode: initialData?.postalCode || '',
      bio: initialData?.bio || ''
    }
  })

  const watchedValues = watch()

  // プロフィール写真の処理
  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setValue('profilePhoto', file)
      
      // プレビュー表示
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfilePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // 郵便番号の自動フォーマット
  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 3) {
      value = value.slice(0, 3) + '-' + value.slice(3, 7)
    }
    setValue('postalCode', value)
  }

  // 生年月日から年齢を計算
  const calculateAge = (birthDate: string) => {
    if (!birthDate) return ''
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age > 0 ? `（${age}歳）` : ''
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          プロフィール設定
        </h2>
        <p className="text-lg text-gray-600">
          安全なマッチングのため、基本情報を入力してください。<br />
          入力いただいた情報は適切に管理されます。
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* エラーメッセージ */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-700 text-lg font-medium">{error}</p>
              <p className="text-red-600 text-base mt-1">
                入力内容をご確認の上、再度お試しください。
              </p>
            </div>
          </div>
        )}

        {/* 成功メッセージ */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
            <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
            <p className="text-green-700 text-lg font-medium">{success}</p>
          </div>
        )}

        {/* プロフィール写真 */}
        <div>
          <label className="block text-xl font-medium text-gray-700 mb-4">
            プロフィール写真（任意）
          </label>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                {profilePreview ? (
                  <img
                    src={profilePreview}
                    alt="プロフィール写真"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePhotoChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <div>
              <p className="text-lg text-gray-900 mb-1">写真を追加</p>
              <p className="text-gray-600 text-base">クリックして写真を選択</p>
            </div>
          </div>
        </div>

        {/* 氏名 */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="lastName" className="block text-xl font-medium text-gray-700 mb-3">
              姓 <span className="text-red-500">*</span>
            </label>
            <Input
              id="lastName"
              type="text"
              {...register('lastName')}
              placeholder="田中"
              className={`h-14 text-lg ${errors.lastName ? 'border-red-300' : ''}`}
              disabled={loading}
            />
            {errors.lastName && (
              <p className="mt-2 text-red-600 text-base">{errors.lastName.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="firstName" className="block text-xl font-medium text-gray-700 mb-3">
              名 <span className="text-red-500">*</span>
            </label>
            <Input
              id="firstName"
              type="text"
              {...register('firstName')}
              placeholder="太郎"
              className={`h-14 text-lg ${errors.firstName ? 'border-red-300' : ''}`}
              disabled={loading}
            />
            {errors.firstName && (
              <p className="mt-2 text-red-600 text-base">{errors.firstName.message}</p>
            )}
          </div>
        </div>

        {/* 生年月日・性別 */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="dateOfBirth" className="block text-xl font-medium text-gray-700 mb-3">
              生年月日 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <Input
                id="dateOfBirth"
                type="date"
                {...register('dateOfBirth')}
                className={`pl-14 h-14 text-lg ${errors.dateOfBirth ? 'border-red-300' : ''}`}
                disabled={loading}
              />
            </div>
            {watchedValues.dateOfBirth && (
              <p className="mt-2 text-gray-600 text-base">
                {calculateAge(watchedValues.dateOfBirth)}
              </p>
            )}
            {errors.dateOfBirth && (
              <p className="mt-2 text-red-600 text-base">{errors.dateOfBirth.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="gender" className="block text-xl font-medium text-gray-700 mb-3">
              性別 <span className="text-red-500">*</span>
            </label>
            <select
              id="gender"
              {...register('gender')}
              className={`w-full h-14 px-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.gender ? 'border-red-300' : ''}`}
              disabled={loading}
            >
              <option value="">選択してください</option>
              <option value="male">男性</option>
              <option value="female">女性</option>
              <option value="other">その他</option>
            </select>
            {errors.gender && (
              <p className="mt-2 text-red-600 text-base">{errors.gender.message}</p>
            )}
          </div>
        </div>

        {/* 住所 */}
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-gray-700 flex items-center">
            <MapPin className="w-6 h-6 mr-2" />
            お住まいの地域
          </h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="postalCode" className="block text-lg font-medium text-gray-700 mb-3">
                郵便番号 <span className="text-red-500">*</span>
              </label>
              <Input
                id="postalCode"
                type="text"
                {...register('postalCode')}
                onChange={handlePostalCodeChange}
                placeholder="123-4567"
                maxLength={8}
                className={`h-14 text-lg ${errors.postalCode ? 'border-red-300' : ''}`}
                disabled={loading}
              />
              {errors.postalCode && (
                <p className="mt-2 text-red-600 text-base">{errors.postalCode.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="prefecture" className="block text-lg font-medium text-gray-700 mb-3">
                都道府県 <span className="text-red-500">*</span>
              </label>
              <select
                id="prefecture"
                {...register('prefecture')}
                className={`w-full h-14 px-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.prefecture ? 'border-red-300' : ''}`}
                disabled={loading}
              >
                <option value="">選択してください</option>
                {prefectures.map((pref) => (
                  <option key={pref} value={pref}>{pref}</option>
                ))}
              </select>
              {errors.prefecture && (
                <p className="mt-2 text-red-600 text-base">{errors.prefecture.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="city" className="block text-lg font-medium text-gray-700 mb-3">
                市区町村 <span className="text-red-500">*</span>
              </label>
              <Input
                id="city"
                type="text"
                {...register('city')}
                placeholder="渋谷区"
                className={`h-14 text-lg ${errors.city ? 'border-red-300' : ''}`}
                disabled={loading}
              />
              {errors.city && (
                <p className="mt-2 text-red-600 text-base">{errors.city.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="area" className="block text-lg font-medium text-gray-700 mb-3">
                町名・番地（任意）
              </label>
              <Input
                id="area"
                type="text"
                {...register('area')}
                placeholder="神南1-1-1"
                className={`h-14 text-lg ${errors.area ? 'border-red-300' : ''}`}
                disabled={loading}
              />
              {errors.area && (
                <p className="mt-2 text-red-600 text-base">{errors.area.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* 自己紹介 */}
        <div>
          <label htmlFor="bio" className="block text-xl font-medium text-gray-700 mb-3 flex items-center">
            <FileText className="w-6 h-6 mr-2" />
            自己紹介（任意）
          </label>
          <textarea
            id="bio"
            {...register('bio')}
            rows={4}
            placeholder="ご自身について簡単にご紹介ください。趣味や特技、教えられることや学びたいことなど..."
            className={`w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${errors.bio ? 'border-red-300' : ''}`}
            disabled={loading}
          />
          <div className="flex justify-between items-center mt-2">
            {errors.bio && (
              <p className="text-red-600 text-base">{errors.bio.message}</p>
            )}
            <p className="text-gray-500 text-sm ml-auto">
              {watchedValues.bio?.length || 0}/500文字
            </p>
          </div>
        </div>

        {/* 注意事項 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-3">ご注意</h3>
          <ul className="text-blue-800 text-base space-y-1">
            <li>• 入力いただいた情報は本人確認のために使用されます</li>
            <li>• プロフィール写真は他のユーザーに表示されます</li>
            <li>• 住所の詳細（町名・番地）は公開されません</li>
            <li>• 個人情報は適切に管理・保護されます</li>
          </ul>
        </div>

        {/* 送信ボタン */}
        <Button
          type="submit"
          className="w-full h-14 text-lg"
          loading={loading}
          disabled={loading}
        >
          プロフィールを保存する
        </Button>
      </form>
    </div>
  )
}