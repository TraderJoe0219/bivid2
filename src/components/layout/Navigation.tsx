'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, Search, Map, LogIn, UserPlus, User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuthStore();

  const navItems = [
    { href: '/', label: 'ホーム', icon: Home },
    { href: '/skills/search', label: 'スキル検索', icon: Search },
    { href: '/map', label: '地図検索', icon: Map },
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
        { href: '/profile', label: 'プロフィール', icon: User },
        { href: '#', label: 'ログアウト', icon: LogOut, onClick: handleSignOut },
      ]
    : [
        { href: '/login', label: 'ログイン', icon: LogIn },
        { href: '/signup', label: '新規登録', icon: UserPlus },
      ];

  return (
    <nav className="bg-elder-bg-primary shadow-elder border-b border-elder-border-light">
      <div className="container-elder">
        <div className="flex justify-between h-20">
          {/* ロゴ */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center focus-outline rounded-elder">
              <span className="text-3xl font-bold text-elder-brand-primary">Bivid</span>
              <span className="ml-3 text-base text-elder-text-secondary">スキルシェアでつながる</span>
            </Link>
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
                <>
                  <Link
                    href="/profile"
                    className="nav-link"
                  >
                    <User className="w-5 h-5 mr-2" />
                    プロフィール
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="nav-link hover:text-elder-error focus-visible:ring-elder-error"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    ログアウト
                  </button>
                </>
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
                    className="btn-primary"
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
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-4 py-3 text-elder-text-secondary hover:bg-elder-bg-accent hover:text-elder-interactive-primary transition-colors rounded-elder-lg touch-target"
                    >
                      <User className="w-6 h-6 mr-3" />
                      プロフィール
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-3 text-elder-text-secondary hover:bg-elder-bg-accent hover:text-elder-error transition-colors rounded-elder-lg touch-target"
                    >
                      <LogOut className="w-6 h-6 mr-3" />
                      ログアウト
                    </button>
                  </>
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
                      className="btn-primary w-full justify-center mt-3"
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
