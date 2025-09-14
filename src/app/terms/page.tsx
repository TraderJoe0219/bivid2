import { Metadata } from 'next'
import { getContentPage } from '@/lib/content'
import { MarkdownContent } from '@/components/MarkdownContent'
import { Card } from '@/components/ui/Card'
import { FileText, Scale, AlertTriangle, CheckCircle } from 'lucide-react'

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getContentPage('terms')

  return {
    title: `${metadata.title} | Bivid`,
    description: metadata.description,
    openGraph: {
      title: metadata.title,
      description: metadata.description || undefined,
    }
  }
}

export default async function TermsPage() {
  const { metadata, content } = await getContentPage('terms')

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="flex items-start gap-3 p-4 bg-elder-bg-accent rounded-elder">
              <FileText className="w-6 h-6 text-elder-interactive-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-elder-text-primary mb-1">
                  利用規約
                </h3>
                <p className="text-sm text-elder-text-muted">
                  サービス利用に関する基本的なルールです
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-elder-bg-accent rounded-elder">
              <Scale className="w-6 h-6 text-elder-interactive-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-elder-text-primary mb-1">
                  法的効力
                </h3>
                <p className="text-sm text-elder-text-muted">
                  本規約は法的な拘束力を持ちます
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-elder-bg-accent rounded-elder">
              <AlertTriangle className="w-6 h-6 text-elder-warning flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-elder-text-primary mb-1">
                  禁止事項
                </h3>
                <p className="text-sm text-elder-text-muted">
                  サービス利用時の禁止行為を定めています
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-elder-bg-accent rounded-elder">
              <CheckCircle className="w-6 h-6 text-elder-success flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-elder-text-primary mb-1">
                  適正な利用
                </h3>
                <p className="text-sm text-elder-text-muted">
                  安全で快適なサービス環境を保ちます
                </p>
              </div>
            </div>
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