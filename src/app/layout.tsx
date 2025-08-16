import type { Metadata } from 'next'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { Navigation } from '@/components/layout/Navigation'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bivid - 高齢者向けスキルシェアプラットフォーム',
  description: '高齢者同士でスキルを共有し、学び合うプラットフォーム。アクセシブルで使いやすいデザインで、様々なスキルを学び、教えることができます。',
  keywords: ['スキルシェア', '高齢者', '学習', 'コミュニティ', 'アクセシビリティ'],
  authors: [{ name: 'Bivid Team' }],
  viewport: 'width=device-width, initial-scale=1, user-scalable=yes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased min-h-screen">
        <AuthProvider>
          <div id="root" className="flex flex-col min-h-screen">
            {/* スキップリンク */}
            <a 
              href="#main-content" 
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 btn-primary"
            >
              メインコンテンツにスキップ
            </a>
            
            <Navigation />
            
            <main id="main-content" className="flex-1" role="main">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
