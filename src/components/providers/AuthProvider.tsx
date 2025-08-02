'use client'

import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { useAuthStore } from '@/store/authStore'
import { User } from '@/types'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, setUserProfile, setLoading } = useAuthStore()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setLoading(true)
        
        if (firebaseUser) {
          // Firebase Authユーザーをストアに保存
          setUser(firebaseUser)
          
          // Firestoreからユーザープロフィールを取得
          try {
            const userDocRef = doc(db, 'users', firebaseUser.uid)
            const userDocSnap = await getDoc(userDocRef)
            
            if (userDocSnap.exists()) {
              const userData = userDocSnap.data() as User
              setUserProfile(userData)
            } else {
              // プロフィールが存在しない場合はnullに設定
              setUserProfile(null)
            }
          } catch (error) {
            console.error('Error fetching user profile:', error)
            setUserProfile(null)
          }
        } else {
          // ログアウト状態
          setUser(null)
          setUserProfile(null)
        }
      } catch (error) {
        console.error('Auth state change error:', error)
        setUser(null)
        setUserProfile(null)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [setUser, setUserProfile, setLoading])

  return <>{children}</>
}
