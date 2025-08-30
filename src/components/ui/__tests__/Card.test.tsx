import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter, 
  CardTitle, 
  CardDescription 
} from '../Card';

describe('Card', () => {
  it('基本的なカードがレンダリングされる', () => {
    render(
      <Card data-testid="card">
        <div>カード内容</div>
      </Card>
    );
    
    const card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();
    expect(card).toHaveTextContent('カード内容');
  });

  describe('バリアント', () => {
    it('defaultバリアントが適用される', () => {
      render(<Card data-testid="card">内容</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('card');
    });

    it('hoverバリアントが適用される', () => {
      render(<Card variant="hover" data-testid="card">内容</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('card-hover');
    });

    it('interactiveバリアントが適用される', () => {
      render(<Card variant="interactive" data-testid="card">内容</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('card-interactive');
    });
  });

  describe('サイズ', () => {
    it('smサイズが適用される', () => {
      render(<Card size="sm" data-testid="card">内容</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('p-4');
    });

    it('mdサイズが適用される（デフォルト）', () => {
      render(<Card data-testid="card">内容</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('p-6');
    });

    it('lgサイズが適用される', () => {
      render(<Card size="lg" data-testid="card">内容</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('p-8');
    });
  });

  it('カスタムクラス名が適用される', () => {
    render(<Card className="custom-card" data-testid="card">内容</Card>);
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('custom-card');
  });

  it('HTML属性が正しく渡される', () => {
    render(<Card data-testid="card" role="region">内容</Card>);
    const card = screen.getByTestId('card');
    expect(card).toHaveAttribute('role', 'region');
  });

  it('refが正しく転送される', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Card ref={ref}>内容</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('CardHeader', () => {
  it('ヘッダーが正しくレンダリングされる', () => {
    render(
      <CardHeader data-testid="header">
        <div>ヘッダー内容</div>
      </CardHeader>
    );
    
    const header = screen.getByTestId('header');
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent('ヘッダー内容');
    expect(header).toHaveClass('space-y-1.5');
  });

  it('カスタムクラス名が適用される', () => {
    render(<CardHeader className="custom-header" data-testid="header">内容</CardHeader>);
    const header = screen.getByTestId('header');
    expect(header).toHaveClass('custom-header');
  });
});

describe('CardContent', () => {
  it('コンテンツが正しくレンダリングされる', () => {
    render(
      <CardContent data-testid="content">
        <div>コンテンツ内容</div>
      </CardContent>
    );
    
    const content = screen.getByTestId('content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent('コンテンツ内容');
    expect(content).toHaveClass('space-y-4');
  });

  it('カスタムクラス名が適用される', () => {
    render(<CardContent className="custom-content" data-testid="content">内容</CardContent>);
    const content = screen.getByTestId('content');
    expect(content).toHaveClass('custom-content');
  });
});

describe('CardFooter', () => {
  it('フッターが正しくレンダリングされる', () => {
    render(
      <CardFooter data-testid="footer">
        <div>フッター内容</div>
      </CardFooter>
    );
    
    const footer = screen.getByTestId('footer');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveTextContent('フッター内容');
    expect(footer).toHaveClass('flex', 'items-center', 'space-x-2');
  });

  it('カスタムクラス名が適用される', () => {
    render(<CardFooter className="custom-footer" data-testid="footer">内容</CardFooter>);
    const footer = screen.getByTestId('footer');
    expect(footer).toHaveClass('custom-footer');
  });
});

describe('CardTitle', () => {
  it('タイトルが正しくレンダリングされる（デフォルトh3）', () => {
    render(<CardTitle>カードタイトル</CardTitle>);
    
    const title = screen.getByRole('heading', { level: 3 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('カードタイトル');
    expect(title).toHaveClass('font-semibold', 'text-elder-text-primary');
  });

  it('カスタム見出しレベルが適用される', () => {
    render(<CardTitle as="h1">メインタイトル</CardTitle>);
    
    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('メインタイトル');
  });

  it('カスタムクラス名が適用される', () => {
    render(<CardTitle className="custom-title">タイトル</CardTitle>);
    const title = screen.getByRole('heading');
    expect(title).toHaveClass('custom-title');
  });
});

describe('CardDescription', () => {
  it('説明文が正しくレンダリングされる', () => {
    render(<CardDescription data-testid="description">カードの説明文</CardDescription>);
    
    const description = screen.getByTestId('description');
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent('カードの説明文');
    expect(description).toHaveClass('text-base', 'text-elder-text-muted');
  });

  it('カスタムクラス名が適用される', () => {
    render(<CardDescription className="custom-desc" data-testid="description">説明</CardDescription>);
    const description = screen.getByTestId('description');
    expect(description).toHaveClass('custom-desc');
  });
});

describe('Card 統合テスト', () => {
  it('完全なカード構造が正しく動作する', () => {
    render(
      <Card data-testid="full-card">
        <CardHeader>
          <CardTitle>テストカード</CardTitle>
          <CardDescription>これはテスト用のカードです</CardDescription>
        </CardHeader>
        <CardContent>
          <p>カードの本文内容</p>
        </CardContent>
        <CardFooter>
          <button>アクション</button>
        </CardFooter>
      </Card>
    );

    // 各要素が存在することを確認
    expect(screen.getByTestId('full-card')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'テストカード' })).toBeInTheDocument();
    expect(screen.getByText('これはテスト用のカードです')).toBeInTheDocument();
    expect(screen.getByText('カードの本文内容')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'アクション' })).toBeInTheDocument();
  });
});
