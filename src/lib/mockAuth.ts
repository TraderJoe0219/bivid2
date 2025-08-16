// 開発用モック認証システム
import { useAuthStore } from '@/store/authStore'

interface MockUser {
  uid: string
  email: string
  displayName: string
  photoURL?: string
}

const mockUsers: MockUser[] = [
  {
    uid: 'mock-user-1',
    email: 'test@example.com',
    displayName: '田中太郎',
    photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
  },
  {
    uid: 'mock-user-2',
    email: 'demo@example.com',
    displayName: '山田花子',
    photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400'
  }
]

export const mockSignUpWithEmail = async (email: string, password: string, displayName: string) => {
  // モック遅延
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // ユーザーを作成
  const mockUser: MockUser = {
    uid: `mock-user-${Date.now()}`,
    email,
    displayName,
    photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
  }
  
  // Zustandストアにユーザーを設定
  useAuthStore.getState().setUser(mockUser)
  
  return { user: mockUser, error: null }
}

export const mockSignInWithEmail = async (email: string, password: string) => {
  // モック遅延
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // 既存のユーザーを検索
  const user = mockUsers.find(u => u.email === email) || mockUsers[0]
  
  // Zustandストアにユーザーを設定
  useAuthStore.getState().setUser(user)
  
  return { user, error: null }
}

export const mockSignInWithGoogle = async () => {
  // モック遅延
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Googleユーザーを模擬
  const user = mockUsers[1]
  
  // Zustandストアにユーザーを設定
  useAuthStore.getState().setUser(user)
  
  return { user, error: null }
}

export const mockSignOut = async () => {
  useAuthStore.getState().setUser(null)
  return { error: null }
}

// 開発環境でのみモック認証を有効にする
export const isDevelopment = process.env.NODE_ENV === 'development'