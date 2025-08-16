'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  Star,
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/store/authStore'
import { Loading } from '@/components/Loading'

interface ReviewFormData {
  rating: number
  title: string
  comment: string
  pros: string[]
  cons: string[]
  wouldRecommend: boolean
}

interface SkillSummary {
  id: string
  title: string
  teacher: {
    name: string
    photoURL?: string
  }
  images: string[]
}

// モックスキルデータ
const getSkillSummary = (id: string): SkillSummary | null => {
  const skills: Record<string, SkillSummary> = {
    '1': {
      id: '1',
      title: '初心者向けお料理教室',
      teacher: {
        name: '田中 花子',
        photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400'
      },
      images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800']
    },
    '2': {
      id: '2',
      title: 'ベランダでできる簡単ガーデニング',
      teacher: {
        name: '鈴木 一郎',
        photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
      },
      images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800']
    }
  }
  
  return skills[id] || null
}

export default function ReviewPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuthStore()
  const skillId = params.id as string

  const [skill, setSkill] = useState<SkillSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 0,
    title: '',
    comment: '',
    pros: [''],
    cons: [''],
    wouldRecommend: true
  })

  // スキル情報取得
  useEffect(() => {
    const fetchSkill = async () => {
      try {
        setLoading(true)
        const skillData = getSkillSummary(skillId)
        
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

  // 評価星クリック
  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }))
  }

  // 良かった点の追加/削除
  const handleProsChange = (index: number, value: string) => {
    const newPros = [...formData.pros]
    newPros[index] = value
    setFormData(prev => ({ ...prev, pros: newPros }))
  }

  const addPro = () => {
    setFormData(prev => ({ ...prev, pros: [...prev.pros, ''] }))
  }

  const removePro = (index: number) => {
    if (formData.pros.length > 1) {
      const newPros = formData.pros.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, pros: newPros }))
    }
  }

  // 改善点の追加/削除
  const handleConsChange = (index: number, value: string) => {
    const newCons = [...formData.cons]
    newCons[index] = value
    setFormData(prev => ({ ...prev, cons: newCons }))
  }

  const addCon = () => {
    setFormData(prev => ({ ...prev, cons: [...prev.cons, ''] }))
  }

  const removeCon = (index: number) => {
    if (formData.cons.length > 1) {
      const newCons = formData.cons.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, cons: newCons }))
    }
  }

  // レビュー送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.rating) {
      setError('評価を選択してください')
      return
    }
    
    if (!formData.comment.trim()) {
      setError('コメントを入力してください')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      // APIに送信（モック）
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setSuccess(true)
      setTimeout(() => {
        router.push(`/skills/${skillId}`)
      }, 2000)
    } catch (err) {
      setError('レビューの投稿に失敗しました')
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">ログインが必要です</h1>
          <Button onClick={() => router.push('/login')}>
            ログインする
          </Button>
        </div>
      </div>
    )
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

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            レビューを投稿しました！
          </h1>
          <p className="text-gray-600 mb-6">
            ありがとうございます。あなたのレビューが他の学習者の参考になります。
          </p>
          <div className="space-y-3">
            <Button onClick={() => router.push(`/skills/${skillId}`)}>
              スキル詳細に戻る
            </Button>
            <Button variant="outline" onClick={() => router.push('/bookings')}>
              予約一覧を見る
            </Button>
          </div>
        </div>
      </div>
    )
  }

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
              <h1 className="text-xl font-semibold text-gray-900">
                レビューを投稿
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* スキル情報 */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start space-x-4">
              <img
                src={skill.images[0]}
                alt={skill.title}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {skill.title}
                </h2>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {skill.teacher.photoURL ? (
                        <img
                          src={skill.teacher.photoURL}
                          alt={skill.teacher.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                    <span className="text-gray-700">{skill.teacher.name}先生</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* レビューフォーム */}
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* 評価 */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                総合評価 <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleRatingClick(rating)}
                    className="p-1 transition-colors"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        rating <= formData.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                {formData.rating > 0 && (
                  <span className="ml-4 text-lg font-medium text-gray-700">
                    {formData.rating === 1 && '期待以下'}
                    {formData.rating === 2 && '期待をやや下回る'}
                    {formData.rating === 3 && '期待通り'}
                    {formData.rating === 4 && '期待を上回る'}
                    {formData.rating === 5 && '期待を大きく上回る'}
                  </span>
                )}
              </div>
            </div>

            {/* タイトル */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                レビュータイトル（任意）
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="例：とても分かりやすい指導でした"
                className="h-12"
              />
            </div>

            {/* コメント */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                詳細コメント <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                placeholder="実際に参加してみていかがでしたか？具体的な感想をお聞かせください。"
              />
              <div className="mt-2 text-right text-sm text-gray-500">
                {formData.comment.length}/1000文字
              </div>
            </div>

            {/* 良かった点 */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                良かった点（任意）
              </label>
              <div className="space-y-3">
                {formData.pros.map((pro, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <ThumbsUp className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <Input
                      value={pro}
                      onChange={(e) => handleProsChange(index, e.target.value)}
                      placeholder="良かった点を入力"
                      className="flex-1"
                    />
                    {formData.pros.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removePro(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        削除
                      </Button>
                    )}
                  </div>
                ))}
                {formData.pros.length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addPro}
                  >
                    良かった点を追加
                  </Button>
                )}
              </div>
            </div>

            {/* 改善点 */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                改善してほしい点（任意）
              </label>
              <div className="space-y-3">
                {formData.cons.map((con, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <ThumbsDown className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    <Input
                      value={con}
                      onChange={(e) => handleConsChange(index, e.target.value)}
                      placeholder="改善してほしい点を入力"
                      className="flex-1"
                    />
                    {formData.cons.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCon(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        削除
                      </Button>
                    )}
                  </div>
                ))}
                {formData.cons.length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCon}
                  >
                    改善点を追加
                  </Button>
                )}
              </div>
            </div>

            {/* おすすめするか */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                他の人におすすめしますか？
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, wouldRecommend: true }))}
                  className={`flex-1 p-4 border-2 rounded-lg transition-colors ${
                    formData.wouldRecommend
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <ThumbsUp className="w-6 h-6 mx-auto mb-2" />
                  <span className="font-medium">はい、おすすめします</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, wouldRecommend: false }))}
                  className={`flex-1 p-4 border-2 rounded-lg transition-colors ${
                    !formData.wouldRecommend
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <ThumbsDown className="w-6 h-6 mx-auto mb-2" />
                  <span className="font-medium">改善の余地があります</span>
                </button>
              </div>
            </div>

            {/* 注意事項 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">レビューの投稿について</h3>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• 投稿されたレビューは公開され、他のユーザーが閲覧できます</li>
                <li>• 個人情報や不適切な内容は投稿しないでください</li>
                <li>• 建設的で具体的なフィードバックをお願いします</li>
                <li>• 投稿後の編集・削除はお問い合わせください</li>
              </ul>
            </div>

            {/* 送信ボタン */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={submitting}
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                loading={submitting}
                disabled={!formData.rating || !formData.comment.trim()}
              >
                レビューを投稿する
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}