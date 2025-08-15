'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, Search, Map, LogIn, UserPlus, User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

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
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* ロゴ */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-orange-600">Bivid</span>
              <span className="ml-2 text-sm text-gray-600">スキルシェアでつながる</span>
            </Link>
          </div>

          {/* デスクトップメニュー */}
          <div className="hidden md:flex items-center space-x-8">
            {/* ナビゲーションアイテム */}
            <div className="flex items-center space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-orange-600 border-b-2 border-orange-600'
                        : 'text-gray-700 hover:text-orange-600'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* 認証関連リンク */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    className="inline-flex items-center px-4 py-2 text-gray-700 hover:text-orange-600 transition-colors"
                  >
                    <User className="w-4 h-4 mr-2" />
                    プロフィール
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="inline-flex items-center px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    ログアウト
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="inline-flex items-center px-4 py-2 text-gray-700 hover:text-orange-600 transition-colors"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    ログイン
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
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
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
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
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              {/* ナビゲーションアイテム */}
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-orange-100 text-orange-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Link>
                );
              })}
              
              {/* 認証関連リンク */}
              <div className="pt-4 border-t border-gray-200">
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-5 h-5 mr-3" />
                      プロフィール
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      ログアウト
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LogIn className="w-5 h-5 mr-3" />
                      ログイン
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-4 py-3 text-white bg-orange-600 hover:bg-orange-700 transition-colors mx-4 mt-2 rounded-lg"
                    >
                      <UserPlus className="w-5 h-5 mr-3" />
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
