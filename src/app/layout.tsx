import type { Metadata } from 'next'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { Navigation } from '@/components/layout/Navigation'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bivid - 高齢者向けスキルシェアプラットフォーム',
  description: '高齢者同士でスキルを共有し、学び合うプラットフォーム',
  keywords: ['スキルシェア', '高齢者', '学習', 'コミュニティ'],
  authors: [{ name: 'Bivid Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="font-sans antialiased">
        <AuthProvider>
          <div id="root">
            <Navigation />
            <main>
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
