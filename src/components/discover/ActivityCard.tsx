'use client'

import React from 'react'
import { Clock, MapPin, Users, Star, ExternalLink, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { RecommendationResult } from '@/types/recommendations'
import { cn } from '@/lib/utils'

interface ActivityCardProps {
  recommendation: RecommendationResult
  onJoin?: (activityId: string) => Promise<void>
  onViewDetails?: (activityId: string) => void
  isJoining?: boolean
}

export function ActivityCard({
  recommendation,
  onJoin,
  onViewDetails,
  isJoining = false
}: ActivityCardProps) {
  const { activity, score, reasons, distance, timeMatch, tagMatches } = recommendation

  // 日時の表示用フォーマット
  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()

    return {
      date: `${month}/${day}`,
      time: `${hour}:${minute.toString().padStart(2, '0')}`
    }
  }

  const startDateTime = formatDateTime(activity.start)
  const endDateTime = formatDateTime(activity.end)

  // カテゴリの色分け
  const getCategoryColor = (category: string) => {
    const colors = {
      'ボランティア': 'bg-green-100 text-green-800',
      '学び': 'bg-blue-100 text-blue-800',
      '生活支援': 'bg-orange-100 text-orange-800',
      '健康・運動': 'bg-red-100 text-red-800',
      '文化・趣味': 'bg-purple-100 text-purple-800',
      '交流・イベント': 'bg-pink-100 text-pink-800',
      '地域活動': 'bg-teal-100 text-teal-800',
      'その他': 'bg-gray-100 text-gray-800'
    }
    return colors[category as keyof typeof colors] || colors['その他']
  }

  // 推奨度の表示
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600'
    if (score >= 5) return 'text-yellow-600'
    return 'text-gray-600'
  }

  const handleJoin = async () => {
    if (onJoin) {
      await onJoin(activity.id)
    }
  }

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(activity.id)
    } else if (activity.url) {
      window.open(activity.url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="space-y-4">
        {/* ヘッダー */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {activity.title}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <span className={cn(
                'px-2 py-1 rounded-full text-xs font-medium',
                getCategoryColor(activity.category)
              )}>
                {activity.category}
              </span>
              {activity.org && (
                <span className="text-sm text-gray-600">
                  主催: {activity.org}
                </span>
              )}
            </div>
          </div>

          {/* 推奨度スコア */}
          <div className="text-right">
            <div className="flex items-center gap-1">
              <Star className={cn('w-4 h-4', getScoreColor(score))} />
              <span className={cn('text-sm font-semibold', getScoreColor(score))}>
                {score.toFixed(1)}
              </span>
            </div>
            <div className="text-xs text-gray-500">推奨度</div>
          </div>
        </div>

        {/* 活動詳細 */}
        <div className="space-y-3">
          {/* 日時 */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span>
              {startDateTime.date} {startDateTime.time}〜{endDateTime.time}
            </span>
            {timeMatch && (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                時間帯一致
              </span>
            )}
          </div>

          {/* 場所 */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <MapPin className="w-4 h-4 text-red-500" />
            <span>{activity.location.address}</span>
            {distance && (
              <span className="text-gray-500">
                （約{distance.toFixed(1)}km）
              </span>
            )}
          </div>

          {/* 参加者数 */}
          {activity.maxParticipants && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Users className="w-4 h-4 text-green-500" />
              <span>
                {activity.currentParticipants || 0}/{activity.maxParticipants}人
              </span>
            </div>
          )}

          {/* 費用 */}
          {activity.cost !== undefined && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="w-4 h-4 flex items-center justify-center text-yellow-600">¥</span>
              <span>
                {activity.cost === 0 ? '無料' : `${activity.cost.toLocaleString()}円`}
              </span>
            </div>
          )}
        </div>

        {/* 活動の説明 */}
        {activity.description && (
          <p className="text-sm text-gray-600 line-clamp-3">
            {activity.description}
          </p>
        )}

        {/* マッチしたタグ */}
        {tagMatches && tagMatches.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-700">あなたの興味と一致:</div>
            <div className="flex flex-wrap gap-1">
              {tagMatches.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* レコメンド理由 */}
        {reasons.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-700">おすすめの理由:</div>
            <div className="space-y-1">
              {reasons.slice(0, 3).map((reason, index) => (
                <div key={index} className="text-xs text-gray-600 flex items-center gap-1">
                  <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                  <span>{reason.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* アクションボタン */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleJoin}
            loading={isJoining}
            disabled={
              activity.maxParticipants &&
              (activity.currentParticipants || 0) >= activity.maxParticipants
            }
            className="flex-1"
          >
            {activity.maxParticipants &&
            (activity.currentParticipants || 0) >= activity.maxParticipants
              ? '満員'
              : '参加する'}
          </Button>

          <Button
            variant="secondary"
            onClick={handleViewDetails}
            rightIcon={<ExternalLink className="w-4 h-4" />}
          >
            詳細
          </Button>
        </div>
      </div>
    </Card>
  )
}