'use client'

import React from 'react'
import { MapPin, Search, Zap, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface MapZeroStateProps {
  title?: string
  message?: string
  suggestions?: string[]
  onExpandSearch?: () => void
  onChangeCategory?: () => void
  onToggleOnline?: () => void
  className?: string
}

export function MapZeroState({
  title = '近くにまだ講座がありません',
  message = '検索エリアを広げるか、条件を変更してお試しください',
  suggestions = [
    '検索範囲を広げてみる',
    'カテゴリを変更してみる',
    'オンラインレッスンも含めて検索する'
  ],
  onExpandSearch,
  onChangeCategory,
  onToggleOnline,
  className
}: MapZeroStateProps) {
  return (
    <div className={`absolute inset-0 flex items-center justify-center p-4 pointer-events-none ${className}`}>
      <Card className="max-w-md w-full p-8 text-center bg-white shadow-lg pointer-events-auto">
        {/* アイコン */}
        <div className="text-elder-text-muted mb-6">
          <MapPin className="w-20 h-20 mx-auto" strokeWidth={1.5} />
        </div>

        {/* タイトル */}
        <h3 className="text-2xl font-bold text-elder-text-primary mb-4">
          {title}
        </h3>

        {/* メッセージ */}
        <p className="text-elder-text-muted mb-8 leading-relaxed">
          {message}
        </p>

        {/* 提案リスト */}
        <div className="space-y-3 mb-8">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-center text-sm text-elder-text-muted">
              <div className="w-2 h-2 bg-elder-interactive-primary rounded-full mr-3 flex-shrink-0" />
              <span>{suggestion}</span>
            </div>
          ))}
        </div>

        {/* アクションボタン */}
        <div className="space-y-3">
          {onExpandSearch && (
            <Button
              onClick={onExpandSearch}
              variant="primary"
              fullWidth
              leftIcon={<Search className="w-4 h-4" />}
            >
              検索範囲を広げる
            </Button>
          )}

          <div className="flex gap-2">
            {onChangeCategory && (
              <Button
                onClick={onChangeCategory}
                variant="secondary"
                className="flex-1"
                leftIcon={<Users className="w-4 h-4" />}
              >
                カテゴリ変更
              </Button>
            )}

            {onToggleOnline && (
              <Button
                onClick={onToggleOnline}
                variant="secondary"
                className="flex-1"
                leftIcon={<Zap className="w-4 h-4" />}
              >
                オンライン含む
              </Button>
            )}
          </div>
        </div>

        {/* ヒント */}
        <div className="mt-8 pt-6 border-t border-elder-border-light">
          <p className="text-xs text-elder-text-muted">
            💡 ヒント: より多くの結果を見つけるために、複数のキーワードで検索してみてください
          </p>
        </div>
      </Card>
    </div>
  )
}

interface MapEmptyStateProps {
  type?: 'no-results' | 'no-location' | 'loading-error'
  onRetry?: () => void
  onRequestLocation?: () => void
  className?: string
}

export function MapEmptyState({
  type = 'no-results',
  onRetry,
  onRequestLocation,
  className
}: MapEmptyStateProps) {
  const configs = {
    'no-results': {
      title: '検索結果が見つかりません',
      message: 'エリアや条件を変更して再度検索してみてください',
      icon: <Search className="w-20 h-20" strokeWidth={1.5} />,
      suggestions: [
        '検索キーワードを変更する',
        'カテゴリフィルターを確認する',
        '価格範囲を広げる'
      ],
      primaryAction: onRetry ? {
        label: '再検索',
        onClick: onRetry,
        icon: <Search className="w-4 h-4" />
      } : undefined
    },
    'no-location': {
      title: '位置情報が取得できません',
      message: '位置情報を有効にして、近くの講座を探しましょう',
      icon: <MapPin className="w-20 h-20" strokeWidth={1.5} />,
      suggestions: [
        'ブラウザの位置情報設定を確認',
        '手動で地域を選択',
        '全国から検索'
      ],
      primaryAction: onRequestLocation ? {
        label: '位置情報を有効にする',
        onClick: onRequestLocation,
        icon: <MapPin className="w-4 h-4" />
      } : undefined
    },
    'loading-error': {
      title: 'データの読み込みに失敗しました',
      message: 'ネットワーク接続を確認して、もう一度お試しください',
      icon: <Zap className="w-20 h-20" strokeWidth={1.5} />,
      suggestions: [
        'インターネット接続を確認',
        'ページを再読み込み',
        'しばらく待ってから再試行'
      ],
      primaryAction: onRetry ? {
        label: '再試行',
        onClick: onRetry,
        icon: <Zap className="w-4 h-4" />
      } : undefined
    }
  }

  const config = configs[type]

  return (
    <div className={`absolute inset-0 flex items-center justify-center p-4 pointer-events-none ${className}`}>
      <Card className="max-w-md w-full p-8 text-center bg-white shadow-lg pointer-events-auto">
        {/* アイコン */}
        <div className="text-elder-text-muted mb-6">
          {config.icon}
        </div>

        {/* タイトル */}
        <h3 className="text-2xl font-bold text-elder-text-primary mb-4">
          {config.title}
        </h3>

        {/* メッセージ */}
        <p className="text-elder-text-muted mb-8 leading-relaxed">
          {config.message}
        </p>

        {/* 提案リスト */}
        <div className="space-y-3 mb-8">
          {config.suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-center text-sm text-elder-text-muted">
              <div className="w-2 h-2 bg-elder-interactive-primary rounded-full mr-3 flex-shrink-0" />
              <span>{suggestion}</span>
            </div>
          ))}
        </div>

        {/* アクションボタン */}
        {config.primaryAction && (
          <Button
            onClick={config.primaryAction.onClick}
            variant="primary"
            fullWidth
            leftIcon={config.primaryAction.icon}
          >
            {config.primaryAction.label}
          </Button>
        )}
      </Card>
    </div>
  )
}