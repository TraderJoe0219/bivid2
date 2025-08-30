import { create } from 'zustand'
import { User as FirebaseUser, signOut as firebaseSignOut } from 'firebase/auth'
import { User } from '@/types'
import { auth } from '@/lib/firebase'

interface AuthState {
  user: FirebaseUser | null
  userProfile: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  setUser: (user: FirebaseUser | null) => void
  setUserProfile: (profile: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  signOut: () => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userProfile: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
  
  setUser: (user) => set((state) => ({
    ...state,
    user,
    isAuthenticated: !!user,
    error: null, // 成功時はエラーをクリア
  })),
  
  setUserProfile: (profile) => set((state) => ({
    ...state,
    userProfile: profile,
  })),
  
  setLoading: (loading) => set((state) => ({
    ...state,
    isLoading: loading,
  })),

  setError: (error) => set((state) => ({
    ...state,
    error,
  })),
  
  signOut: async () => {
    try {
      set({ isLoading: true, error: null })
      
      // Firebase認証が利用可能かチェック
      if (!auth) {
        console.warn('Firebase認証が初期化されていません')
        set({
          user: null,
          userProfile: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        })
        return
      }

      await firebaseSignOut(auth)
      set({
        user: null,
        userProfile: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      })
      console.log('✅ サインアウト成功')
    } catch (error: any) {
      console.error('❌ サインアウトエラー:', error)
      const errorMessage = error?.code === 'auth/invalid-api-key' 
        ? 'Firebase設定に問題があります。管理者に連絡してください。'
        : error?.message || 'サインアウトに失敗しました'
      
      set({ 
        error: errorMessage,
        isLoading: false 
      })
    }
  },
  
  logout: () => set({
    user: null,
    userProfile: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  }),
}))
