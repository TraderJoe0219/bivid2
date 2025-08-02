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
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        // 高齢者に優しい色合い
        elder: {
          bg: '#fafafa',
          text: '#2d3748',
          accent: '#4299e1',
          success: '#48bb78',
          warning: '#ed8936',
          error: '#f56565',
        }
      },
      fontSize: {
        // 高齢者向けに大きめのフォントサイズ
        'xs': ['0.875rem', { lineHeight: '1.5' }],
        'sm': ['1rem', { lineHeight: '1.6' }],
        'base': ['1.125rem', { lineHeight: '1.7' }],
        'lg': ['1.25rem', { lineHeight: '1.8' }],
        'xl': ['1.5rem', { lineHeight: '1.8' }],
        '2xl': ['1.875rem', { lineHeight: '1.8' }],
        '3xl': ['2.25rem', { lineHeight: '1.8' }],
      },
      spacing: {
        // タッチしやすいサイズ
        'touch': '44px',
        'touch-lg': '56px',
      },
      borderRadius: {
        'elder': '12px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
