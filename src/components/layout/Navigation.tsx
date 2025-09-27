'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, Search, Map, LogIn, UserPlus, User, LogOut, Calendar, Compass } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/Logo';

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuthStore();

  const navItems = [
    { href: '/', label: 'ホーム', icon: Home },
    { href: '/skills/search', label: 'スキル検索', icon: Search },
    { href: '/map', label: '地図検索', icon: Map },
    ...(user ? [
      { href: '/me', label: 'プロフィール', icon: User },
      { href: '/me/schedule', label: 'スケジュール', icon: Calendar },
      { href: '/discover', label: 'おすすめ', icon: Compass },
    ] : []),
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  const authItems = user
    ? [
        { href: '#', label: 'ログアウト', icon: LogOut, onClick: handleSignOut },
      ]
    : [
        { href: '/login', label: 'ログイン', icon: LogIn },
        { href: '/signup', label: '新規登録', icon: UserPlus },
      ];

  return (
    <nav className="bg-gradient-to-r from-white via-bivid-blue-50 to-white shadow-elder-md border-b border-bivid-blue-200">
      <div className="container-elder">
        <div className="flex justify-between h-20">
          {/* ロゴ */}
          <div className="flex items-center">
            <Logo size="lg" showSubtitle={true} />
          </div>

          {/* デスクトップメニュー */}
          <div className="hidden md:flex items-center space-x-8">
            {/* ナビゲーションアイテム */}
            <div className="flex items-center space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      isActive ? 'nav-link-active' : 'nav-link'
                    }
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* 認証関連リンク */}
            <div className="flex items-center space-x-3">
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="nav-link hover:text-elder-error focus-visible:ring-elder-error"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  ログアウト
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="nav-link"
                  >
                    <LogIn className="w-5 h-5 mr-2" />
                    ログイン
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-bivid-pink hover:bg-bivid-pink-600 text-white font-semibold px-6 py-3 rounded-elder-lg shadow-elder hover:shadow-elder-md transition-all duration-200 focus-outline min-h-touch inline-flex items-center justify-center"
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    新規登録
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* モバイルメニューボタン */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 rounded-elder text-elder-text-muted hover:text-elder-text-primary hover:bg-elder-bg-accent focus-outline touch-target"
              aria-label={isOpen ? 'メニューを閉じる' : 'メニューを開く'}
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* モバイルメニュー */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-4 pt-4 pb-6 space-y-2 bg-elder-bg-primary border-t border-elder-border-light">
              {/* ナビゲーションアイテム */}
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-center px-4 py-3 rounded-elder-lg text-base font-medium transition-colors touch-target',
                      isActive
                        ? 'bg-elder-bg-accent text-elder-interactive-primary border border-elder-interactive-primary'
                        : 'text-elder-text-secondary hover:bg-elder-bg-accent hover:text-elder-interactive-primary'
                    )}
                  >
                    <Icon className="w-6 h-6 mr-3" />
                    {item.label}
                  </Link>
                );
              })}
              
              {/* 認証関連リンク */}
              <div className="pt-4 border-t border-elder-border-light space-y-2">
                {user ? (
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-3 text-elder-text-secondary hover:bg-elder-bg-accent hover:text-elder-error transition-colors rounded-elder-lg touch-target"
                  >
                    <LogOut className="w-6 h-6 mr-3" />
                    ログアウト
                  </button>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-4 py-3 text-elder-text-secondary hover:bg-elder-bg-accent hover:text-elder-interactive-primary transition-colors rounded-elder-lg touch-target"
                    >
                      <LogIn className="w-6 h-6 mr-3" />
                      ログイン
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsOpen(false)}
                      className="bg-bivid-pink hover:bg-bivid-pink-600 text-white font-semibold px-6 py-3 rounded-elder-lg shadow-elder hover:shadow-elder-md transition-all duration-200 focus-outline min-h-touch w-full justify-center mt-3 inline-flex items-center"
                    >
                      <UserPlus className="w-6 h-6 mr-3" />
                      新規登録
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
