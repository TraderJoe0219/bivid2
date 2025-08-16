'use client'

import React, { useState } from 'react'
import { 
  Heart, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Trash2, 
  Download,
  Share2,
  BookmarkX,
  Loader
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import SkillCard from '@/components/skills/SkillCard'
import { useFavorites } from '@/hooks/useFavorites'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import { Skill, SkillCategory, SKILL_CATEGORIES } from '@/types/skill'

type ViewMode = 'grid' | 'list'
type GridSize = 'small' | 'medium' | 'large'
type SortBy = 'added_date' | 'title' | 'rating' | 'price' | 'category'

export default function FavoritesPage() {
  // お気に入り管理
  const {
    favoriteIds,
    favorites,
    isLoading,
    error,
    isFavorite,
    removeFavorite,
    clearFavorites,
    refreshFavorites
  } = useFavorites()

  // 検索履歴
  const { addSearchToHistory } = useSearchHistory()

  // 表示設定
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [gridSize, setGridSize] = useState<GridSize>('medium')
  const [sortBy, setSortBy] = useState<SortBy>('added_date')
  
  // フィルター設定
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<SkillCategory[]>([])
  const [showFilters, setShowFilters] = useState(false)

  // お気に入り削除確認
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  // フィルタリング
  const filteredFavorites = React.useMemo(() => {
    let filtered = [...favorites]

    // キーワード検索
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(skill => 
        skill.title.toLowerCase().includes(query) ||
        skill.description.toLowerCase().includes(query) ||
        skill.teacher.name.toLowerCase().includes(query)
      )
    }

    // カテゴリフィルター
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(skill => 
        selectedCategories.includes(skill.category)
      )
    }

    return filtered
  }, [favorites, searchQuery, selectedCategories])

  // ソート
  const sortedFavorites = React.useMemo(() => {
    const sorted = [...filteredFavorites]

    switch (sortBy) {
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title))
      case 'rating':
        return sorted.sort((a, b) => b.rating.average - a.rating.average)
      case 'price':
        return sorted.sort((a, b) => a.pricing.amount - b.pricing.amount)
      case 'category':
        return sorted.sort((a, b) => a.category.localeCompare(b.category))
      case 'added_date':
      default:
        return sorted // お気に入り追加順（現在の順序を維持）
    }
  }, [filteredFavorites, sortBy])

  // カテゴリフィルター切り替え
  const toggleCategory = (category: SkillCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  // 検索実行
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      addSearchToHistory(query, { categories: selectedCategories }, filteredFavorites.length)
    }
  }

  // お気に入り削除
  const handleRemoveFavorite = async (skillId: string) => {
    try {
      await removeFavorite(skillId)
    } catch (error) {
      console.error('Failed to remove favorite:', error)
    }
  }

  // すべてクリア
  const handleClearAll = async () => {
    try {
      await clearFavorites()
      setShowClearConfirm(false)
    } catch (error) {
      console.error('Failed to clear favorites:', error)
    }
  }

  // エクスポート機能
  const handleExport = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      totalCount: favorites.length,
      favorites: favorites.map(skill => ({
        id: skill.id,
        title: skill.title,
        teacher: skill.teacher.name,
        category: skill.category,
        rating: skill.rating.average,
        price: skill.pricing.amount,
        url: `${window.location.origin}/skills/${skill.id}`
      }))
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bivid_favorites_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // 共有機能
  const handleShare = async () => {
    const shareText = `私のお気に入りスキル (${favorites.length}件)\n\n${favorites.slice(0, 3).map(skill => `• ${skill.title} by ${skill.teacher.name}`).join('\n')}\n\n他にも素敵なスキルがあります！`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'お気に入りスキル',
          text: shareText,
          url: window.location.href
        })
      } catch (error) {
        console.error('Share failed:', error)
      }
    } else {
      await navigator.clipboard.writeText(shareText)
      alert('お気に入りリストをクリップボードにコピーしました')
    }
  }

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
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Heart className="w-6 h-6 text-red-500 mr-2 fill-current" />
                お気に入り
              </h1>
              <p className="text-gray-600 mt-1">
                {isLoading ? '読み込み中...' : `${favorites.length}件のスキルを保存中`}
              </p>
            </div>

            {!isLoading && favorites.length > 0 && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  className="flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>エクスポート</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="flex items-center space-x-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>共有</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowClearConfirm(true)}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>すべてクリア</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 text-orange-500 animate-spin mr-2" />
            <span className="text-gray-600">お気に入りを読み込み中...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <BookmarkX className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              お気に入りの読み込みに失敗しました
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={refreshFavorites}>
              再試行
            </Button>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Heart className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              お気に入りがありません
            </h3>
            <p className="text-gray-600 mb-4">
              気になるスキルを見つけたら、ハートマークをクリックしてお気に入りに追加しましょう。
            </p>
            <Button>
              スキルを探す
            </Button>
          </div>
        ) : (
          <>
            {/* 検索・フィルター */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="p-4">
                {/* 検索バー */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="お気に入りの中から検索..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
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
                    {selectedCategories.length > 0 && (
                      <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {selectedCategories.length}
                      </span>
                    )}
                  </Button>
                </div>

                {/* 表示オプション */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      {filteredFavorites.length}件表示
                    </span>
                    
                    {(searchQuery || selectedCategories.length > 0) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSearchQuery('')
                          setSelectedCategories([])
                        }}
                        className="text-sm text-orange-600 hover:text-orange-800"
                      >
                        フィルターをクリア
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* ソート */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortBy)}
                      className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="added_date">追加日順</option>
                      <option value="title">タイトル順</option>
                      <option value="rating">評価順</option>
                      <option value="price">価格順</option>
                      <option value="category">カテゴリ順</option>
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

                    {/* グリッドサイズ */}
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

              {/* カテゴリフィルター */}
              {showFilters && (
                <div className="border-t border-gray-200 p-4">
                  <h4 className="font-medium text-gray-900 mb-3">カテゴリ</h4>
                  <div className="flex flex-wrap gap-2">
                    {SKILL_CATEGORIES.map(category => (
                      <button
                        key={category.value}
                        onClick={() => toggleCategory(category.value)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
                          selectedCategories.includes(category.value)
                            ? 'border-orange-300 bg-orange-50 text-orange-900'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <span>{category.icon}</span>
                        <span>{category.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* スキル一覧 */}
            <div className={viewMode === 'grid' ? getGridClasses() : 'space-y-4'}>
              {sortedFavorites.map((skill) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  onFavoriteToggle={(skillId, isFavorite) => {
                    if (!isFavorite) {
                      handleRemoveFavorite(skillId)
                    }
                  }}
                  isFavorite={true}
                  size={viewMode === 'list' ? 'medium' : gridSize}
                  layout={viewMode === 'list' ? 'horizontal' : 'vertical'}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* クリア確認モーダル */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              すべてのお気に入りをクリア
            </h3>
            <p className="text-gray-600 mb-4">
              本当にすべてのお気に入り（{favorites.length}件）を削除しますか？この操作は取り消せません。
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowClearConfirm(false)}
              >
                キャンセル
              </Button>
              <Button
                onClick={handleClearAll}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                すべて削除
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}