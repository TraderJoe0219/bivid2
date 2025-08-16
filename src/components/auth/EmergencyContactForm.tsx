'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  UserPlus, 
  Phone, 
  Mail, 
  Users,
  AlertCircle,
  CheckCircle,
  Plus,
  Trash2,
  Shield
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  emergencyContactSchema, 
  type EmergencyContactFormData, 
  relationships 
} from '@/lib/validations/auth'
import type { EmergencyContact } from '@/types/auth'

interface EmergencyContactFormProps {
  onSubmit: (contacts: EmergencyContact[]) => Promise<void>
  loading: boolean
  error?: string
  success?: string
  initialContacts?: EmergencyContact[]
  onSkip?: () => void
}

export function EmergencyContactForm({ 
  onSubmit, 
  loading, 
  error, 
  success, 
  initialContacts = [],
  onSkip 
}: EmergencyContactFormProps) {
  const [contacts, setContacts] = useState<Partial<EmergencyContact>[]>(
    initialContacts.length > 0 
      ? initialContacts 
      : [{ name: '', relationship: '', phoneNumber: '', email: '', priority: 1 }]
  )
  const [editingIndex, setEditingIndex] = useState<number | null>(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<EmergencyContactFormData>({
    resolver: zodResolver(emergencyContactSchema),
    defaultValues: contacts[0] || {}
  })

  const watchedValues = watch()

  // 新しい連絡先を追加
  const addContact = () => {
    if (contacts.length < 5) {
      setContacts([...contacts, { 
        name: '', 
        relationship: '', 
        phoneNumber: '', 
        email: '', 
        priority: contacts.length + 1 
      }])
      setEditingIndex(contacts.length)
    }
  }

  // 連絡先を削除
  const removeContact = (index: number) => {
    const newContacts = contacts.filter((_, i) => i !== index)
    // 優先順位を再調整
    const reorderedContacts = newContacts.map((contact, i) => ({
      ...contact,
      priority: i + 1
    }))
    setContacts(reorderedContacts)
    setEditingIndex(null)
  }

  // 連絡先を編集
  const editContact = (index: number) => {
    setEditingIndex(index)
    const contact = contacts[index]
    reset({
      name: contact.name || '',
      relationship: contact.relationship || '',
      phoneNumber: contact.phoneNumber || '',
      email: contact.email || '',
      priority: contact.priority || index + 1
    })
  }

  // 連絡先を保存
  const saveContact = (data: EmergencyContactFormData) => {
    if (editingIndex !== null) {
      const newContacts = [...contacts]
      newContacts[editingIndex] = {
        ...data,
        id: `contact_${Date.now()}_${editingIndex}`,
        isVerified: false,
        createdAt: new Date() as any
      }
      setContacts(newContacts)
      setEditingIndex(null)
      reset()
    }
  }

  // 電話番号の自動フォーマット
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setValue('phoneNumber', formatted.replace(/-/g, ''))
  }

  // 最終的な送信
  const handleFinalSubmit = async () => {
    const validContacts = contacts.filter(contact => 
      contact.name && contact.relationship && contact.phoneNumber
    ) as EmergencyContact[]
    
    await onSubmit(validContacts)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          緊急連絡先の登録
        </h2>
        <p className="text-lg text-gray-600">
          安全のため、緊急時にご連絡できる方の情報を登録してください。<br />
          ご家族やご友人など、信頼できる方をお選びください。
        </p>
      </div>

      {/* エラーメッセージ */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3 mb-6">
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
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3 mb-6">
          <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
          <p className="text-green-700 text-lg font-medium">{success}</p>
        </div>
      )}

      {/* 登録済み連絡先一覧 */}
      <div className="space-y-4 mb-8">
        {contacts.map((contact, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-6">
            {editingIndex === index ? (
              // 編集フォーム
              <form onSubmit={handleSubmit(saveContact)} className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-medium text-gray-900 flex items-center">
                    <UserPlus className="w-6 h-6 mr-2" />
                    緊急連絡先 {index + 1}
                  </h3>
                  {contacts.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeContact(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      削除
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-3">
                      お名前 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      {...register('name')}
                      placeholder="田中花子"
                      className={`h-12 text-lg ${errors.name ? 'border-red-300' : ''}`}
                      disabled={loading}
                    />
                    {errors.name && (
                      <p className="mt-2 text-red-600 text-base">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-3">
                      続柄 <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('relationship')}
                      className={`w-full h-12 px-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.relationship ? 'border-red-300' : ''}`}
                      disabled={loading}
                    >
                      <option value="">選択してください</option>
                      {relationships.map((rel) => (
                        <option key={rel} value={rel}>{rel}</option>
                      ))}
                    </select>
                    {errors.relationship && (
                      <p className="mt-2 text-red-600 text-base">{errors.relationship.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-3">
                      電話番号 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        {...register('phoneNumber')}
                        onChange={handlePhoneChange}
                        placeholder="09012345678"
                        className={`pl-12 h-12 text-lg ${errors.phoneNumber ? 'border-red-300' : ''}`}
                        disabled={loading}
                      />
                    </div>
                    {errors.phoneNumber && (
                      <p className="mt-2 text-red-600 text-base">{errors.phoneNumber.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-3">
                      メールアドレス（任意）
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        {...register('email')}
                        type="email"
                        placeholder="example@email.com"
                        className={`pl-12 h-12 text-lg ${errors.email ? 'border-red-300' : ''}`}
                        disabled={loading}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-2 text-red-600 text-base">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={loading}
                  >
                    保存
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingIndex(null)}
                    disabled={loading}
                  >
                    キャンセル
                  </Button>
                </div>
              </form>
            ) : (
              // 表示モード
              <div>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <Users className="w-5 h-5 text-gray-400 mr-2" />
                      <h3 className="text-xl font-medium text-gray-900">
                        緊急連絡先 {index + 1}
                      </h3>
                      <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        優先度 {contact.priority}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-lg">
                      <div>
                        <span className="text-gray-600">お名前：</span>
                        <span className="font-medium">{contact.name || '未入力'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">続柄：</span>
                        <span className="font-medium">{contact.relationship || '未入力'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">電話番号：</span>
                        <span className="font-medium">{contact.phoneNumber || '未入力'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">メール：</span>
                        <span className="font-medium">{contact.email || '未入力'}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editContact(index)}
                    disabled={loading}
                  >
                    編集
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 連絡先追加ボタン */}
      {contacts.length < 5 && editingIndex === null && (
        <div className="text-center mb-8">
          <Button
            type="button"
            variant="outline"
            onClick={addContact}
            disabled={loading}
            className="text-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            緊急連絡先を追加する（最大5件）
          </Button>
        </div>
      )}

      {/* 注意事項 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-medium text-yellow-900 mb-3">緊急連絡先について</h3>
        <ul className="text-yellow-800 text-base space-y-1">
          <li>• 緊急時や問題発生時にのみご連絡いたします</li>
          <li>• 事前にご本人様に連絡先登録の同意を得てください</li>
          <li>• 連絡先情報は厳重に管理され、第三者に提供されません</li>
          <li>• 優先度の高い方から順番にご連絡いたします</li>
        </ul>
      </div>

      {/* 完了ボタン */}
      <div className="flex space-x-4">
        <Button
          onClick={handleFinalSubmit}
          className="flex-1 h-14 text-lg"
          loading={loading}
          disabled={loading || editingIndex !== null || contacts.every(c => !c.name)}
        >
          緊急連絡先を登録する
        </Button>
        {onSkip && (
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-14 text-lg"
            onClick={onSkip}
            disabled={loading}
          >
            後で登録する
          </Button>
        )}
      </div>
    </div>
  )
}