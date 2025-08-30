import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../Header';

// Next.js router のモック
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// AuthContext のモック
const mockUseAuth = jest.fn();
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

// AuthStore のモック
const mockLogout = jest.fn();
jest.mock('@/store/authStore', () => ({
  useAuthStore: () => ({
    logout: mockLogout,
  }),
}));

// Firebase のモック
jest.mock('firebase/auth', () => ({
  signOut: jest.fn(),
}));

jest.mock('@/lib/firebase', () => ({
  auth: {},
}));

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // コンソールエラーをモック
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('未認証状態', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        userProfile: null,
      });
    });

    it('基本的なヘッダー要素がレンダリングされる', () => {
      render(<Header />);

      // ロゴ
      expect(screen.getByText('Bivid')).toBeInTheDocument();
      expect(screen.getByText('スキルシェア')).toBeInTheDocument();

      // ナビゲーション
      expect(screen.getByText('スキルを探す')).toBeInTheDocument();
      expect(screen.getByText('教える')).toBeInTheDocument();

      // 未認証時のリンク
      expect(screen.getByText('ログイン')).toBeInTheDocument();
      expect(screen.getByText('新規登録')).toBeInTheDocument();
    });

    it('正しいリンクが設定されている', () => {
      render(<Header />);

      expect(screen.getByRole('link', { name: /Bivid スキルシェア/ })).toHaveAttribute('href', '/');
      expect(screen.getByRole('link', { name: /スキルを探す/ })).toHaveAttribute('href', '/search');
      expect(screen.getByRole('link', { name: /教える/ })).toHaveAttribute('href', '/teach');
      expect(screen.getByRole('link', { name: 'ログイン' })).toHaveAttribute('href', '/login');
      expect(screen.getByRole('link', { name: '新規登録' })).toHaveAttribute('href', '/register');
    });

    it('認証済みユーザー向けの要素が表示されない', () => {
      render(<Header />);

      expect(screen.queryByText('プロフィール')).not.toBeInTheDocument();
      expect(screen.queryByText('ログアウト')).not.toBeInTheDocument();
    });
  });

  describe('認証済み状態', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        userProfile: {
          displayName: '田中太郎',
          email: 'tanaka@example.com',
        },
      });
    });

    it('認証済みユーザー向けの要素が表示される', () => {
      render(<Header />);

      // プロフィールリンク（ユーザー名付き）
      expect(screen.getByText('田中太郎')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /田中太郎/ })).toHaveAttribute('href', '/profile');

      // ログアウトボタン
      expect(screen.getByRole('button', { name: /ログアウト/ })).toBeInTheDocument();
    });

    it('未認証ユーザー向けの要素が表示されない', () => {
      render(<Header />);

      expect(screen.queryByText('ログイン')).not.toBeInTheDocument();
      expect(screen.queryByText('新規登録')).not.toBeInTheDocument();
    });

    it('displayNameがない場合はデフォルトテキストが表示される', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        userProfile: {
          email: 'user@example.com',
        },
      });

      render(<Header />);

      expect(screen.getByText('プロフィール')).toBeInTheDocument();
    });

    it('ログアウトボタンクリックで正しい処理が実行される', async () => {
      const { signOut } = require('firebase/auth');
      signOut.mockResolvedValue(undefined);

      render(<Header />);

      const logoutButton = screen.getByRole('button', { name: /ログアウト/ });
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(signOut).toHaveBeenCalledTimes(1);
        expect(mockLogout).toHaveBeenCalledTimes(1);
      });
    });

    it('ログアウト時のエラーが適切に処理される', async () => {
      const { signOut } = require('firebase/auth');
      const error = new Error('Logout failed');
      signOut.mockRejectedValue(error);

      render(<Header />);

      const logoutButton = screen.getByRole('button', { name: /ログアウト/ });
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(signOut).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledWith('Logout error:', error);
      });
    });
  });

  describe('スタイリング', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        userProfile: null,
      });
    });

    it('ヘッダーに正しいクラスが適用される', () => {
      render(<Header />);

      const header = document.querySelector('header');
      expect(header).toHaveClass('bg-white', 'shadow-sm', 'border-b', 'sticky', 'top-0', 'z-50');
    });

    it('ロゴに正しいスタイルが適用される', () => {
      render(<Header />);

      const logo = screen.getByText('Bivid');
      expect(logo).toHaveClass('text-3xl', 'font-bold', 'text-elder-accent');

      const subtitle = screen.getByText('スキルシェア');
      expect(subtitle).toHaveClass('ml-3', 'text-lg', 'text-gray-600');
    });

    it('ナビゲーションリンクが存在する', () => {
      render(<Header />);

      const searchLink = screen.getByRole('link', { name: /スキルを探す/ });
      expect(searchLink).toBeInTheDocument();

      const teachLink = screen.getByRole('link', { name: /教える/ });
      expect(teachLink).toBeInTheDocument();
    });
  });

  describe('アイコン', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        userProfile: { displayName: 'テストユーザー' },
      });
    });

    it('各ナビゲーション項目に適切なアイコンが表示される', () => {
      render(<Header />);

      // アイコンのSVG要素が存在することを確認
      const searchIcon = document.querySelector('.lucide-search');
      expect(searchIcon).toBeInTheDocument();

      const bookIcon = document.querySelector('.lucide-book-open');
      expect(bookIcon).toBeInTheDocument();

      const userIcon = document.querySelector('.lucide-user');
      expect(userIcon).toBeInTheDocument();

      const logoutIcon = document.querySelector('.lucide-log-out');
      expect(logoutIcon).toBeInTheDocument();
    });
  });
});
