'use client'

import { createContext, useContext, useEffect, ReactNode } from 'react'
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { useAuthStore } from '@/store/authStore'
import { User } from '@/types'

interface AuthContextType {
  user: FirebaseUser | null
  userProfile: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { user, userProfile, isLoading, setUser, setUserProfile, setLoading, setError } = useAuthStore()

  useEffect(() => {
    // Firebase認証が利用不可の場合のフォールバック
    if (!auth || !db) {
      console.warn('⚠️ Firebase認証/データベースが初期化されていません')
      setLoading(false)
      return
    }

    let unsubscribe: (() => void) | null = null

    try {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        try {
          setUser(firebaseUser)
          setError(null) // エラーをクリア
          
          if (firebaseUser) {
            try {
              // Firestoreからユーザープロフィールを取得
              const userDocRef = doc(db, 'users', firebaseUser.uid)
              const userDoc = await getDoc(userDocRef)
              
              if (userDoc.exists()) {
                const userData = userDoc.data()
                const userProfile: User = {
                  id: firebaseUser.uid,
                  email: firebaseUser.email || '',
                  displayName: userData.displayName || firebaseUser.displayName || '',
                  photoURL: userData.photoURL || firebaseUser.photoURL,
                  bio: userData.bio || '',
                  age: userData.age,
                  location: userData.location || '',
                  skills: userData.skills || [],
                  interests: userData.interests || [],
                  rating: userData.rating || 0,
                  reviewCount: userData.reviewCount || 0,
                  createdAt: userData.createdAt?.toDate() || new Date(),
                  updatedAt: userData.updatedAt?.toDate() || new Date(),
                }
                setUserProfile(userProfile)
              } else {
                // プロフィールが存在しない場合は基本情報で作成
                const basicProfile: User = {
                  id: firebaseUser.uid,
                  email: firebaseUser.email || '',
                  displayName: firebaseUser.displayName || '',
                  photoURL: firebaseUser.photoURL,
                  skills: [],
                  interests: [],
                  rating: 0,
                  reviewCount: 0,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                }
                setUserProfile(basicProfile)
              }
            } catch (firestoreError: any) {
              console.error('❌ Firestoreアクセスエラー:', firestoreError)
              
              // Firestoreエラー時でも基本プロフィールを作成
              const basicProfile: User = {
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || 'ユーザー',
                photoURL: firebaseUser.photoURL,
                skills: [],
                interests: [],
                rating: 0,
                reviewCount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
              }
              setUserProfile(basicProfile)
              
              if (firestoreError.code === 'permission-denied') {
                setError('データベースへのアクセス権限がありません')
              }
            }
          } else {
            setUserProfile(null)
          }
          
          setLoading(false)
        } catch (authError: any) {
          console.error('❌ 認証状態変更エラー:', authError)
          setError(authError.message || '認証エラーが発生しました')
          setLoading(false)
        }
      })
    } catch (initError: any) {
      console.error('❌ Firebase認証の初期化エラー:', initError)
      if (initError.code === 'auth/invalid-api-key') {
        setError('Firebase設定に問題があります。管理者に連絡してください。')
      } else {
        setError('認証システムの初期化に失敗しました')
      }
      setLoading(false)
    }

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [setUser, setUserProfile, setLoading, setError])

  const value: AuthContextType = {
    user,
    userProfile,
    isLoading,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
