import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '../Button';
import { Heart, ArrowRight } from 'lucide-react';

describe('Button', () => {
  it('基本的なボタンがレンダリングされる', () => {
    render(<Button>テストボタン</Button>);
    
    const button = screen.getByRole('button', { name: 'テストボタン' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('テストボタン');
  });

  it('クリックイベントが正しく処理される', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>クリック</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disabled状態が正しく動作する', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>無効ボタン</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('loading状態が正しく表示される', () => {
    render(<Button loading>読み込み中</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    
    // ローディングスピナーが表示される
    const spinner = button.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  describe('バリアント', () => {
    it('primaryバリアントが適用される', () => {
      render(<Button variant="primary">Primary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-elder-interactive-primary');
    });

    it('secondaryバリアントが適用される', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-elder-bg-primary');
    });

    it('successバリアントが適用される', () => {
      render(<Button variant="success">Success</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-elder-success');
    });

    it('warningバリアントが適用される', () => {
      render(<Button variant="warning">Warning</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-elder-warning');
    });

    it('dangerバリアントが適用される', () => {
      render(<Button variant="danger">Danger</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-elder-error');
    });

    it('ghostバリアントが適用される', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-transparent');
    });
  });

  describe('サイズ', () => {
    it('smサイズが適用される', () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-4', 'py-2', 'text-sm');
    });

    it('mdサイズが適用される（デフォルト）', () => {
      render(<Button>Medium</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-6', 'py-3', 'text-base');
    });

    it('lgサイズが適用される', () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-8', 'py-4', 'text-lg');
    });

    it('xlサイズが適用される', () => {
      render(<Button size="xl">Extra Large</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-10', 'py-5', 'text-xl');
    });
  });

  it('fullWidth プロパティが正しく動作する', () => {
    render(<Button fullWidth>フル幅ボタン</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-full');
  });

  it('leftIcon が正しく表示される', () => {
    render(
      <Button leftIcon={<Heart data-testid="left-icon" />}>
        アイコン付きボタン
      </Button>
    );
    
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
  });

  it('rightIcon が正しく表示される', () => {
    render(
      <Button rightIcon={<ArrowRight data-testid="right-icon" />}>
        アイコン付きボタン
      </Button>
    );
    
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('loading中はrightIconが表示されない', () => {
    render(
      <Button loading rightIcon={<ArrowRight data-testid="right-icon" />}>
        読み込み中
      </Button>
    );
    
    expect(screen.queryByTestId('right-icon')).not.toBeInTheDocument();
  });

  it('カスタムクラス名が適用される', () => {
    render(<Button className="custom-class">カスタム</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('HTML属性が正しく渡される', () => {
    render(
      <Button type="submit" data-testid="submit-button">
        送信
      </Button>
    );
    
    const button = screen.getByTestId('submit-button');
    expect(button).toHaveAttribute('type', 'submit');
  });
});
