'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map, Search, User, LogIn, UserPlus } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export const Navigation: React.FC = () => {
  const pathname = usePathname();
  const { user, signOut } = useAuthStore();

  const navItems = [
    { href: '/', label: 'ホーム', icon: Home },
    { href: '/skills/search', label: 'スキル検索', icon: Search },
    { href: '/map', label: '地図検索', icon: Map },
  ];

  const authItems = user
    ? [
        { href: '/profile', label: 'プロフィール', icon: User },
        { href: '#', label: 'ログアウト', icon: LogIn, onClick: signOut },
      ]
    : [
        { href: '/login', label: 'ログイン', icon: LogIn },
        { href: '/signup', label: '新規登録', icon: UserPlus },
      ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* ロゴ */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-orange-600">Bivid</span>
            <span className="ml-2 text-sm text-gray-600 hidden sm:inline">
              スキルシェアでつながる
            </span>
          </Link>

          {/* ナビゲーションメニュー */}
          <div className="flex items-center space-x-4">
            {/* メインナビゲーション */}
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-orange-100 text-orange-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* 認証関連メニュー */}
            <div className="flex items-center space-x-2">
              {authItems.map((item) => {
                const Icon = item.icon;
                
                if (item.onClick) {
                  return (
                    <button
                      key={item.label}
                      onClick={item.onClick}
                      className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">{item.label}</span>
                    </button>
                  );
                }
                
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-orange-100 text-orange-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* モバイルメニュー */}
          <div className="md:hidden">
            <div className="flex items-center space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`p-2 rounded-md transition-colors ${
                      isActive
                        ? 'bg-orange-100 text-orange-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    title={item.label}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                );
              })}
              
              {authItems.map((item) => {
                const Icon = item.icon;
                
                if (item.onClick) {
                  return (
                    <button
                      key={item.label}
                      onClick={item.onClick}
                      className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                      title={item.label}
                    >
                      <Icon className="w-5 h-5" />
                    </button>
                  );
                }
                
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`p-2 rounded-md transition-colors ${
                      isActive
                        ? 'bg-orange-100 text-orange-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    title={item.label}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
