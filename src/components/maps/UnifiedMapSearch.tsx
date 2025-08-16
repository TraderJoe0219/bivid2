'use client'

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { 
  Search, 
  Filter, 
  MapPin, 
  X, 
  ChevronDown,
  Layers,
  Menu,
  Target,
  SlidersHorizontal
} from 'lucide-react'
import { GoogleMap } from './GoogleMap'
import SkillMarkers from './SkillMarkers'
import SocialActivityMarkers from './SocialActivityMarkers'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useSkillSearch } from '@/hooks/useSkillSearch'
import { Skill, SkillCategory, SKILL_CATEGORIES } from '@/types/skill'
import { SocialActivity, SocialActivityCategory } from '@/types/activity'
import { SORT_OPTIONS, DISTANCE_OPTIONS } from '@/lib/validations/search'

interface UnifiedMapSearchProps {
  initialCenter?: google.maps.LatLngLiteral
  initialZoom?: number
  height?: string
  className?: string
  onSkillSelect?: (skill: Skill) => void
  onActivitySelect?: (activity: SocialActivity) => void
}

const DEFAULT_CENTER = {
  lat: 34.7816,
  lng: 135.4956
}

const SOCIAL_ACTIVITY_CATEGORIES = [
  { id: 'work', name: '🔨 仕事・軽作業', color: 'blue' },
  { id: 'volunteer', name: '❤️ ボランティア', color: 'red' },
  { id: 'hobby', name: '🎨 趣味・サークル', color: 'purple' },
  { id: 'event', name: '🎉 地域イベント', color: 'orange' },
  { id: 'seminar', name: '🎤 講演会・セミナー', color: 'yellow' },
  { id: 'meeting', name: '📣 集会', color: 'green' }
]

export default function UnifiedMapSearch({
  initialCenter = DEFAULT_CENTER,
  initialZoom = 13,
  height = '600px',
  className = '',
  onSkillSelect,
  onActivitySelect
}: UnifiedMapSearchProps) {
  // 地図とマーカーの状態
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null)
  const [currentCenter, setCurrentCenter] = useState(initialCenter)
  
  // 表示設定
  const [showSkills, setShowSkills] = useState(true)
  const [showActivities, setShowActivities] = useState(true)
  const [showClusters, setShowClusters] = useState(true)
  
  // フィルター状態
  const [selectedSkillCategories, setSelectedSkillCategories] = useState<SkillCategory[]>([])
  const [selectedActivityCategories, setSelectedActivityCategories] = useState<string[]>([])
  const [searchRadius, setSearchRadius] = useState(10)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [showLayerPanel, setShowLayerPanel] = useState(false)
  
  // 検索機能
  const {
    searchParams,
    updateSearchParam,
    skills,
    isSearching,
    searchNearby,
    searchByKeyword,
    activeFilterCount
  } = useSkillSearch({
    autoSearch: true,
    initialParams: {
      location: userLocation ? {
        lat: userLocation.lat,
        lng: userLocation.lng,
        radius: searchRadius
      } : undefined
    }
  })

  // モック社会活動データ（実際の実装ではAPIから取得）
  const [socialActivities] = useState<SocialActivity[]>([])

  // 現在位置取得
  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(location)
          setCurrentCenter(location)
          
          // 現在地周辺を検索
          searchNearby(location.lat, location.lng, searchRadius)
          
          // 地図を現在地に移動
          if (map) {
            map.panTo(location)
            map.setZoom(14)
          }
        },
        (error) => {
          console.error('位置情報の取得に失敗:', error)
          // フォールバック処理
          alert('位置情報の取得に失敗しました。手動で場所を選択してください。')
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5分間キャッシュ
        }
      )
    } else {
      alert('このブラウザは位置情報をサポートしていません。')
    }
  }, [map, searchNearby, searchRadius])

  // 地図クリック時の検索
  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat()
      const lng = event.latLng.lng()
      setCurrentCenter({ lat, lng })
      searchNearby(lat, lng, searchRadius)
    }
  }, [searchNearby, searchRadius])

  // キーワード検索
  const handleKeywordSearch = useCallback((keyword: string) => {
    searchByKeyword(keyword)
  }, [searchByKeyword])

  // カテゴリフィルター更新
  const toggleSkillCategory = useCallback((category: SkillCategory) => {
    setSelectedSkillCategories(prev => {
      const updated = prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
      
      updateSearchParam('categories', updated)
      return updated
    })
  }, [updateSearchParam])

  const toggleActivityCategory = useCallback((category: string) => {
    setSelectedActivityCategories(prev => {
      return prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    })
  }, [])

  // 検索範囲変更
  const handleRadiusChange = useCallback((radius: number) => {
    setSearchRadius(radius)
    if (userLocation || currentCenter) {
      const center = userLocation || currentCenter
      updateSearchParam('location', {
        lat: center.lat,
        lng: center.lng,
        radius
      })
    }
  }, [userLocation, currentCenter, updateSearchParam])

  // マーカークリック処理
  const handleSkillMarkerClick = useCallback((skill: Skill) => {
    onSkillSelect?.(skill)
  }, [onSkillSelect])

  const handleActivityMarkerClick = useCallback((activity: SocialActivity) => {
    onActivitySelect?.(activity)
  }, [onActivitySelect])

  // 地図読み込み完了
  const handleMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance)
    
    // クリックイベント追加
    mapInstance.addListener('click', handleMapClick)
    
    // 初期位置取得を試行
    getCurrentLocation()
  }, [handleMapClick, getCurrentLocation])

  // フィルタリングされたスキル
  const filteredSkills = useMemo(() => {
    return skills.filter(skill => {
      if (selectedSkillCategories.length > 0 && !selectedSkillCategories.includes(skill.category)) {
        return false
      }
      return true
    })
  }, [skills, selectedSkillCategories])

  // フィルタリングされた社会活動
  const filteredActivities = useMemo(() => {
    return socialActivities.filter(activity => {
      if (selectedActivityCategories.length > 0 && !selectedActivityCategories.includes(activity.category as string)) {
        return false
      }
      return true
    })
  }, [socialActivities, selectedActivityCategories])

  return (
    <div className={`relative bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* 検索ヘッダー */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          {/* キーワード検索 */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="スキルや活動を検索..."
              value={searchParams.keyword || ''}
              onChange={(e) => handleKeywordSearch(e.target.value)}
              className="pl-10 h-12 text-base"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full" />
              </div>
            )}
          </div>

          {/* コントロールボタン */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLayerPanel(!showLayerPanel)}
              className="h-12 px-3"
            >
              <Layers className="w-5 h-5" />
              <span className="hidden sm:inline ml-2">表示</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="h-12 px-3 lg:hidden"
            >
              <Filter className="w-5 h-5" />
              {activeFilterCount > 0 && (
                <span className="ml-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={getCurrentLocation}
              className="h-12 px-3"
              title="現在地を取得"
            >
              <Target className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* 統計情報 */}
        <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            {showSkills && (
              <span className="flex items-center">
                <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                スキル: {filteredSkills.length}件
              </span>
            )}
            {showActivities && (
              <span className="flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                社会活動: {filteredActivities.length}件
              </span>
            )}
          </div>
          
          {userLocation && (
            <span className="text-xs">
              📍 現在地から {searchRadius}km 以内
            </span>
          )}
        </div>
      </div>

      {/* レイヤーパネル */}
      {showLayerPanel && (
        <div className="absolute top-full left-4 right-4 z-20 bg-white border border-gray-200 rounded-lg shadow-lg mt-2 p-4">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">表示設定</h3>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={showSkills}
                  onChange={(e) => setShowSkills(e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
                <span className="text-sm">スキルマーカーを表示</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={showActivities}
                  onChange={(e) => setShowActivities(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm">社会活動マーカーを表示</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={showClusters}
                  onChange={(e) => setShowClusters(e.target.checked)}
                  className="w-4 h-4 text-gray-600 rounded focus:ring-gray-500"
                />
                <span className="text-sm">マーカーをグループ化</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                検索範囲
              </label>
              <select
                value={searchRadius}
                onChange={(e) => handleRadiusChange(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-orange-500 focus:border-orange-500"
              >
                {DISTANCE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* サイドバー（デスクトップ） */}
      <div className="flex">
        <div className="hidden lg:block w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto" style={{ height }}>
          <div className="p-4 space-y-6">
            {/* スキルカテゴリフィルター */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                スキルカテゴリ
              </h3>
              <div className="space-y-2">
                {SKILL_CATEGORIES.map(category => (
                  <button
                    key={category.value}
                    onClick={() => toggleSkillCategory(category.value)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                      selectedSkillCategories.includes(category.value)
                        ? 'border-orange-300 bg-orange-50 text-orange-900'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-lg">{category.icon}</span>
                    <span className="text-sm font-medium">{category.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 社会活動カテゴリフィルター */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                社会活動カテゴリ
              </h3>
              <div className="space-y-2">
                {SOCIAL_ACTIVITY_CATEGORIES.map(category => (
                  <button
                    key={category.id}
                    onClick={() => toggleActivityCategory(category.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                      selectedActivityCategories.includes(category.id)
                        ? 'border-blue-300 bg-blue-50 text-blue-900'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-lg">{category.name.split(' ')[0]}</span>
                    <span className="text-sm font-medium">{category.name.split(' ').slice(1).join(' ')}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 地図エリア */}
        <div className="flex-1 relative" style={{ height }}>
          <GoogleMap
            center={currentCenter}
            zoom={initialZoom}
            onMapLoad={handleMapLoad}
            onClick={handleMapClick}
            className="w-full h-full"
          >
            {/* スキルマーカー */}
            {showSkills && (
              <SkillMarkers
                map={map}
                skills={filteredSkills}
                selectedCategories={selectedSkillCategories}
                onMarkerClick={handleSkillMarkerClick}
                userLocation={userLocation || undefined}
                maxDistance={searchRadius}
                showClusters={showClusters}
              />
            )}

            {/* 社会活動マーカー */}
            {showActivities && (
              <SocialActivityMarkers
                map={map}
                selectedCategories={selectedActivityCategories}
                onMarkerClick={handleActivityMarkerClick}
                userLocation={userLocation || undefined}
                maxDistance={searchRadius}
              />
            )}
          </GoogleMap>

          {/* 現在地マーカー */}
          {userLocation && map && (
            <div
              style={{
                position: 'absolute',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                zIndex: 1000
              }}
            >
              <div className="w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-lg"></div>
            </div>
          )}
        </div>
      </div>

      {/* モバイルフィルタードロワー */}
      {showMobileFilters && (
        <div className="lg:hidden absolute inset-0 z-30">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-lg overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">フィルター</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* モバイル用フィルター内容 */}
              <div className="space-y-6">
                {/* スキルカテゴリ */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">スキルカテゴリ</h4>
                  <div className="space-y-2">
                    {SKILL_CATEGORIES.map(category => (
                      <button
                        key={category.value}
                        onClick={() => toggleSkillCategory(category.value)}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                          selectedSkillCategories.includes(category.value)
                            ? 'border-orange-300 bg-orange-50 text-orange-900'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-lg">{category.icon}</span>
                        <span className="text-sm font-medium">{category.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 社会活動カテゴリ */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">社会活動カテゴリ</h4>
                  <div className="space-y-2">
                    {SOCIAL_ACTIVITY_CATEGORIES.map(category => (
                      <button
                        key={category.id}
                        onClick={() => toggleActivityCategory(category.id)}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                          selectedActivityCategories.includes(category.id)
                            ? 'border-blue-300 bg-blue-50 text-blue-900'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-lg">{category.name.split(' ')[0]}</span>
                        <span className="text-sm font-medium">{category.name.split(' ').slice(1).join(' ')}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}