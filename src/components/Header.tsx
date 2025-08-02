'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuthStore } from '@/store/authStore'
import { LogOut, User, Search, BookOpen } from 'lucide-react'

export default function Header() {
  const { isAuthenticated, userProfile } = useAuth()
  const { logout } = useAuthStore()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container-elder">
        <div className="flex items-center justify-between h-20">
          {/* ロゴ */}
          <Link href="/" className="flex items-center">
            <h1 className="text-3xl font-bold text-elder-accent">Bivid</h1>
            <span className="ml-3 text-lg text-gray-600">スキルシェア</span>
          </Link>

          {/* ナビゲーション */}
          <nav className="nav-elder">
            <Link 
              href="/search" 
              className="flex items-center hover:text-elder-accent"
            >
              <Search className="w-5 h-5 mr-2" />
              スキルを探す
            </Link>
            <Link 
              href="/teach" 
              className="flex items-center hover:text-elder-accent"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              教える
            </Link>

            {/* 認証状態に応じた表示 */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/profile" 
                  className="flex items-center hover:text-elder-accent"
                >
                  <User className="w-5 h-5 mr-2" />
                  {userProfile?.displayName || 'プロフィール'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center btn-secondary"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  ログアウト
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="hover:text-elder-accent">
                  ログイン
                </Link>
                <Link href="/register" className="btn-primary">
                  新規登録
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
