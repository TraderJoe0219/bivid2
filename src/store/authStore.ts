import { create } from 'zustand'
import { User as FirebaseUser } from 'firebase/auth'
import { User } from '@/types'

interface AuthState {
  user: FirebaseUser | null
  userProfile: User | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: FirebaseUser | null) => void
  setUserProfile: (profile: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userProfile: null,
  isLoading: true,
  isAuthenticated: false,
  
  setUser: (user) => set((state) => ({
    ...state,
    user,
    isAuthenticated: !!user,
  })),
  
  setUserProfile: (profile) => set((state) => ({
    ...state,
    userProfile: profile,
  })),
  
  setLoading: (loading) => set((state) => ({
    ...state,
    isLoading: loading,
  })),
  
  logout: () => set({
    user: null,
    userProfile: null,
    isAuthenticated: false,
    isLoading: false,
  }),
}))
