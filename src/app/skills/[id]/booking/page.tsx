'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  User,
  Phone,
  Mail
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Skill } from '@/types/skill'
import { PaymentForm } from '@/components/booking/PaymentForm'
import { PaymentMethod } from '@/types/booking'
import { Loading } from '@/components/Loading'

// モックデータ - 実際の実装ではAPIから取得（スキル詳細ページと同じデータを使用）
const getMockSkill = (id: string): Skill | null => {
  const sampleSkills: Record<string, Skill> = {
    '1': {
      id: '1',
      title: '初心者向けお料理教室',
      shortDescription: '包丁の持ち方から始める、お料理の基礎を楽しく学べます',
      description: 'お料理が初めての方でも安心して参加いただける、基礎的なお料理教室です。',
      category: 'cooking',
      difficulty: 'beginner',
      pricing: {
        amount: 3500,
        currency: 'JPY',
        unit: '回'
      },
      duration: {
        typical: 120,
        minimum: 90,
        maximum: 150
      },
      capacity: {
        maxStudents: 6,
        currentBookings: 2
      },
      location: {
        type: 'offline',
        address: '東京都世田谷区三軒茶屋',
        coordinates: {
          lat: 35.6434,
          lng: 139.6690
        }
      },
      teacher: {
        id: 'teacher1',
        name: '田中 花子',
        photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
        bio: '料理歴30年、元料理教室講師です。',
        location: '世田谷区',
        teachingExperience: 8,
        specialties: ['家庭料理', '和食', '健康料理'],
        languages: ['日本語'],
        rating: {
          average: 4.8,
          count: 142
        },
        verificationStatus: {
          isEmailVerified: true,
          isPhoneVerified: true,
          isDocumentVerified: true
        }
      },
      images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800'],
      rating: {
        average: 4.7,
        count: 28,
        distribution: { 5: 18, 4: 8, 3: 2, 2: 0, 1: 0 }
      },
      reviews: [],
      prerequisites: [],
      materials: [],
      tags: [],
      statistics: {
        bookingCount: 156,
        favoriteCount: 42,
        viewCount: 1248
      },
      isAvailableForBooking: true,
      createdAt: new Date('2023-12-01'),
      updatedAt: new Date('2024-01-15'),
      ageRange: {
        min: 50,
        max: 80,
        description: '50歳以上推奨'
      }
    }
  }
  
  return sampleSkills[id] || null
}

// 利用可能な時間スロット（モックデータ）
const getAvailableTimeSlots = (date: Date) => {
  const baseSlots = [
    { start: '10:00', end: '12:00', available: true, capacity: 6, booked: 1 },
    { start: '13:00', end: '15:00', available: true, capacity: 6, booked: 3 },
    { start: '15:30', end: '17:30', available: true, capacity: 6, booked: 0 },
    { start: '18:00', end: '20:00', available: false, capacity: 6, booked: 6 }, // 満席
  ]
  
  // 過去の日付は利用不可
  const today = new Date()
  if (date < today) {
    return baseSlots.map(slot => ({ ...slot, available: false }))
  }
  
  return baseSlots
}

type BookingStep = 'datetime' | 'details' | 'payment' | 'confirmation'

interface BookingFormData {
  selectedDate: Date | null
  selectedTimeSlot: string | null
  participantCount: number
  studentName: string
  studentEmail: string
  studentPhone: string
  specialRequests: string
  paymentMethod: PaymentMethod
}

export default function SkillBookingPage() {
  const params = useParams()
  const router = useRouter()
  const skillId = params.id as string

  const [skill, setSkill] = useState<Skill | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [currentStep, setCurrentStep] = useState<BookingStep>('datetime')
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [availableSlots, setAvailableSlots] = useState<any[]>([])

  const [formData, setFormData] = useState<BookingFormData>({
    selectedDate: null,
    selectedTimeSlot: null,
    participantCount: 1,
    studentName: '',
    studentEmail: '',
    studentPhone: '',
    specialRequests: '',
    paymentMethod: 'card'
  })

  // スキルデータ取得
  useEffect(() => {
    const fetchSkill = async () => {
      try {
        setLoading(true)
        const skillData = getMockSkill(skillId)
        
        if (!skillData) {
          setError('スキルが見つかりませんでした')
          return
        }
        
        setSkill(skillData)
      } catch (err) {
        setError('データの読み込みに失敗しました')
      } finally {
        setLoading(false)
      }
    }

    if (skillId) {
      fetchSkill()
    }
  }, [skillId])

  // 選択された日付の利用可能時間スロットを取得
  useEffect(() => {
    if (formData.selectedDate) {
      const slots = getAvailableTimeSlots(formData.selectedDate)
      setAvailableSlots(slots)
    }
  }, [formData.selectedDate])

  // カレンダーの日付生成
  const generateCalendarDays = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const today = new Date()
    
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)
      
      const isCurrentMonth = currentDate.getMonth() === date.getMonth()
      const isPast = currentDate < today
      const isToday = currentDate.toDateString() === today.toDateString()
      
      days.push({
        date: currentDate,
        isCurrentMonth,
        isPast,
        isToday,
        isSelected: formData.selectedDate?.toDateString() === currentDate.toDateString()
      })
    }
    
    return days
  }

  const handleDateSelect = (date: Date) => {
    if (date < new Date()) return // 過去の日付は選択不可
    
    setFormData(prev => ({
      ...prev,
      selectedDate: date,
      selectedTimeSlot: null // 日付変更時はタイムスロットをリセット
    }))
  }

  const handleTimeSlotSelect = (timeSlot: string) => {
    setFormData(prev => ({
      ...prev,
      selectedTimeSlot: timeSlot
    }))
  }

  const handleNextStep = () => {
    if (currentStep === 'datetime' && formData.selectedDate && formData.selectedTimeSlot) {
      setCurrentStep('details')
    } else if (currentStep === 'details') {
      if (!formData.studentName || !formData.studentEmail || !formData.studentPhone) {
        setError('必須項目を入力してください')
        return
      }
      setCurrentStep('payment')
    } else if (currentStep === 'payment') {
      setCurrentStep('confirmation')
    }
  }

  const handlePrevStep = () => {
    if (currentStep === 'details') {
      setCurrentStep('datetime')
    } else if (currentStep === 'payment') {
      setCurrentStep('details')
    } else if (currentStep === 'confirmation') {
      setCurrentStep('payment')
    }
  }

  const handlePaymentSuccess = (paymentIntentId: string) => {
    // 予約完了処理
    alert('予約が完了しました！')
    router.push('/bookings')
  }

  const handlePaymentError = (error: string) => {
    setError(error)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (error && !skill) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{error}</h1>
          <Button onClick={() => router.back()}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
        </div>
      </div>
    )
  }

  if (!skill) return null

  const calendarDays = generateCalendarDays(selectedMonth)
  const totalAmount = skill.pricing.amount * formData.participantCount

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="p-2"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {skill.title}の予約
                </h1>
                <p className="text-sm text-gray-600">
                  講師: {skill.teacher.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* プログレスバー */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[
              { id: 'datetime', label: '日時選択', step: 1 },
              { id: 'details', label: '詳細入力', step: 2 },
              { id: 'payment', label: '決済', step: 3 },
              { id: 'confirmation', label: '完了', step: 4 }
            ].map((item, index) => (
              <React.Fragment key={item.id}>
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep === item.id
                      ? 'bg-orange-600 text-white'
                      : item.step < (currentStep === 'datetime' ? 1 : currentStep === 'details' ? 2 : currentStep === 'payment' ? 3 : 4)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {item.step < (currentStep === 'datetime' ? 1 : currentStep === 'details' ? 2 : currentStep === 'payment' ? 3 : 4) ? '✓' : item.step}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    currentStep === item.id ? 'text-orange-600' : 'text-gray-600'
                  }`}>
                    {item.label}
                  </span>
                </div>
                {index < 3 && (
                  <div className={`w-8 h-0.5 ${
                    item.step < (currentStep === 'datetime' ? 1 : currentStep === 'details' ? 2 : currentStep === 'payment' ? 3 : 4)
                      ? 'bg-green-600'
                      : 'bg-gray-300'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* メインコンテンツ */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {/* 日時選択ステップ */}
              {currentStep === 'datetime' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">日時を選択してください</h2>

                  {/* カレンダー */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedMonth.getFullYear()}年{selectedMonth.getMonth() + 1}月
                      </h3>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newMonth = new Date(selectedMonth)
                            newMonth.setMonth(selectedMonth.getMonth() - 1)
                            setSelectedMonth(newMonth)
                          }}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newMonth = new Date(selectedMonth)
                            newMonth.setMonth(selectedMonth.getMonth() + 1)
                            setSelectedMonth(newMonth)
                          }}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['日', '月', '火', '水', '木', '金', '土'].map(day => (
                        <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                          {day}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {calendarDays.map((day, index) => (
                        <button
                          key={index}
                          onClick={() => handleDateSelect(day.date)}
                          disabled={day.isPast || !day.isCurrentMonth}
                          className={`p-2 text-sm rounded-lg transition-colors ${
                            day.isSelected
                              ? 'bg-orange-600 text-white'
                              : day.isToday
                              ? 'bg-orange-100 text-orange-800'
                              : day.isPast || !day.isCurrentMonth
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          {day.date.getDate()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 時間選択 */}
                  {formData.selectedDate && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {formData.selectedDate.getMonth() + 1}月{formData.selectedDate.getDate()}日の利用可能時間
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {availableSlots.map((slot, index) => {
                          const slotKey = `${slot.start}-${slot.end}`
                          const isSelected = formData.selectedTimeSlot === slotKey
                          const availabilityRate = (slot.capacity - slot.booked) / slot.capacity
                          
                          let statusColor = 'border-green-200 text-green-800'
                          let statusText = `空き${slot.capacity - slot.booked}名`
                          
                          if (!slot.available || slot.booked >= slot.capacity) {
                            statusColor = 'border-gray-300 text-gray-500'
                            statusText = '満席'
                          } else if (availabilityRate <= 0.3) {
                            statusColor = 'border-orange-200 text-orange-800'
                            statusText = '残りわずか'
                          }

                          return (
                            <button
                              key={index}
                              onClick={() => handleTimeSlotSelect(slotKey)}
                              disabled={!slot.available || slot.booked >= slot.capacity}
                              className={`p-4 border-2 rounded-lg transition-all text-left ${
                                isSelected
                                  ? 'border-orange-500 bg-orange-50'
                                  : !slot.available || slot.booked >= slot.capacity
                                  ? `${statusColor} opacity-50 cursor-not-allowed`
                                  : `${statusColor} hover:shadow-sm`
                              }`}
                            >
                              <div className="flex items-center space-x-2 mb-1">
                                <Clock className="w-4 h-4" />
                                <span className="font-medium">
                                  {slot.start} - {slot.end}
                                </span>
                              </div>
                              <div className="text-sm">{statusText}</div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 詳細入力ステップ */}
              {currentStep === 'details' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">参加者情報を入力してください</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        参加人数 <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.participantCount}
                        onChange={(e) => setFormData(prev => ({ ...prev, participantCount: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        {Array.from({ length: Math.min(5, skill.capacity.maxStudents - skill.capacity.currentBookings) }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}名
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Input
                      label="お名前"
                      value={formData.studentName}
                      onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
                      placeholder="田中太郎"
                      required
                      className="h-12"
                    />

                    <Input
                      label="メールアドレス"
                      type="email"
                      value={formData.studentEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, studentEmail: e.target.value }))}
                      placeholder="example@email.com"
                      required
                      className="h-12"
                    />

                    <Input
                      label="電話番号"
                      type="tel"
                      value={formData.studentPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, studentPhone: e.target.value }))}
                      placeholder="090-1234-5678"
                      required
                      className="h-12"
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        特別なご要望・質問（任意）
                      </label>
                      <textarea
                        value={formData.specialRequests}
                        onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="アレルギーや特別な配慮が必要な場合はお知らせください"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 決済ステップ */}
              {currentStep === 'payment' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">お支払い方法を選択してください</h2>

                  <PaymentForm
                    bookingId={`booking-${id}-${Date.now()}`}
                    amount={totalAmount}
                    currency="JPY"
                    paymentMethod={formData.paymentMethod}
                    onPaymentMethodChange={(method) => setFormData(prev => ({ ...prev, paymentMethod: method }))}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                    skillId={id}
                    participantCount={formData.participants}
                    contactEmail={formData.email}
                  />
                </div>
              )}

              {/* 確認ステップ */}
              {currentStep === 'confirmation' && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">予約が完了しました！</h2>
                  <p className="text-gray-600 mb-6">
                    予約確認メールをお送りしました。当日をお楽しみに！
                  </p>
                  <div className="space-y-3">
                    <Button onClick={() => router.push('/bookings')} className="w-full">
                      予約一覧を見る
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => router.push(`/skills/${skillId}/review`)} 
                      className="w-full"
                    >
                      レビューを投稿する
                    </Button>
                    <Button variant="outline" onClick={() => router.push('/')} className="w-full">
                      ホームに戻る
                    </Button>
                  </div>
                </div>
              )}

              {/* ナビゲーションボタン */}
              {currentStep !== 'confirmation' && (
                <div className="mt-8 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePrevStep}
                    disabled={currentStep === 'datetime'}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    戻る
                  </Button>

                  <Button
                    onClick={handleNextStep}
                    disabled={
                      (currentStep === 'datetime' && (!formData.selectedDate || !formData.selectedTimeSlot)) ||
                      (currentStep === 'details' && (!formData.studentName || !formData.studentEmail || !formData.studentPhone))
                    }
                  >
                    {currentStep === 'payment' ? '予約を確定する' : '次へ'}
                    {currentStep !== 'payment' && <ChevronRight className="w-4 h-4 ml-2" />}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* 予約サマリー */}
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">予約内容</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <img
                    src={skill.images[0]}
                    alt={skill.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{skill.title}</h4>
                    <p className="text-sm text-gray-600">講師: {skill.teacher.name}</p>
                  </div>
                </div>

                {formData.selectedDate && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {formData.selectedDate.getFullYear()}年
                      {formData.selectedDate.getMonth() + 1}月
                      {formData.selectedDate.getDate()}日
                    </span>
                  </div>
                )}

                {formData.selectedTimeSlot && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{formData.selectedTimeSlot.replace('-', ' - ')}</span>
                  </div>
                )}

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{skill.location.address}</span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{formData.participantCount}名</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">基本料金</span>
                    <span className="text-sm text-gray-900">
                      ¥{skill.pricing.amount.toLocaleString()} × {formData.participantCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-lg font-semibold">
                    <span>合計</span>
                    <span>¥{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 講師情報 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">講師情報</h3>
              
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={skill.teacher.photoURL}
                  alt={skill.teacher.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium text-gray-900">{skill.teacher.name}</h4>
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600">
                      {skill.teacher.rating.average.toFixed(1)} ({skill.teacher.rating.count}件)
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{skill.teacher.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>指導歴 {skill.teacher.teachingExperience}年</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}