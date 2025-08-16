'use client'

import { useState, useEffect, useCallback } from 'react'
import { Skill } from '@/types/skill'

interface FavoritesState {
  favoriteIds: Set<string>
  favorites: Skill[]
  isLoading: boolean
  error: string | null
}

interface UseFavoritesReturn {
  favoriteIds: Set<string>
  favorites: Skill[]
  isLoading: boolean
  error: string | null
  isFavorite: (skillId: string) => boolean
  addFavorite: (skill: Skill) => Promise<void>
  removeFavorite: (skillId: string) => Promise<void>
  toggleFavorite: (skill: Skill) => Promise<boolean>
  clearFavorites: () => Promise<void>
  refreshFavorites: () => Promise<void>
}

const STORAGE_KEY = 'bivid_favorites'
const FAVORITES_API_ENDPOINT = '/api/favorites' // TODO: 実際のAPIエンドポイント

// ローカルストレージからお気に入りIDを読み込み
const loadFavoriteIdsFromStorage = (): string[] => {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Failed to load favorites from storage:', error)
    return []
  }
}

// ローカルストレージにお気に入りIDを保存
const saveFavoriteIdsToStorage = (favoriteIds: string[]): void => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds))
  } catch (error) {
    console.error('Failed to save favorites to storage:', error)
  }
}

// APIからお気に入りスキルの詳細データを取得
const fetchFavoriteSkills = async (skillIds: string[]): Promise<Skill[]> => {
  if (skillIds.length === 0) return []
  
  try {
    // TODO: 実際のAPI呼び出しに置き換え
    // const response = await fetch(`${FAVORITES_API_ENDPOINT}/skills`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ skillIds })
    // })
    // 
    // if (!response.ok) {
    //   throw new Error('Failed to fetch favorite skills')
    // }
    // 
    // return await response.json()
    
    // モック実装 - 実際の実装では上記のAPI呼び出しを使用
    console.log('Mock: Fetching favorite skills for IDs:', skillIds)
    return []
  } catch (error) {
    console.error('Failed to fetch favorite skills:', error)
    throw error
  }
}

// APIでお気に入りを追加
const addFavoriteToAPI = async (skillId: string): Promise<void> => {
  try {
    // TODO: 実際のAPI呼び出しに置き換え
    // const response = await fetch(`${FAVORITES_API_ENDPOINT}/${skillId}`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' }
    // })
    // 
    // if (!response.ok) {
    //   throw new Error('Failed to add favorite')
    // }
    
    // モック実装
    console.log('Mock: Adding favorite to API:', skillId)
  } catch (error) {
    console.error('Failed to add favorite to API:', error)
    throw error
  }
}

// APIからお気に入りを削除
const removeFavoriteFromAPI = async (skillId: string): Promise<void> => {
  try {
    // TODO: 実際のAPI呼び出しに置き換え
    // const response = await fetch(`${FAVORITES_API_ENDPOINT}/${skillId}`, {
    //   method: 'DELETE'
    // })
    // 
    // if (!response.ok) {
    //   throw new Error('Failed to remove favorite')
    // }
    
    // モック実装
    console.log('Mock: Removing favorite from API:', skillId)
  } catch (error) {
    console.error('Failed to remove favorite from API:', error)
    throw error
  }
}

export function useFavorites(): UseFavoritesReturn {
  const [state, setState] = useState<FavoritesState>({
    favoriteIds: new Set(),
    favorites: [],
    isLoading: true,
    error: null
  })

  // 初期化: ローカルストレージからお気に入りIDを読み込み
  useEffect(() => {
    const initializeFavorites = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }))
        
        const storedIds = loadFavoriteIdsFromStorage()
        const favoriteIdsSet = new Set(storedIds)
        
        // お気に入りスキルの詳細データを取得
        const favoriteSkills = await fetchFavoriteSkills(storedIds)
        
        setState({
          favoriteIds: favoriteIdsSet,
          favorites: favoriteSkills,
          isLoading: false,
          error: null
        })
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'お気に入りの読み込みに失敗しました'
        }))
      }
    }

    initializeFavorites()
  }, [])

  // お気に入り状態を確認
  const isFavorite = useCallback((skillId: string): boolean => {
    return state.favoriteIds.has(skillId)
  }, [state.favoriteIds])

  // お気に入りに追加
  const addFavorite = useCallback(async (skill: Skill): Promise<void> => {
    if (state.favoriteIds.has(skill.id)) {
      return // 既にお気に入りに追加済み
    }

    try {
      // 楽観的更新: UIを先に更新
      const newFavoriteIds = new Set(state.favoriteIds).add(skill.id)
      const newFavorites = [...state.favorites, skill]
      
      setState(prev => ({
        ...prev,
        favoriteIds: newFavoriteIds,
        favorites: newFavorites,
        error: null
      }))

      // ローカルストレージに保存
      saveFavoriteIdsToStorage(Array.from(newFavoriteIds))

      // APIに同期
      await addFavoriteToAPI(skill.id)
    } catch (error) {
      // エラー時は状態を戻す
      setState(prev => ({
        ...prev,
        favoriteIds: new Set(Array.from(prev.favoriteIds).filter(id => id !== skill.id)),
        favorites: prev.favorites.filter(fav => fav.id !== skill.id),
        error: error instanceof Error ? error.message : 'お気に入りの追加に失敗しました'
      }))
      
      throw error
    }
  }, [state.favoriteIds, state.favorites])

  // お気に入りから削除
  const removeFavorite = useCallback(async (skillId: string): Promise<void> => {
    if (!state.favoriteIds.has(skillId)) {
      return // お気に入りに登録されていない
    }

    const removedSkill = state.favorites.find(skill => skill.id === skillId)

    try {
      // 楽観的更新: UIを先に更新
      const newFavoriteIds = new Set(state.favoriteIds)
      newFavoriteIds.delete(skillId)
      const newFavorites = state.favorites.filter(skill => skill.id !== skillId)
      
      setState(prev => ({
        ...prev,
        favoriteIds: newFavoriteIds,
        favorites: newFavorites,
        error: null
      }))

      // ローカルストレージに保存
      saveFavoriteIdsToStorage(Array.from(newFavoriteIds))

      // APIに同期
      await removeFavoriteFromAPI(skillId)
    } catch (error) {
      // エラー時は状態を戻す
      setState(prev => ({
        ...prev,
        favoriteIds: new Set(prev.favoriteIds).add(skillId),
        favorites: removedSkill ? [...prev.favorites, removedSkill] : prev.favorites,
        error: error instanceof Error ? error.message : 'お気に入りの削除に失敗しました'
      }))
      
      throw error
    }
  }, [state.favoriteIds, state.favorites])

  // お気に入りの切り替え
  const toggleFavorite = useCallback(async (skill: Skill): Promise<boolean> => {
    const willBeFavorite = !state.favoriteIds.has(skill.id)
    
    if (willBeFavorite) {
      await addFavorite(skill)
    } else {
      await removeFavorite(skill.id)
    }
    
    return willBeFavorite
  }, [state.favoriteIds, addFavorite, removeFavorite])

  // お気に入りをすべてクリア
  const clearFavorites = useCallback(async (): Promise<void> => {
    const currentFavorites = [...state.favorites]
    const currentFavoriteIds = new Set(state.favoriteIds)

    try {
      // 楽観的更新
      setState(prev => ({
        ...prev,
        favoriteIds: new Set(),
        favorites: [],
        error: null
      }))

      // ローカルストレージをクリア
      saveFavoriteIdsToStorage([])

      // API上のお気に入りもクリア
      // TODO: 実際のAPI呼び出しに置き換え
      console.log('Mock: Clearing all favorites')
    } catch (error) {
      // エラー時は状態を戻す
      setState(prev => ({
        ...prev,
        favoriteIds: currentFavoriteIds,
        favorites: currentFavorites,
        error: error instanceof Error ? error.message : 'お気に入りのクリアに失敗しました'
      }))
      
      throw error
    }
  }, [state.favorites, state.favoriteIds])

  // お気に入りを再読み込み
  const refreshFavorites = useCallback(async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const storedIds = loadFavoriteIdsFromStorage()
      const favoriteIdsSet = new Set(storedIds)
      const favoriteSkills = await fetchFavoriteSkills(storedIds)
      
      setState({
        favoriteIds: favoriteIdsSet,
        favorites: favoriteSkills,
        isLoading: false,
        error: null
      })
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'お気に入りの再読み込みに失敗しました'
      }))
    }
  }, [])

  return {
    favoriteIds: state.favoriteIds,
    favorites: state.favorites,
    isLoading: state.isLoading,
    error: state.error,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites,
    refreshFavorites
  }
}