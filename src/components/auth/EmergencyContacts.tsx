'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  Plus, 
  Trash2, 
  Phone, 
  Mail, 
  AlertCircle, 
  CheckCircle,
  Users,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { emergencyContactSchema, relationships } from '@/lib/validations/auth'
import { z } from 'zod'

const emergencyContactsSchema = z.object({
  contacts: z.array(emergencyContactSchema).min(1, '最低1件の緊急連絡先を登録してください')
})

type EmergencyContactsFormData = z.infer<typeof emergencyContactsSchema>

interface EmergencyContactsProps {
  onSubmit: (data: EmergencyContactsFormData) => Promise<void>
  loading: boolean
  error?: string
  success?: string
  initialContacts?: Array<{
    name: string
    relationship: string
    phoneNumber: string
    email?: string
    priority: number
  }>
}

export function EmergencyContacts({ 
  onSubmit, 
  loading, 
  error, 
  success,
  initialContacts = []
}: EmergencyContactsProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch
  } = useForm<EmergencyContactsFormData>({
    resolver: zodResolver(emergencyContactsSchema),
    defaultValues: {
      contacts: initialContacts.length > 0 
        ? initialContacts 
        : [{ name: '', relationship: '', phoneNumber: '', email: '', priority: 1 }]
    }
  })

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'contacts'
  })

  const watchedContacts = watch('contacts')

  // 新しい連絡先を追加
  const addContact = () => {
    const nextPriority = Math.max(...watchedContacts.map(c => c.priority || 0)) + 1
    append({
      name: '',
      relationship: '',
      phoneNumber: '',
      email: '',
      priority: nextPriority
    })
  }

  // 優先順位を上げる
  const movePriorityUp = (index: number) => {
    if (index > 0) {
      move(index, index - 1)
    }
  }

  // 優先順位を下げる
  const movePriorityDown = (index: number) => {
    if (index < fields.length - 1) {
      move(index, index + 1)
    }
  }

  // 電話番号フォーマット
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          緊急連絡先の登録
        </h2>
        <p className="text-lg text-gray-600">
          万が一の際にご連絡させていただく方の情報を登録してください。<br />
          ご家族やご友人など、信頼できる方を登録することをお勧めします。
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

        {/* 緊急連絡先リスト */}
        <div className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  緊急連絡先 {index + 1}
                  {index === 0 && (
                    <span className="ml-2 text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                      最優先
                    </span>
                  )}
                </h3>
                <div className="flex items-center space-x-2">
                  {/* 優先順位変更ボタン */}
                  <div className="flex flex-col space-y-1">
                    <button
                      type="button"
                      onClick={() => movePriorityUp(index)}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="優先順位を上げる"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => movePriorityDown(index)}
                      disabled={index === fields.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="優先順位を下げる"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* 削除ボタン */}
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* お名前 */}
                <div>
                  <Input
                    label="お名前"
                    {...register(`contacts.${index}.name`)}
                    placeholder="山田花子"
                    error={errors.contacts?.[index]?.name?.message}
                    required
                  />
                </div>

                {/* 続柄 */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    続柄 <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register(`contacts.${index}.relationship`)}
                    className="block w-full px-4 py-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">選択してください</option>
                    {relationships.map((relationship) => (
                      <option key={relationship} value={relationship}>
                        {relationship}
                      </option>
                    ))}
                  </select>
                  {errors.contacts?.[index]?.relationship && (
                    <p className="mt-2 text-red-600 text-base">
                      {errors.contacts[index]?.relationship?.message}
                    </p>
                  )}
                </div>

                {/* 電話番号 */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    電話番号 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="tel"
                      {...register(`contacts.${index}.phoneNumber`)}
                      placeholder="09012345678"
                      className="pl-12"
                      error={errors.contacts?.[index]?.phoneNumber?.message}
                    />
                  </div>
                </div>

                {/* メールアドレス（任意） */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    メールアドレス（任意）
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="email"
                      {...register(`contacts.${index}.email`)}
                      placeholder="example@email.com"
                      className="pl-12"
                      error={errors.contacts?.[index]?.email?.message}
                    />
                  </div>
                </div>
              </div>

              {/* 隠しフィールド：優先順位 */}
              <input
                type="hidden"
                {...register(`contacts.${index}.priority`, { valueAsNumber: true })}
                value={index + 1}
              />
            </div>
          ))}
        </div>

        {/* 連絡先追加ボタン */}
        {fields.length < 5 && (
          <div className="text-center">
            <Button
              type="button"
              variant="secondary"
              onClick={addContact}
              className="h-12 text-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              緊急連絡先を追加する
            </Button>
            <p className="mt-2 text-gray-600 text-base">
              最大5件まで登録できます
            </p>
          </div>
        )}

        {/* エラー表示（全体） */}
        {errors.contacts && typeof errors.contacts.message === 'string' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-lg">{errors.contacts.message}</p>
          </div>
        )}

        {/* 送信ボタン */}
        <div className="pt-6">
          <Button
            type="submit"
            loading={loading}
            className="w-full h-14 text-lg"
            size="lg"
          >
            緊急連絡先を登録する
          </Button>
        </div>
      </form>

      {/* 注意事項 */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-3">
          緊急連絡先について
        </h3>
        <ul className="text-blue-800 text-base space-y-2">
          <li>• 緊急時にのみご連絡いたします</li>
          <li>• 上から順番に連絡を取らせていただきます</li>
          <li>• 事前に登録する旨をお伝えいただくことをお勧めします</li>
          <li>• 連絡先情報は適切に管理・保護されます</li>
        </ul>
      </div>
    </div>
  )
}
