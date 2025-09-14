'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Star,
  MapPin,
  Clock,
  Users,
  Heart,
  ChevronRight,
  Calendar,
  Award,
  Monitor,
  MessageSquare,
  Share2
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Skill, SKILL_CATEGORIES } from '@/types/skill'
import { formatDistance } from '@/lib/distance'

interface SkillCardProps {
  skill: Skill
  showDistance?: boolean
  distance?: number
  onFavoriteToggle?: (skillId: string, isFavorite: boolean) => void
  onBookingClick?: (skill: Skill) => void
  onContactClick?: (skill: Skill) => void
  onShareClick?: (skill: Skill) => void
  isFavorite?: boolean
  size?: 'small' | 'medium' | 'large'
  layout?: 'horizontal' | 'vertical'
  className?: string
}

export default function SkillCard({
  skill,
  showDistance = false,
  distance,
  onFavoriteToggle,
  onBookingClick,
  onContactClick,
  onShareClick,
  isFavorite = false,
  size = 'medium',
  layout = 'vertical',
  className = ''
}: SkillCardProps) {
  const [imageError, setImageError] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)

  // カテゴリー情報を取得
  const categoryConfig = SKILL_CATEGORIES.find(cat => cat.value === skill.category)
  
  // 価格表示
  const priceDisplay = skill.pricing.amount === 0 
    ? '無料' 
    : `¥${skill.pricing.amount.toLocaleString()}/${skill.pricing.unit}`

  // 場所タイプのアイコンと表示
  const getLocationTypeDisplay = () => {
    switch (skill.location.type) {
      case 'online':
        return { icon: <Monitor className="w-4 h-4" />, text: 'オンライン' }
      case 'offline':
        return { icon: <MapPin className="w-4 h-4" />, text: '対面' }
      case 'hybrid':
        return { icon: <Monitor className="w-4 h-4" />, text: 'ハイブリッド' }
      default:
        return { icon: <MapPin className="w-4 h-4" />, text: '未設定' }
    }
  }

  // 難易度の表示
  const getDifficultyDisplay = () => {
    const difficultyMap = {
      beginner: { text: '初級', color: 'bg-green-100 text-green-800' },
      intermediate: { text: '中級', color: 'bg-yellow-100 text-yellow-800' },
      advanced: { text: '上級', color: 'bg-red-100 text-red-800' },
      all_levels: { text: 'すべて', color: 'bg-blue-100 text-blue-800' }
    }
    return difficultyMap[skill.difficulty] || difficultyMap.all_levels
  }

  // お気に入り切り替え
  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (favoriteLoading) return
    
    setFavoriteLoading(true)
    try {
      await onFavoriteToggle?.(skill.id, !isFavorite)
    } finally {
      setFavoriteLoading(false)
    }
  }

  // アクションボタンのクリック処理
  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault()
    e.stopPropagation()
    action()
  }

  const locationTypeDisplay = getLocationTypeDisplay()
  const difficultyDisplay = getDifficultyDisplay()

  // レイアウトに応じたスタイル
  const cardClasses = {
    small: 'p-4',
    medium: 'p-5',
    large: 'p-6'
  }[size]

  const imageClasses = {
    small: layout === 'horizontal' ? 'w-20 h-20' : 'w-full h-32',
    medium: layout === 'horizontal' ? 'w-24 h-24' : 'w-full h-40',
    large: layout === 'horizontal' ? 'w-32 h-32' : 'w-full h-48'
  }[size]

  return (
    <Link href={`/skills/${skill.id}`}>
      <div className={`
        group bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md 
        transition-all duration-200 hover:border-orange-300 cursor-pointer
        ${layout === 'horizontal' ? 'flex items-start space-x-4' : 'flex flex-col'}
        ${cardClasses} ${className}
      `}>
        {/* 画像セクション */}
        <div className={`relative flex-shrink-0 ${imageClasses}`}>
          {skill.images.length > 0 && !imageError ? (
            <img
              src={skill.images[0]}
              alt={skill.title}
              className="w-full h-full object-cover rounded-lg"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-3xl">{categoryConfig?.icon || '📚'}</span>
            </div>
          )}
          
          {/* お気に入りボタン */}
          <button
            onClick={handleFavoriteClick}
            disabled={favoriteLoading}
            className={`
              absolute top-2 right-2 p-2 rounded-full bg-white shadow-md
              transition-all duration-200 hover:scale-110
              ${isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}
              ${favoriteLoading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* 特徴バッジ */}
          <div className="absolute top-2 left-2 space-y-1">
            {skill.isFeatured && (
              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                注目
              </span>
            )}
            {skill.pricing.amount === 0 && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                無料
              </span>
            )}
          </div>
        </div>

        {/* コンテンツセクション */}
        <div className={`flex-1 ${layout === 'horizontal' ? '' : 'mt-4'} min-w-0`}>
          {/* ヘッダー情報 */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                  {categoryConfig?.label || 'その他'}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${difficultyDisplay.color}`}>
                  {difficultyDisplay.text}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                {skill.title}
              </h3>
            </div>
            
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors ml-2 flex-shrink-0" />
          </div>

          {/* 講師情報 */}
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {skill.teacher.photoURL ? (
                <img
                  src={skill.teacher.photoURL}
                  alt={skill.teacher.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium text-gray-600">
                  {skill.teacher.name.charAt(0)}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {skill.teacher.name}
              </p>
              <p className="text-xs text-gray-600 truncate">
                {skill.teacher.location}
              </p>
            </div>
            {skill.teacher.verificationStatus.isDocumentVerified && (
              <Award className="w-4 h-4 text-blue-500" title="身元確認済み" />
            )}
          </div>

          {/* 評価と統計 */}
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-900">
                {skill.rating.average.toFixed(1)}
              </span>
              <span className="text-xs text-gray-600">
                ({skill.rating.count})
              </span>
            </div>
            
            {showDistance && distance !== undefined && distance !== Infinity && (
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-600">
                  {formatDistance(distance)}
                </span>
              </div>
            )}
            
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-600">
                {skill.statistics.bookingCount}回
              </span>
            </div>
          </div>

          {/* 説明文 */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {skill.shortDescription || skill.description}
          </p>

          {/* 詳細情報 */}
          <div className="flex items-center justify-between mb-4 text-xs text-gray-600">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                {locationTypeDisplay.icon}
                <span>{locationTypeDisplay.text}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{skill.duration.typical}分</span>
              </div>
            </div>
          </div>

          {/* 価格とアクション */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline space-x-1">
              <span className="text-lg font-bold text-gray-900">
                {priceDisplay}
              </span>
              {skill.pricing.amount > 0 && (
                <span className="text-sm text-gray-600">
                  から
                </span>
              )}
            </div>

            {size !== 'small' && (
              <div className="flex items-center space-x-2">
                {onContactClick && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleActionClick(e, () => onContactClick(skill))}
                    className="text-xs px-3 py-1"
                  >
                    <MessageSquare className="w-3 h-3 mr-1" />
                    相談
                  </Button>
                )}
                
                {onBookingClick && (
                  <Button
                    size="sm"
                    onClick={(e) => handleActionClick(e, () => onBookingClick(skill))}
                    className="text-xs px-3 py-1"
                    disabled={!skill.isAvailableForBooking}
                  >
                    <Calendar className="w-3 h-3 mr-1" />
                    予約
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* モバイル用アクションボタン */}
          {size === 'small' && (
            <div className="flex items-center space-x-2 mt-3">
              {onShareClick && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleActionClick(e, () => onShareClick(skill))}
                  className="text-xs p-1 text-gray-600 hover:text-gray-800"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}