import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Loading, FullScreenLoading } from '../Loading';

describe('Loading', () => {
  it('基本的なローディングコンポーネントがレンダリングされる', () => {
    render(<Loading />);
    
    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
    
    // スピナーアイコンが存在する
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('カスタムテキストが表示される', () => {
    render(<Loading text="データを取得中..." />);
    
    expect(screen.getByText('データを取得中...')).toBeInTheDocument();
    expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
  });

  describe('サイズ', () => {
    it('smサイズが適用される', () => {
      render(<Loading size="sm" />);
      
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toHaveClass('w-6', 'h-6');
      
      const text = screen.getByText('読み込み中...');
      expect(text).toHaveClass('text-sm');
    });

    it('mdサイズが適用される（デフォルト）', () => {
      render(<Loading />);
      
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toHaveClass('w-8', 'h-8');
      
      const text = screen.getByText('読み込み中...');
      expect(text).toHaveClass('text-base');
    });

    it('lgサイズが適用される', () => {
      render(<Loading size="lg" />);
      
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toHaveClass('w-12', 'h-12');
      
      const text = screen.getByText('読み込み中...');
      expect(text).toHaveClass('text-lg');
    });
  });

  it('カスタムクラス名が適用される', () => {
    render(<Loading className="custom-loading" />);
    
    const container = document.querySelector('.custom-loading');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('flex', 'flex-col', 'items-center');
  });

  it('スピナーが正しいクラスを持つ', () => {
    render(<Loading />);
    
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toHaveClass('text-elder-interactive-primary');
  });

  it('テキストが正しいクラスを持つ', () => {
    render(<Loading />);
    
    const text = screen.getByText('読み込み中...');
    expect(text).toHaveClass('text-elder-text-secondary');
  });
});

describe('FullScreenLoading', () => {
  it('フルスクリーンローディングがレンダリングされる', () => {
    render(<FullScreenLoading />);
    
    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
    
    // フルスクリーンオーバーレイが存在する
    const overlay = document.querySelector('.fixed.inset-0');
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveClass('bg-elder-bg-primary', 'bg-opacity-95', 'z-50');
  });

  it('カスタムテキストが表示される', () => {
    render(<FullScreenLoading text="アプリを初期化中..." />);
    
    expect(screen.getByText('アプリを初期化中...')).toBeInTheDocument();
    expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
  });

  it('カードコンテナが存在する', () => {
    render(<FullScreenLoading />);
    
    const card = document.querySelector('.card');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('text-center');
  });

  it('大きなサイズのローディングが使用される', () => {
    render(<FullScreenLoading />);
    
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toHaveClass('w-12', 'h-12');
    
    const text = screen.getByText('読み込み中...');
    expect(text).toHaveClass('text-lg');
  });
});
