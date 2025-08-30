import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Input } from '../Input';
import { Search, User } from 'lucide-react';

describe('Input', () => {
  it('基本的な入力フィールドがレンダリングされる', () => {
    render(<Input placeholder="テスト入力" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'テスト入力');
  });

  it('値の入力が正しく動作する', () => {
    render(<Input />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'テスト値' } });
    
    expect(input).toHaveValue('テスト値');
  });

  it('ラベルが正しく表示される', () => {
    render(<Input label="ユーザー名" />);
    
    expect(screen.getByText('ユーザー名')).toBeInTheDocument();
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAccessibleName('ユーザー名');
  });

  it('必須フィールドのアスタリスクが表示される', () => {
    render(<Input label="メールアドレス" required />);
    
    const label = screen.getByText('メールアドレス');
    expect(label).toHaveClass('after:content-["*"]');
  });

  it('エラーメッセージが正しく表示される', () => {
    render(<Input error="このフィールドは必須です" />);
    
    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveTextContent('このフィールドは必須です');
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveClass('border-elder-error');
  });

  it('ヘルパーテキストが表示される', () => {
    render(<Input helperText="8文字以上で入力してください" />);
    
    expect(screen.getByText('8文字以上で入力してください')).toBeInTheDocument();
  });

  it('エラーがある場合はヘルパーテキストが表示されない', () => {
    render(
      <Input 
        error="エラーメッセージ" 
        helperText="ヘルパーテキスト" 
      />
    );
    
    expect(screen.getByText('エラーメッセージ')).toBeInTheDocument();
    expect(screen.queryByText('ヘルパーテキスト')).not.toBeInTheDocument();
  });

  it('disabled状態が正しく動作する', () => {
    render(<Input disabled />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  describe('サイズ', () => {
    it('smサイズが適用される', () => {
      render(<Input size="sm" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('px-3', 'py-2', 'text-sm');
    });

    it('mdサイズが適用される（デフォルト）', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('px-4', 'py-3', 'text-base');
    });

    it('lgサイズが適用される', () => {
      render(<Input size="lg" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('px-5', 'py-4', 'text-lg');
    });
  });

  describe('アイコン', () => {
    it('leftIconが正しく表示される', () => {
      render(<Input leftIcon={<User data-testid="left-icon" />} />);
      
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('pl-10');
    });

    it('rightIconが正しく表示される', () => {
      render(<Input rightIcon={<Search data-testid="right-icon" />} />);
      
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('pr-10');
    });
  });

  describe('パスワードフィールド', () => {
    it('パスワードタイプが正しく動作する', () => {
      render(<Input type="password" data-testid="password-input" />);
      
      const input = screen.getByTestId('password-input');
      expect(input).toHaveAttribute('type', 'password');
      
      // パスワード表示/非表示ボタンが存在する
      const toggleButton = screen.getByRole('button', { name: 'パスワードを表示' });
      expect(toggleButton).toBeInTheDocument();
    });

    it('パスワード表示/非表示の切り替えが動作する', () => {
      render(<Input type="password" data-testid="password-input" />);
      
      const input = screen.getByTestId('password-input');
      const toggleButton = screen.getByRole('button', { name: 'パスワードを表示' });
      
      // 初期状態はパスワードタイプ
      expect(input).toHaveAttribute('type', 'password');
      
      // ボタンクリックでテキストタイプに変更
      fireEvent.click(toggleButton);
      expect(input).toHaveAttribute('type', 'text');
      expect(screen.getByRole('button', { name: 'パスワードを隠す' })).toBeInTheDocument();
      
      // 再度クリックでパスワードタイプに戻る
      fireEvent.click(screen.getByRole('button', { name: 'パスワードを隠す' }));
      expect(input).toHaveAttribute('type', 'password');
    });
  });

  it('カスタムクラス名が適用される', () => {
    render(<Input className="custom-input" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-input');
  });

  it('HTML属性が正しく渡される', () => {
    render(
      <Input 
        data-testid="test-input"
        maxLength={10}
        autoComplete="email"
      />
    );
    
    const input = screen.getByTestId('test-input');
    expect(input).toHaveAttribute('maxLength', '10');
    expect(input).toHaveAttribute('autoComplete', 'email');
  });

  it('refが正しく転送される', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('アクセシビリティ属性が正しく設定される', () => {
    render(
      <Input 
        label="テストラベル"
        error="エラーメッセージ"
        helperText="ヘルパーテキスト"
      />
    );
    
    const input = screen.getByRole('textbox');
    
    // aria-invalid
    expect(input).toHaveAttribute('aria-invalid', 'true');
    
    // aria-describedby（エラーがある場合はエラーIDが設定される）
    expect(input).toHaveAttribute('aria-describedby');
    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toContain('error');
  });
});
