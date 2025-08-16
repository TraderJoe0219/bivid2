'use client'

import { useState, useEffect, useCallback } from 'react'
import { Skill } from '@/types/skill'
import { 
  getUserFavorites, 
  getFavoriteSkills, 
  addFavoriteSkill, 
  removeFavoriteSkill 
} from '@/lib/favoritesApi'
import { useAuthStore } from '@/store/authStore'

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
    return await getFavoriteSkills(skillIds)
  } catch (error) {
    console.error('Failed to fetch favorite skills:', error)
    throw error
  }
}

// APIでお気に入りを追加
const addFavoriteToAPI = async (skillId: string): Promise<void> => {
  try {
    await addFavoriteSkill(skillId)
  } catch (error) {
    console.error('Failed to add favorite to API:', error)
    throw error
  }
}

// APIからお気に入りを削除
const removeFavoriteFromAPI = async (skillId: string): Promise<void> => {
  try {
    await removeFavoriteSkill(skillId)
  } catch (error) {
    console.error('Failed to remove favorite from API:', error)
    throw error
  }
}

export function useFavorites(): UseFavoritesReturn {
  const { user } = useAuthStore()
  const [state, setState] = useState<FavoritesState>({
    favoriteIds: new Set(),
    favorites: [],
    isLoading: true,
    error: null
  })

  // 初期化: ユーザーがログインしている場合はサーバーから、そうでなければローカルストレージから読み込み
  useEffect(() => {
    const initializeFavorites = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }))
        
        let favoriteIds: string[] = []
        
        if (user) {
          // ログイン済みの場合はサーバーから取得
          try {
            favoriteIds = await getUserFavorites()
            // サーバーのデータをローカルストレージに同期
            saveFavoriteIdsToStorage(favoriteIds)
          } catch (error) {
            // サーバーエラーの場合はローカルストレージから読み込み
            console.warn('Failed to fetch favorites from server, using local storage:', error)
            favoriteIds = loadFavoriteIdsFromStorage()
          }
        } else {
          // 未ログインの場合はローカルストレージから読み込み
          favoriteIds = loadFavoriteIdsFromStorage()
        }
        
        const favoriteIdsSet = new Set(favoriteIds)
        
        // お気に入りスキルの詳細データを取得
        let favoriteSkills: Skill[] = []
        if (favoriteIds.length > 0) {
          try {
            favoriteSkills = await fetchFavoriteSkills(favoriteIds)
          } catch (error) {
            console.warn('Failed to fetch favorite skills details:', error)
          }
        }
        
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
  }, [user])

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

      // ログイン済みの場合はAPIに同期
      if (user) {
        await addFavoriteToAPI(skill.id)
      }
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

      // ログイン済みの場合はAPIに同期
      if (user) {
        await removeFavoriteFromAPI(skillId)
      }
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

  // ログイン状態が変わった時にお気に入りを同期
  useEffect(() => {
    if (user && state.favoriteIds.size > 0) {
      // ローカルのお気に入りをサーバーに同期
      const syncFavoritesToServer = async () => {
        try {
          const localIds = Array.from(state.favoriteIds)
          const serverIds = await getUserFavorites()
          
          // ローカルにあってサーバーにないものを追加
          for (const skillId of localIds) {
            if (!serverIds.includes(skillId)) {
              await addFavoriteToAPI(skillId)
            }
          }
        } catch (error) {
          console.warn('Failed to sync favorites to server:', error)
        }
      }
      
      syncFavoritesToServer()
    }
  }, [user, state.favoriteIds])

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