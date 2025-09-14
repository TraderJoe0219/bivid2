import { Metadata } from 'next'
import { getContentPage } from '@/lib/content'
import { MarkdownContent } from '@/components/MarkdownContent'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { MessageCircle, Phone, Mail } from 'lucide-react'

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getContentPage('help')

  return {
    title: `${metadata.title} | Bivid`,
    description: metadata.description,
    openGraph: {
      title: metadata.title,
      description: metadata.description || undefined,
    }
  }
}

export default async function HelpPage() {
  const { metadata, content } = await getContentPage('help')

  return (
    <div className="min-h-screen bg-elder-bg-primary">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-elder-text-primary mb-4">
            {metadata.title}
          </h1>
          {metadata.description && (
            <p className="text-xl text-elder-text-muted mb-6">
              {metadata.description}
            </p>
          )}

          {/* クイックアクションボタン */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Button
              variant="secondary"
              className="h-auto py-4 flex flex-col gap-2"
              onClick={() => window.location.href = '/messages'}
            >
              <MessageCircle className="w-6 h-6" />
              <span>チャットサポート</span>
              <span className="text-sm text-elder-text-muted">
                リアルタイムでサポート
              </span>
            </Button>

            <Button
              variant="secondary"
              className="h-auto py-4 flex flex-col gap-2"
              onClick={() => window.location.href = 'tel:0120-XXX-XXX'}
            >
              <Phone className="w-6 h-6" />
              <span>電話サポート</span>
              <span className="text-sm text-elder-text-muted">
                平日 9:00-18:00
              </span>
            </Button>

            <Button
              variant="secondary"
              className="h-auto py-4 flex flex-col gap-2"
              onClick={() => window.location.href = 'mailto:support@bivid.app'}
            >
              <Mail className="w-6 h-6" />
              <span>メールサポート</span>
              <span className="text-sm text-elder-text-muted">
                24時間受付
              </span>
            </Button>
          </div>

          <div className="flex items-center gap-4 text-sm text-elder-text-muted">
            <span>最終更新: {metadata.lastUpdated}</span>
            {metadata.version && (
              <span>バージョン: {metadata.version}</span>
            )}
          </div>
        </div>

        <Card className="p-8">
          <MarkdownContent content={content} />
        </Card>
      </div>
    </div>
  )
}