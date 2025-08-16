/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ee',
          100: '#fdecd3',
          200: '#fad5a5',
          300: '#f7b56d',
          400: '#f38d32',
          500: '#f17016',
          600: '#e2550c',
          700: '#bb400c',
          800: '#953312',
          900: '#792b12',
          950: '#411309',
        },
        // 高齢者向けアクセシブルカラーパレット
        elder: {
          // 背景色（高コントラスト）
          'bg-primary': '#ffffff',
          'bg-secondary': '#f8fafc',
          'bg-accent': '#f1f5f9',
          
          // テキストカラー（AAA規格対応）
          'text-primary': '#1a202c',
          'text-secondary': '#2d3748',
          'text-muted': '#4a5568',
          
          // ブランドカラー（高コントラスト）
          'brand-primary': '#d97706',    // オレンジ
          'brand-secondary': '#0369a1',  // ブルー
          
          // 状態カラー（高コントラスト）
          'success': '#059669',
          'warning': '#d97706',
          'error': '#dc2626',
          'info': '#0369a1',
          
          // ボーダー・区切り線
          'border-light': '#e2e8f0',
          'border-medium': '#cbd5e0',
          'border-strong': '#a0aec0',
          
          // インタラクティブ要素
          'interactive-primary': '#d97706',
          'interactive-hover': '#b45309',
          'interactive-active': '#92400e',
          'interactive-disabled': '#9ca3af',
        }
      },
      fontSize: {
        // 高齢者向けフォントサイズ（アクセシビリティ対応）
        'xs': ['1rem', { lineHeight: '1.6' }],        // 16px
        'sm': ['1.125rem', { lineHeight: '1.6' }],    // 18px
        'base': ['1.25rem', { lineHeight: '1.7' }],   // 20px
        'lg': ['1.375rem', { lineHeight: '1.7' }],    // 22px
        'xl': ['1.5rem', { lineHeight: '1.8' }],      // 24px
        '2xl': ['1.875rem', { lineHeight: '1.8' }],   // 30px
        '3xl': ['2.25rem', { lineHeight: '1.8' }],    // 36px
        '4xl': ['2.625rem', { lineHeight: '1.8' }],   // 42px
      },
      spacing: {
        // タッチターゲットサイズ（アクセシビリティ対応）
        'touch': '44px',     // 最小タッチサイズ
        'touch-lg': '56px',  // 推奨タッチサイズ
        'touch-xl': '72px',  // 大きなタッチサイズ
      },
      borderRadius: {
        'elder': '8px',      // 控えめな角丸
        'elder-lg': '12px',  // 中程度の角丸
        'elder-xl': '16px',  // 大きな角丸
      },
      boxShadow: {
        'elder': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'elder-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'elder-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'elder-focus': '0 0 0 3px rgba(217, 119, 6, 0.3)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
