import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export function Loading({ size = 'md', text = '読み込み中...', className }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  return (
    <div className={cn('flex flex-col items-center justify-center p-8', className)}>
      <Loader2 className={cn('animate-spin text-elder-interactive-primary', sizeClasses[size])} />
      <p className={cn('mt-4 text-elder-text-secondary', textSizeClasses[size])}>{text}</p>
    </div>
  )
}

// フルスクリーンローディング
export function FullScreenLoading({ text = '読み込み中...' }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-elder-bg-primary bg-opacity-95 flex items-center justify-center z-50">
      <div className="card text-center">
        <Loading size="lg" text={text} />
      </div>
    </div>
  )
}

// デフォルトエクスポート（既存コード互換性のため）
export default Loading
