'use client'

import { useState, useEffect, useCallback } from 'react'
import { SkillSearchParams } from '@/types/skill'

interface SearchHistoryItem {
  id: string
  query: string
  filters: SkillSearchParams
  timestamp: number
  resultCount?: number
}

interface SearchPreferences {
  recentSearches: SearchHistoryItem[]
  savedFilters: Array<{
    id: string
    name: string
    filters: SkillSearchParams
    timestamp: number
  }>
  defaultSortBy?: string
  defaultLimit?: number
  autoSaveHistory: boolean
}

interface UseSearchHistoryReturn {
  recentSearches: SearchHistoryItem[]
  savedFilters: SearchPreferences['savedFilters']
  preferences: SearchPreferences
  addSearchToHistory: (query: string, filters: SkillSearchParams, resultCount?: number) => void
  removeSearchFromHistory: (searchId: string) => void
  clearSearchHistory: () => void
  saveFilterPreset: (name: string, filters: SkillSearchParams) => void
  removeSavedFilter: (filterId: string) => void
  updatePreferences: (preferences: Partial<SearchPreferences>) => void
  getRecentQueries: (limit?: number) => string[]
  getPopularFilters: () => SkillSearchParams[]
}

const SEARCH_HISTORY_KEY = 'bivid_search_history'
const SEARCH_PREFERENCES_KEY = 'bivid_search_preferences'
const MAX_HISTORY_ITEMS = 50
const MAX_SAVED_FILTERS = 10

// デフォルト設定
const DEFAULT_PREFERENCES: SearchPreferences = {
  recentSearches: [],
  savedFilters: [],
  defaultSortBy: 'relevance',
  defaultLimit: 12,
  autoSaveHistory: true
}

// ローカルストレージから検索履歴を読み込み
const loadSearchHistoryFromStorage = (): SearchHistoryItem[] => {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Failed to load search history from storage:', error)
    return []
  }
}

// ローカルストレージに検索履歴を保存
const saveSearchHistoryToStorage = (history: SearchHistoryItem[]): void => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history))
  } catch (error) {
    console.error('Failed to save search history to storage:', error)
  }
}

// ローカルストレージから検索設定を読み込み
const loadPreferencesFromStorage = (): SearchPreferences => {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES
  
  try {
    const stored = localStorage.getItem(SEARCH_PREFERENCES_KEY)
    return stored ? { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) } : DEFAULT_PREFERENCES
  } catch (error) {
    console.error('Failed to load search preferences from storage:', error)
    return DEFAULT_PREFERENCES
  }
}

// ローカルストレージに検索設定を保存
const savePreferencesToStorage = (preferences: SearchPreferences): void => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(SEARCH_PREFERENCES_KEY, JSON.stringify(preferences))
  } catch (error) {
    console.error('Failed to save search preferences to storage:', error)
  }
}

// 検索パラメータのハッシュを生成（重複判定用）
const generateSearchHash = (query: string, filters: SkillSearchParams): string => {
  const searchKey = {
    query: query.trim().toLowerCase(),
    categories: filters.categories?.sort(),
    location: filters.location,
    priceRange: filters.priceRange,
    difficulty: filters.difficulty?.sort(),
    locationType: filters.locationType?.sort(),
    rating: filters.rating,
    sortBy: filters.sortBy
  }
  
  return btoa(JSON.stringify(searchKey))
}

export function useSearchHistory(): UseSearchHistoryReturn {
  const [preferences, setPreferences] = useState<SearchPreferences>(DEFAULT_PREFERENCES)

  // 初期化: ローカルストレージから履歴と設定を読み込み
  useEffect(() => {
    const storedHistory = loadSearchHistoryFromStorage()
    const storedPreferences = loadPreferencesFromStorage()
    
    setPreferences({
      ...storedPreferences,
      recentSearches: storedHistory
    })
  }, [])

  // 検索履歴に追加
  const addSearchToHistory = useCallback((query: string, filters: SkillSearchParams, resultCount?: number) => {
    if (!preferences.autoSaveHistory || !query.trim()) {
      return
    }

    const searchId = generateSearchHash(query, filters)
    const now = Date.now()
    
    const newSearchItem: SearchHistoryItem = {
      id: searchId,
      query: query.trim(),
      filters,
      timestamp: now,
      resultCount
    }

    setPreferences(prev => {
      // 重複を除去し、新しいアイテムを先頭に追加
      const filteredHistory = prev.recentSearches.filter(item => item.id !== searchId)
      const newHistory = [newSearchItem, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS)
      
      const updatedPreferences = {
        ...prev,
        recentSearches: newHistory
      }
      
      // ローカルストレージに保存
      saveSearchHistoryToStorage(newHistory)
      savePreferencesToStorage(updatedPreferences)
      
      return updatedPreferences
    })
  }, [preferences.autoSaveHistory])

  // 検索履歴から削除
  const removeSearchFromHistory = useCallback((searchId: string) => {
    setPreferences(prev => {
      const newHistory = prev.recentSearches.filter(item => item.id !== searchId)
      const updatedPreferences = {
        ...prev,
        recentSearches: newHistory
      }
      
      saveSearchHistoryToStorage(newHistory)
      savePreferencesToStorage(updatedPreferences)
      
      return updatedPreferences
    })
  }, [])

  // 検索履歴をクリア
  const clearSearchHistory = useCallback(() => {
    setPreferences(prev => {
      const updatedPreferences = {
        ...prev,
        recentSearches: []
      }
      
      saveSearchHistoryToStorage([])
      savePreferencesToStorage(updatedPreferences)
      
      return updatedPreferences
    })
  }, [])

  // フィルタープリセットを保存
  const saveFilterPreset = useCallback((name: string, filters: SkillSearchParams) => {
    const presetId = `preset_${Date.now()}`
    
    const newPreset = {
      id: presetId,
      name: name.trim(),
      filters,
      timestamp: Date.now()
    }

    setPreferences(prev => {
      // 重複する名前のプリセットを除去
      const filteredPresets = prev.savedFilters.filter(preset => preset.name !== name.trim())
      const newSavedFilters = [newPreset, ...filteredPresets].slice(0, MAX_SAVED_FILTERS)
      
      const updatedPreferences = {
        ...prev,
        savedFilters: newSavedFilters
      }
      
      savePreferencesToStorage(updatedPreferences)
      
      return updatedPreferences
    })
  }, [])

  // 保存されたフィルターを削除
  const removeSavedFilter = useCallback((filterId: string) => {
    setPreferences(prev => {
      const newSavedFilters = prev.savedFilters.filter(preset => preset.id !== filterId)
      const updatedPreferences = {
        ...prev,
        savedFilters: newSavedFilters
      }
      
      savePreferencesToStorage(updatedPreferences)
      
      return updatedPreferences
    })
  }, [])

  // 設定を更新
  const updatePreferences = useCallback((newPreferences: Partial<SearchPreferences>) => {
    setPreferences(prev => {
      const updatedPreferences = {
        ...prev,
        ...newPreferences
      }
      
      savePreferencesToStorage(updatedPreferences)
      
      return updatedPreferences
    })
  }, [])

  // 最近のクエリを取得
  const getRecentQueries = useCallback((limit: number = 10): string[] => {
    return preferences.recentSearches
      .slice(0, limit)
      .map(item => item.query)
      .filter((query, index, array) => array.indexOf(query) === index) // 重複除去
  }, [preferences.recentSearches])

  // よく使われるフィルターを取得
  const getPopularFilters = useCallback((): SkillSearchParams[] => {
    // 最近の検索履歴からフィルターの使用頻度を分析
    const filterUsageMap = new Map<string, { filters: SkillSearchParams; count: number }>()
    
    preferences.recentSearches.forEach(search => {
      const filterKey = JSON.stringify({
        categories: search.filters.categories?.sort(),
        difficulty: search.filters.difficulty?.sort(),
        locationType: search.filters.locationType?.sort(),
        priceRange: search.filters.priceRange,
        rating: search.filters.rating
      })
      
      if (filterUsageMap.has(filterKey)) {
        filterUsageMap.get(filterKey)!.count++
      } else {
        filterUsageMap.set(filterKey, {
          filters: search.filters,
          count: 1
        })
      }
    })
    
    // 使用頻度順にソートして上位3つを返す
    return Array.from(filterUsageMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map(item => item.filters)
  }, [preferences.recentSearches])

  return {
    recentSearches: preferences.recentSearches,
    savedFilters: preferences.savedFilters,
    preferences,
    addSearchToHistory,
    removeSearchFromHistory,
    clearSearchHistory,
    saveFilterPreset,
    removeSavedFilter,
    updatePreferences,
    getRecentQueries,
    getPopularFilters
  }
}