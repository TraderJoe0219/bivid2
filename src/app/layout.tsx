import type { Metadata } from 'next'
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
      <body>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
}
