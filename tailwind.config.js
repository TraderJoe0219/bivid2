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
        // Bividブランドカラーパレット（ロゴベース）
        bivid: {
          // ロゴ由来のメインカラー
          'blue': '#0071bc',        // ロゴのプライマリブルー
          'pink': '#ed1e79',        // ロゴのアクセントピンク
          'white': '#ffffff',       // ロゴのハイライト

          // ブルー系グラデーション
          'blue-50': '#f0f9ff',
          'blue-100': '#e0f2fe', 
          'blue-200': '#bae6fd',
          'blue-300': '#7dd3fc',
          'blue-400': '#38bdf8',
          'blue-500': '#0071bc',     // メイン
          'blue-600': '#0053a3',
          'blue-700': '#003d7a',
          'blue-800': '#1e3a8a',
          'blue-900': '#1e40af',

          // ピンク系グラデーション
          'pink-50': '#fdf2f8',
          'pink-100': '#fce7f3',
          'pink-200': '#fbcfe8',
          'pink-300': '#f9a8d4',
          'pink-400': '#f472b6',
          'pink-500': '#ed1e79',     // メイン
          'pink-600': '#db2777',
          'pink-700': '#be185d',
          'pink-800': '#9d174d',
          'pink-900': '#831843',
        },
        
        // 高齢者向けアクセシブルカラーパレット（Bividテーマ適用）
        elder: {
          // 背景色（高コントラスト）
          'bg-primary': '#ffffff',
          'bg-secondary': '#f0f9ff',      // bivid-blue-50
          'bg-accent': '#e0f2fe',         // bivid-blue-100
          
          // テキストカラー（AAA規格対応）
          'text-primary': '#1a202c',
          'text-secondary': '#2d3748',
          'text-muted': '#4a5568',
          
          // ブランドカラー（Bividロゴベース）
          'brand-primary': '#0071bc',     // bivid-blue
          'brand-secondary': '#ed1e79',   // bivid-pink
          'accent': '#ed1e79',            // bivid-pink
          
          // 状態カラー（Bividテーマ調整）
          'success': '#059669',
          'warning': '#f59e0b',
          'error': '#dc2626',
          'info': '#0071bc',              // bivid-blue
          
          // ボーダー・区切り線（ブルー基調）
          'border-light': '#bae6fd',      // bivid-blue-200
          'border-medium': '#7dd3fc',     // bivid-blue-300
          'border-strong': '#38bdf8',     // bivid-blue-400
          
          // インタラクティブ要素（Bividカラー）
          'interactive-primary': '#0071bc',    // bivid-blue
          'interactive-hover': '#0053a3',      // bivid-blue-600
          'interactive-active': '#003d7a',     // bivid-blue-700
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
