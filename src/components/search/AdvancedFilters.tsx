'use client'

import React, { useState, useCallback } from 'react'
import { 
  Filter, 
  X, 
  Calendar, 
  Clock, 
  DollarSign, 
  Star, 
  MapPin, 
  Users,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { SkillSearchParams } from '@/types/skill'
import { 
  DISTANCE_OPTIONS, 
  PRICE_RANGE_PRESETS, 
  AVAILABILITY_OPTIONS,
  DIFFICULTY_OPTIONS,
  LOCATION_TYPE_OPTIONS
} from '@/lib/validations/search'

interface AdvancedFiltersProps {
  filters: SkillSearchParams
  onFiltersChange: (filters: Partial<SkillSearchParams>) => void
  onClearFilters: () => void
  isOpen: boolean
  onToggle: () => void
  className?: string
}

interface FilterSection {
  id: string
  title: string
  icon: React.ReactNode
  isExpanded: boolean
}

export default function AdvancedFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  isOpen,
  onToggle,
  className = ''
}: AdvancedFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    location: true,
    price: true,
    difficulty: false,
    schedule: false,
    preferences: false
  })

  // セクションの展開/折りたたみ
  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }, [])

  // 価格範囲の更新
  const updatePriceRange = useCallback((min?: number, max?: number) => {
    onFiltersChange({
      priceRange: min !== undefined || max !== undefined ? { min: min || 0, max: max || Number.MAX_SAFE_INTEGER } : undefined
    })
  }, [onFiltersChange])

  // プリセット価格範囲の適用
  const applyPricePreset = useCallback((preset: typeof PRICE_RANGE_PRESETS[0]) => {
    updatePriceRange(preset.min, preset.max === Number.MAX_SAFE_INTEGER ? undefined : preset.max)
  }, [updatePriceRange])

  // 日付範囲の更新
  const updateDateRange = useCallback((start?: Date, end?: Date) => {
    onFiltersChange({
      dateRange: start && end ? { start, end } : undefined
    })
  }, [onFiltersChange])

  // 難易度フィルターの切り替え
  const toggleDifficulty = useCallback((difficulty: 'beginner' | 'intermediate' | 'advanced') => {
    const currentDifficulties = filters.difficulty || []
    const updated = currentDifficulties.includes(difficulty)
      ? currentDifficulties.filter(d => d !== difficulty)
      : [...currentDifficulties, difficulty]
    
    onFiltersChange({
      difficulty: updated.length > 0 ? updated : undefined
    })
  }, [filters.difficulty, onFiltersChange])

  // 場所タイプフィルターの切り替え
  const toggleLocationType = useCallback((type: 'offline' | 'online' | 'hybrid') => {
    const currentTypes = filters.locationType || []
    const updated = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type]
    
    onFiltersChange({
      locationType: updated.length > 0 ? updated : undefined
    })
  }, [filters.locationType, onFiltersChange])

  // アクティブなフィルター数を計算
  const activeFilterCount = React.useMemo(() => {
    let count = 0
    if (filters.location) count++
    if (filters.priceRange) count++
    if (filters.dateRange) count++
    if (filters.difficulty?.length) count++
    if (filters.locationType?.length) count++
    if (filters.rating && filters.rating > 0) count++
    if (filters.availability !== 'any') count++
    return count
  }, [filters])

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        onClick={onToggle}
        className={`flex items-center space-x-2 ${className}`}
      >
        <Filter className="w-4 h-4" />
        <span>詳細フィルター</span>
        {activeFilterCount > 0 && (
          <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </Button>
    )
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-lg ${className}`}>
      {/* ヘッダー */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">詳細フィルター</h3>
          {activeFilterCount > 0 && (
            <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
              {activeFilterCount}件適用中
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-gray-600 hover:text-gray-800"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            リセット
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-gray-600 hover:text-gray-800"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
        {/* 場所・距離フィルター */}
        <div className="border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleSection('location')}
            className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50"
          >
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-900">場所・距離</span>
            </div>
            {expandedSections.location ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>
          
          {expandedSections.location && (
            <div className="p-3 border-t border-gray-200 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  検索範囲
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {DISTANCE_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => onFiltersChange({
                        location: filters.location ? {
                          ...filters.location,
                          radius: option.value
                        } : undefined
                      })}
                      className={`p-2 text-sm border rounded-md transition-colors ${
                        filters.location?.radius === option.value
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  場所のタイプ
                </label>
                <div className="space-y-2">
                  {LOCATION_TYPE_OPTIONS.map(option => (
                    <label key={option.value} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.locationType?.includes(option.value as any) || false}
                        onChange={() => toggleLocationType(option.value as any)}
                        className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 価格フィルター */}
        <div className="border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleSection('price')}
            className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50"
          >
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-900">料金</span>
            </div>
            {expandedSections.price ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>
          
          {expandedSections.price && (
            <div className="p-3 border-t border-gray-200 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  価格帯
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PRICE_RANGE_PRESETS.map(preset => (
                    <button
                      key={preset.value}
                      onClick={() => applyPricePreset(preset)}
                      className={`p-2 text-sm border rounded-md transition-colors ${
                        filters.priceRange?.min === preset.min && 
                        (filters.priceRange?.max === preset.max || (preset.max === Number.MAX_SAFE_INTEGER && !filters.priceRange?.max))
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">最低価格</label>
                  <Input
                    type="number"
                    min="0"
                    value={filters.priceRange?.min || ''}
                    onChange={(e) => updatePriceRange(
                      e.target.value ? parseInt(e.target.value) : undefined,
                      filters.priceRange?.max
                    )}
                    placeholder="0"
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">最高価格</label>
                  <Input
                    type="number"
                    min="0"
                    value={filters.priceRange?.max || ''}
                    onChange={(e) => updatePriceRange(
                      filters.priceRange?.min,
                      e.target.value ? parseInt(e.target.value) : undefined
                    )}
                    placeholder="上限なし"
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 難易度フィルター */}
        <div className="border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleSection('difficulty')}
            className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50"
          >
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-900">難易度</span>
            </div>
            {expandedSections.difficulty ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>
          
          {expandedSections.difficulty && (
            <div className="p-3 border-t border-gray-200 space-y-2">
              {DIFFICULTY_OPTIONS.map(option => (
                <label key={option.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.difficulty?.includes(option.value as any) || false}
                    onChange={() => toggleDifficulty(option.value as any)}
                    className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* スケジュール・可用性フィルター */}
        <div className="border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleSection('schedule')}
            className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50"
          >
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-900">スケジュール</span>
            </div>
            {expandedSections.schedule ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>
          
          {expandedSections.schedule && (
            <div className="p-3 border-t border-gray-200 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  可用性
                </label>
                <select
                  value={filters.availability || 'any'}
                  onChange={(e) => onFiltersChange({
                    availability: e.target.value as any
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-orange-500 focus:border-orange-500"
                >
                  {AVAILABILITY_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  期間を指定
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">開始日</label>
                    <Input
                      type="date"
                      value={filters.dateRange?.start ? filters.dateRange.start.toISOString().split('T')[0] : ''}
                      onChange={(e) => updateDateRange(
                        e.target.value ? new Date(e.target.value) : undefined,
                        filters.dateRange?.end
                      )}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">終了日</label>
                    <Input
                      type="date"
                      value={filters.dateRange?.end ? filters.dateRange.end.toISOString().split('T')[0] : ''}
                      onChange={(e) => updateDateRange(
                        filters.dateRange?.start,
                        e.target.value ? new Date(e.target.value) : undefined
                      )}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* その他の設定 */}
        <div className="border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleSection('preferences')}
            className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50"
          >
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-900">その他</span>
            </div>
            {expandedSections.preferences ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>
          
          {expandedSections.preferences && (
            <div className="p-3 border-t border-gray-200 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  最低評価
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={filters.rating || 0}
                    onChange={(e) => onFiltersChange({
                      rating: parseFloat(e.target.value)
                    })}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium text-gray-700 w-12">
                    {filters.rating || 0}★
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* フッター */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {activeFilterCount > 0 ? `${activeFilterCount}件のフィルターが適用されています` : 'フィルターが設定されていません'}
          </span>
          <Button
            onClick={onToggle}
            className="px-6"
          >
            フィルターを適用
          </Button>
        </div>
      </div>
    </div>
  )
}