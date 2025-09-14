import { Metadata } from 'next'
import { getContentPage } from '@/lib/content'
import { MarkdownContent } from '@/components/MarkdownContent'
import { Card } from '@/components/ui/Card'
import { Shield, Lock, Eye, UserCheck } from 'lucide-react'

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getContentPage('privacy')

  return {
    title: `${metadata.title} | Bivid`,
    description: metadata.description,
    openGraph: {
      title: metadata.title,
      description: metadata.description || undefined,
    }
  }
}

export default async function PrivacyPage() {
  const { metadata, content } = await getContentPage('privacy')

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
              <Shield className="w-6 h-6 text-elder-success flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-elder-text-primary mb-1">
                  データ保護
                </h3>
                <p className="text-sm text-elder-text-muted">
                  最新のセキュリティ技術で個人情報を保護しています
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-elder-bg-accent rounded-elder">
              <Lock className="w-6 h-6 text-elder-success flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-elder-text-primary mb-1">
                  暗号化通信
                </h3>
                <p className="text-sm text-elder-text-muted">
                  全ての通信はSSL/TLSで暗号化されています
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-elder-bg-accent rounded-elder">
              <Eye className="w-6 h-6 text-elder-success flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-elder-text-primary mb-1">
                  透明性
                </h3>
                <p className="text-sm text-elder-text-muted">
                  データの利用目的を明確に開示しています
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-elder-bg-accent rounded-elder">
              <UserCheck className="w-6 h-6 text-elder-success flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-elder-text-primary mb-1">
                  利用者同意
                </h3>
                <p className="text-sm text-elder-text-muted">
                  利用者の同意なしにデータを第三者提供しません
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