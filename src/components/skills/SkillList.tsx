'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { 
  Grid, 
  List, 
  SlidersHorizontal, 
  ArrowUpDown,
  Filter,
  Search,
  MapPin,
  Heart,
  Loader
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import SkillCard from './SkillCard'
import AdvancedFilters from '@/components/search/AdvancedFilters'
import { useSkillSearch } from '@/hooks/useSkillSearch'
import { Skill, SkillSearchParams } from '@/types/skill'
import { useAuthStore } from '@/store/authStore'
import { SORT_OPTIONS } from '@/lib/validations/search'

interface SkillListProps {
  initialFilters?: Partial<SkillSearchParams>
  showMap?: boolean
  onMapToggle?: () => void
  onSkillSelect?: (skill: Skill) => void
  className?: string
  userLocation?: { lat: number; lng: number }
}

type ViewMode = 'grid' | 'list'
type GridSize = 'small' | 'medium' | 'large'

export default function SkillList({
  initialFilters = {},
  showMap = false,
  onMapToggle,
  onSkillSelect,
  className = '',
  userLocation
}: SkillListProps) {
  // 表示設定
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [gridSize, setGridSize] = useState<GridSize>('medium')
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  // 検索フック
  const {
    searchParams,
    updateSearchParam,
    resetSearchParams,
    skills,
    totalCount,
    hasMore,
    currentPage,
    totalPages,
    goToPage,
    loadMore,
    isLoading,
    isSearching,
    error,
    activeFilterCount,
    isFiltering,
    clearFilters,
    search
  } = useSkillSearch({
    initialParams: {
      limit: 12,
      ...initialFilters
    },
    autoSearch: true
  })

  // 距離計算（ハーバーサイン公式）
  const calculateDistance = useCallback((skill: Skill): number | undefined => {
    if (!userLocation || !skill.location.coordinates) return undefined
    
    const R = 6371 // 地球の半径（km）
    const dLat = (skill.location.coordinates.lat - userLocation.lat) * Math.PI / 180
    const dLng = (skill.location.coordinates.lng - userLocation.lng) * Math.PI / 180
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(skill.location.coordinates.lat * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }, [userLocation])

  // ソートされたスキル
  const sortedSkills = useMemo(() => {
    const skillsWithDistance = skills.map(skill => ({
      ...skill,
      distance: calculateDistance(skill)
    }))

    switch (searchParams.sortBy) {
      case 'distance':
        return skillsWithDistance.sort((a, b) => {
          if (!a.distance && !b.distance) return 0
          if (!a.distance) return 1
          if (!b.distance) return -1
          return a.distance - b.distance
        })
      case 'rating':
        return skillsWithDistance.sort((a, b) => b.rating.average - a.rating.average)
      case 'price_low':
        return skillsWithDistance.sort((a, b) => a.pricing.amount - b.pricing.amount)
      case 'price_high':
        return skillsWithDistance.sort((a, b) => b.pricing.amount - a.pricing.amount)
      case 'newest':
        return skillsWithDistance.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      case 'popular':
        return skillsWithDistance.sort((a, b) => b.statistics.bookingCount - a.statistics.bookingCount)
      default: // relevance
        return skillsWithDistance
    }
  }, [skills, searchParams.sortBy, calculateDistance])

  // フィルター更新
  const handleFiltersChange = useCallback((filters: Partial<SkillSearchParams>) => {
    Object.entries(filters).forEach(([key, value]) => {
      updateSearchParam(key as keyof SkillSearchParams, value)
    })
  }, [updateSearchParam])

  // お気に入り切り替え
  const handleFavoriteToggle = useCallback(async (skillId: string, isFavorite: boolean) => {
    setFavorites(prev => {
      const updated = new Set(prev)
      if (isFavorite) {
        updated.add(skillId)
      } else {
        updated.delete(skillId)
      }
      return updated
    })

    // TODO: API呼び出し
    try {
      // await toggleFavoriteSkill(skillId, isFavorite)
    } catch (error) {
      // エラー時は状態を戻す
      setFavorites(prev => {
        const updated = new Set(prev)
        if (isFavorite) {
          updated.delete(skillId)
        } else {
          updated.add(skillId)
        }
        return updated
      })
    }
  }, [])

  // スキル選択
  const handleSkillSelect = useCallback((skill: Skill) => {
    onSkillSelect?.(skill)
  }, [onSkillSelect])

  // 予約クリック
  const handleBookingClick = useCallback((skill: Skill) => {
    // TODO: 予約モーダルまたはページに遷移
    console.log('Booking clicked for skill:', skill.id)
  }, [])

  // 相談クリック
  const handleContactClick = useCallback(async (skill: Skill) => {
    try {
      // ログインチェック
      const { user } = useAuthStore.getState()
      if (!user) {
        alert('メッセージを送るにはログインが必要です')
        return
      }
      
      if (user.uid === skill.teacherId) {
        alert('自分のスキルにはメッセージを送れません')
        return
      }

      // メッセージページに遷移するか、会話を開始
      const initialMessage = `${skill.title}について質問があります。`
      
      // 実際の実装では react-router や Next.js router を使用
      const messageUrl = `/messages?teacherId=${skill.teacherId}&skillId=${skill.id}&message=${encodeURIComponent(initialMessage)}`
      window.open(messageUrl, '_blank')
    } catch (error) {
      console.error('Failed to start contact:', error)
      alert('メッセージの開始に失敗しました')
    }
  }, [])

  // 共有クリック
  const handleShareClick = useCallback((skill: Skill) => {
    if (navigator.share) {
      navigator.share({
        title: skill.title,
        text: skill.shortDescription || skill.description,
        url: window.location.origin + `/skills/${skill.id}`
      })
    } else {
      // フォールバック: クリップボードにコピー
      navigator.clipboard.writeText(window.location.origin + `/skills/${skill.id}`)
      // TODO: トースト通知
      alert('リンクをクリップボードにコピーしました')
    }
  }, [])

  // グリッドレイアウトのクラス
  const getGridClasses = () => {
    const sizeClasses = {
      small: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      medium: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      large: 'grid-cols-1 sm:grid-cols-2'
    }
    return `grid gap-6 ${sizeClasses[gridSize]}`
  }

  return (
    <div className={`bg-white ${className}`}>
      {/* ヘッダーコントロール */}
      <div className="border-b border-gray-200 p-4">
        {/* 検索とフィルター */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="スキルを検索..."
              value={searchParams.keyword || ''}
              onChange={(e) => updateSearchParam('keyword', e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>フィルター</span>
            {activeFilterCount > 0 && (
              <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>

          {onMapToggle && (
            <Button
              variant="outline"
              onClick={onMapToggle}
              className="flex items-center space-x-2"
            >
              <MapPin className="w-4 h-4" />
              <span>{showMap ? '一覧' : '地図'}</span>
            </Button>
          )}
        </div>

        {/* 表示設定とソート */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* 検索結果数 */}
            <span className="text-sm text-gray-600">
              {isSearching ? '検索中...' : `${totalCount.toLocaleString()}件のスキル`}
            </span>

            {/* アクティブフィルター表示 */}
            {isFiltering && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">フィルター適用中:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs text-orange-600 hover:text-orange-800"
                >
                  すべてクリア
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* ソート */}
            <select
              value={searchParams.sortBy || 'relevance'}
              onChange={(e) => updateSearchParam('sortBy', e.target.value as any)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-orange-500 focus:border-orange-500"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* 表示切り替え */}
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* グリッドサイズ（グリッド表示時のみ） */}
            {viewMode === 'grid' && (
              <select
                value={gridSize}
                onChange={(e) => setGridSize(e.target.value as GridSize)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1"
              >
                <option value="small">小</option>
                <option value="medium">中</option>
                <option value="large">大</option>
              </select>
            )}
          </div>
        </div>
      </div>

      {/* 高度なフィルター */}
      {showFilters && (
        <div className="p-4 border-b border-gray-200">
          <AdvancedFilters
            filters={searchParams}
            onFiltersChange={handleFiltersChange}
            onClearFilters={clearFilters}
            isOpen={showFilters}
            onToggle={() => setShowFilters(false)}
            className="w-full"
          />
        </div>
      )}

      {/* エラー表示 */}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
          <p>{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => search()}
            className="mt-2"
          >
            再試行
          </Button>
        </div>
      )}

      {/* スキル一覧 */}
      <div className="p-4">
        {isSearching && skills.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 text-orange-500 animate-spin" />
            <span className="ml-2 text-gray-600">検索中...</span>
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              スキルが見つかりませんでした
            </h3>
            <p className="text-gray-600 mb-4">
              検索条件を変更するか、フィルターをクリアしてお試しください。
            </p>
            <Button onClick={clearFilters} variant="outline">
              フィルターをクリア
            </Button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? getGridClasses() : 'space-y-4'}>
            {sortedSkills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                showDistance={!!userLocation}
                distance={skill.distance}
                onFavoriteToggle={handleFavoriteToggle}
                onBookingClick={handleBookingClick}
                onContactClick={handleContactClick}
                onShareClick={handleShareClick}
                isFavorite={favorites.has(skill.id)}
                size={viewMode === 'list' ? 'medium' : gridSize}
                layout={viewMode === 'list' ? 'horizontal' : 'vertical'}
              />
            ))}
          </div>
        )}

        {/* ページネーション・追加読み込み */}
        {skills.length > 0 && (
          <div className="mt-8">
            {hasMore ? (
              <div className="text-center">
                <Button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="px-8"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      読み込み中...
                    </>
                  ) : (
                    `さらに表示 (${totalCount - skills.length}件)`
                  )}
                </Button>
              </div>
            ) : totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => goToPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  前へ
                </Button>
                
                <span className="text-sm text-gray-600">
                  {currentPage} / {totalPages} ページ
                </span>
                
                <Button
                  variant="outline"
                  onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  次へ
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}