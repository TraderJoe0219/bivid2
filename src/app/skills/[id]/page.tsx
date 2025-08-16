'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  Star, 
  MapPin, 
  Clock, 
  Users, 
  Heart,
  Share2,
  Calendar,
  MessageSquare,
  ChevronLeft,
  Award,
  Shield,
  CheckCircle,
  AlertCircle,
  Camera,
  Play,
  ExternalLink,
  Phone,
  Mail
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Skill, SkillReview, SKILL_CATEGORIES } from '@/types/skill'
import { Loading } from '@/components/Loading'

// モックデータ - 実際の実装ではAPIから取得
const getMockSkill = (id: string): Skill | null => {
  // TODO: 実際のAPI呼び出しに置き換え
  return null
}

export default function SkillDetailPage() {
  const params = useParams()
  const router = useRouter()
  const skillId = params.id as string

  const [skill, setSkill] = useState<Skill | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'teacher'>('overview')
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)

  // データ取得
  useEffect(() => {
    const fetchSkill = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // TODO: 実際のAPI呼び出し
        // const skillData = await getSkillById(skillId)
        const skillData = getMockSkill(skillId)
        
        if (!skillData) {
          setError('スキルが見つかりませんでした')
          return
        }
        
        setSkill(skillData)
      } catch (err) {
        setError('スキルの読み込みに失敗しました')
        console.error('Skill fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    if (skillId) {
      fetchSkill()
    }
  }, [skillId])

  // お気に入り切り替え
  const handleFavoriteToggle = async () => {
    try {
      // TODO: API呼び出し
      // await toggleFavoriteSkill(skillId, !isFavorite)
      setIsFavorite(!isFavorite)
    } catch (error) {
      console.error('Favorite toggle error:', error)
    }
  }

  // 共有機能
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: skill?.title,
          text: skill?.shortDescription || skill?.description,
          url: window.location.href
        })
      } catch (error) {
        console.error('Share error:', error)
      }
    } else {
      // フォールバック: クリップボードにコピー
      await navigator.clipboard.writeText(window.location.href)
      alert('リンクをクリップボードにコピーしました')
    }
  }

  // 予約処理
  const handleBooking = () => {
    setShowBookingModal(true)
  }

  // 相談処理
  const handleContact = () => {
    setShowContactModal(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (error || !skill) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error || 'スキルが見つかりません'}
          </h1>
          <p className="text-gray-600 mb-4">
            お探しのスキルは削除されたか、URLが間違っている可能性があります。
          </p>
          <Button onClick={() => router.back()}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
        </div>
      </div>
    )
  }

  const categoryConfig = SKILL_CATEGORIES.find(cat => cat.value === skill.category)
  const priceDisplay = skill.pricing.amount === 0 
    ? '無料' 
    : `¥${skill.pricing.amount.toLocaleString()}/${skill.pricing.unit}`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <h1 className="text-xl font-semibold text-gray-900 truncate">
                  {skill.title}
                </h1>
                <p className="text-sm text-gray-600">
                  by {skill.teacher.name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleFavoriteToggle}
                className={isFavorite ? 'text-red-600' : 'text-gray-600'}
              >
                <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                お気に入り
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 mr-2" />
                共有
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* メインコンテンツ */}
          <div className="lg:col-span-2 space-y-8">
            {/* 画像ギャラリー */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {skill.images.length > 0 ? (
                <div>
                  <div className="aspect-video relative">
                    <img
                      src={skill.images[selectedImageIndex]}
                      alt={skill.title}
                      className="w-full h-full object-cover"
                    />
                    {skill.images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {skill.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`w-2 h-2 rounded-full ${
                              index === selectedImageIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  {skill.images.length > 1 && (
                    <div className="p-4 flex space-x-2 overflow-x-auto">
                      {skill.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                            index === selectedImageIndex ? 'border-orange-500' : 'border-gray-200'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${skill.title} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">画像がありません</p>
                  </div>
                </div>
              )}
            </div>

            {/* タブナビゲーション */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: '概要', icon: <Star className="w-4 h-4" /> },
                    { id: 'reviews', label: 'レビュー', icon: <MessageSquare className="w-4 h-4" /> },
                    { id: 'teacher', label: '講師情報', icon: <Users className="w-4 h-4" /> }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center space-x-2 py-4 border-b-2 text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'border-orange-500 text-orange-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* 概要タブ */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">スキルについて</h3>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {skill.description}
                      </p>
                    </div>

                    {skill.prerequisites.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">必要な条件</h3>
                        <ul className="space-y-2">
                          {skill.prerequisites.map((req, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {skill.materials.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">必要な材料・道具</h3>
                        <ul className="space-y-2">
                          {skill.materials.map((material, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-gray-700">{material}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {skill.videos && skill.videos.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">紹介動画</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {skill.videos.map((video, index) => (
                            <div key={index} className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                              <Play className="w-12 h-12 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* レビュータブ */}
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        レビュー ({skill.rating.count}件)
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="text-lg font-semibold text-gray-900">
                          {skill.rating.average.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    {/* 評価分布 */}
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map(rating => {
                        const count = skill.rating.distribution[rating as keyof typeof skill.rating.distribution] || 0
                        const percentage = skill.rating.count > 0 ? (count / skill.rating.count) * 100 : 0
                        
                        return (
                          <div key={rating} className="flex items-center space-x-3">
                            <span className="text-sm text-gray-600 w-8">{rating}★</span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-yellow-400" 
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 w-8">{count}</span>
                          </div>
                        )
                      })}
                    </div>

                    {/* レビュー一覧 */}
                    <div className="space-y-4">
                      {skill.reviews.map(review => (
                        <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              {review.student.photoURL ? (
                                <img
                                  src={review.student.photoURL}
                                  alt={review.student.name}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-sm font-medium text-gray-600">
                                  {review.student.name.charAt(0)}
                                </span>
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <p className="font-medium text-gray-900">{review.student.name}</p>
                                  <div className="flex items-center space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <span className="text-sm text-gray-500">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              
                              {review.title && (
                                <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                              )}
                              
                              <p className="text-gray-700 mb-3">{review.comment}</p>
                              
                              {(review.pros?.length || review.cons?.length) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {review.pros && review.pros.length > 0 && (
                                    <div>
                                      <h5 className="text-sm font-medium text-green-700 mb-2">良かった点</h5>
                                      <ul className="space-y-1">
                                        {review.pros.map((pro, index) => (
                                          <li key={index} className="text-sm text-gray-700 flex items-start space-x-1">
                                            <span className="text-green-500">+</span>
                                            <span>{pro}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  
                                  {review.cons && review.cons.length > 0 && (
                                    <div>
                                      <h5 className="text-sm font-medium text-red-700 mb-2">改善点</h5>
                                      <ul className="space-y-1">
                                        {review.cons.map((con, index) => (
                                          <li key={index} className="text-sm text-gray-700 flex items-start space-x-1">
                                            <span className="text-red-500">-</span>
                                            <span>{con}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <span>参考になった: {review.helpfulCount}</span>
                                  {review.wouldRecommend && (
                                    <span className="text-green-600">おすすめします</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 講師情報タブ */}
                {activeTab === 'teacher' && (
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {skill.teacher.photoURL ? (
                          <img
                            src={skill.teacher.photoURL}
                            alt={skill.teacher.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl font-medium text-gray-600">
                            {skill.teacher.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {skill.teacher.name}
                          </h3>
                          {skill.teacher.verificationStatus.isDocumentVerified && (
                            <Shield className="w-5 h-5 text-blue-500" title="身元確認済み" />
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="font-medium">{skill.teacher.rating.average.toFixed(1)}</span>
                            <span className="text-gray-600">({skill.teacher.rating.count}件)</span>
                          </div>
                          
                          <span className="text-gray-600">
                            指導歴 {skill.teacher.teachingExperience}年
                          </span>
                        </div>
                        
                        <p className="text-gray-600">{skill.teacher.location}</p>
                      </div>
                    </div>

                    {skill.teacher.bio && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">自己紹介</h4>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                          {skill.teacher.bio}
                        </p>
                      </div>
                    )}

                    {skill.teacher.specialties.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">専門分野</h4>
                        <div className="flex flex-wrap gap-2">
                          {skill.teacher.specialties.map((specialty, index) => (
                            <span
                              key={index}
                              className="bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {skill.teacher.languages.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">対応言語</h4>
                        <div className="flex flex-wrap gap-2">
                          {skill.teacher.languages.map((language, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                            >
                              {language}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* 予約カード */}
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {priceDisplay}
                </div>
                {skill.pricing.amount > 0 && (
                  <p className="text-gray-600">から</p>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">
                    {skill.duration.typical}分（{skill.duration.minimum}〜{skill.duration.maximum}分）
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">
                    {skill.location.type === 'online' ? 'オンライン' : 
                     skill.location.type === 'offline' ? '対面' : 'ハイブリッド'}
                    {skill.location.address && ` (${skill.location.address})`}
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">
                    最大{skill.capacity.maxStudents}名
                    {skill.capacity.currentBookings > 0 && 
                      ` (残り${skill.capacity.maxStudents - skill.capacity.currentBookings}名)`
                    }
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleBooking}
                  className="w-full"
                  disabled={!skill.isAvailableForBooking}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  予約する
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleContact}
                  className="w-full"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  相談する
                </Button>
              </div>
            </div>

            {/* スキル情報 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">スキル詳細</h3>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">カテゴリ</span>
                  <p className="font-medium">{categoryConfig?.label}</p>
                </div>
                
                <div>
                  <span className="text-sm text-gray-600">難易度</span>
                  <p className="font-medium">
                    {skill.difficulty === 'beginner' ? '初級' :
                     skill.difficulty === 'intermediate' ? '中級' :
                     skill.difficulty === 'advanced' ? '上級' : 'すべてのレベル'}
                  </p>
                </div>
                
                <div>
                  <span className="text-sm text-gray-600">対象年齢</span>
                  <p className="font-medium">{skill.ageRange.description}</p>
                </div>
                
                <div>
                  <span className="text-sm text-gray-600">学習回数</span>
                  <p className="font-medium">{skill.statistics.bookingCount}回</p>
                </div>
                
                <div>
                  <span className="text-sm text-gray-600">お気に入り</span>
                  <p className="font-medium">{skill.statistics.favoriteCount}件</p>
                </div>
              </div>
            </div>

            {/* 安全・信頼情報 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-500" />
                安全・信頼
              </h3>
              
              <div className="space-y-3">
                {skill.teacher.verificationStatus.isEmailVerified && (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">メール認証済み</span>
                  </div>
                )}
                
                {skill.teacher.verificationStatus.isPhoneVerified && (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">電話番号認証済み</span>
                  </div>
                )}
                
                {skill.teacher.verificationStatus.isDocumentVerified && (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">身元確認済み</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}