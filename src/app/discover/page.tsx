'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { ActivityCard } from '@/components/discover/ActivityCard'
import { Loading } from '@/components/Loading'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import {
  Compass,
  Calendar,
  Filter,
  RefreshCw,
  MapPin,
  Settings,
  AlertCircle
} from 'lucide-react'
import { RecommendationResult, SortOption, SORT_OPTIONS } from '@/types/recommendations'
import { NO_RECOMMENDATIONS_HINTS } from '@/types/recommendations'
import { cn } from '@/lib/utils'

export default function DiscoverPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()

  // フィルタと検索の状態
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0]
  })
  const [sortBy, setSortBy] = useState<SortOption>('recommendation')
  const [showFilters, setShowFilters] = useState(false)

  // データの状態
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([])
  const [userAvailability, setUserAvailability] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 参加処理の状態
  const [joiningActivities, setJoiningActivities] = useState<Set<string>>(new Set())

  // 認証チェック
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  // レコメンド取得
  useEffect(() => {
    if (user) {
      fetchRecommendations()
    }
  }, [user, selectedDate, sortBy])

  const fetchRecommendations = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const params = new URLSearchParams({
        date: selectedDate,
        sortBy,
        limit: '20'
      })

      const response = await fetch(`/api/recommendations?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('おすすめ活動の取得に失敗しました')
      }

      const result = await response.json()
      if (result.success && result.data) {
        setRecommendations(result.data.recommendations || [])
        setUserAvailability(result.data.userAvailability || '')
      } else {
        throw new Error(result.error || 'おすすめ活動の取得に失敗しました')
      }
    } catch (error) {
      console.error('レコメンド取得エラー:', error)
      setError(error instanceof Error ? error.message : 'エラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  // 手動リフレッシュ
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    await fetchRecommendations()
    setIsRefreshing(false)
  }, [fetchRecommendations])

  // 活動への参加
  const handleJoinActivity = useCallback(async (activityId: string) => {
    try {
      setJoiningActivities(prev => new Set(prev).add(activityId))

      // 実際のAPIエンドポイントがある場合はここで呼び出し
      // const response = await fetch('/api/activities/join', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ activityId })
      // })

      // とりあえずダミー処理
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 成功通知（実装時はトーストなどを使用）
      console.log('活動に参加しました:', activityId)

    } catch (error) {
      console.error('参加エラー:', error)
      setError('参加申し込みに失敗しました')
    } finally {
      setJoiningActivities(prev => {
        const newSet = new Set(prev)
        newSet.delete(activityId)
        return newSet
      })
    }
  }, [])

  // 活動詳細表示
  const handleViewDetails = useCallback((activityId: string) => {
    // 詳細ページがある場合
    // router.push(`/activities/${activityId}`)
    console.log('活動詳細:', activityId)
  }, [])

  // 日付変更
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value)
  }

  // 認証中の場合
  if (authLoading) {
    return <Loading />
  }

  // ユーザーが認証されていない場合
  if (!user) {
    return null
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()]
    return `${month}/${day}（${dayOfWeek}）`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <Card className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Compass className="w-6 h-6 mr-2 text-purple-500" />
                  おすすめ活動
                </h1>
                <p className="text-gray-600 mt-1">
                  あなたのスケジュールと興味に合った活動をご提案します
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={handleRefresh}
                  loading={isRefreshing}
                  leftIcon={<RefreshCw className="w-4 h-4" />}
                >
                  更新
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => setShowFilters(!showFilters)}
                  leftIcon={<Filter className="w-4 h-4" />}
                >
                  フィルタ
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* フィルタパネル */}
        {showFilters && (
          <Card className="p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 日付選択 */}
              <div>
                <Input
                  type="date"
                  label="日付"
                  value={selectedDate}
                  onChange={handleDateChange}
                  leftIcon={<Calendar className="w-4 h-4" />}
                />
              </div>

              {/* ソート順 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  並び順
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className={cn(
                    'w-full px-4 py-3 text-base min-h-touch rounded-elder border',
                    'bg-elder-bg-primary',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-elder-interactive-primary focus-visible:ring-offset-1',
                    'border-elder-border-medium focus-visible:border-elder-interactive-primary'
                  )}
                >
                  {Object.entries(SORT_OPTIONS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* プロフィール設定へのリンク */}
              <div className="flex items-end">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/me')}
                  leftIcon={<Settings className="w-4 h-4" />}
                  fullWidth
                >
                  プロフィール設定
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* エラー表示 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="font-medium text-red-800">エラーが発生しました</span>
              </div>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                再試行
              </button>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        )}

        {/* 状況表示 */}
        <div className="mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span className="font-medium text-gray-900">
                    {formatDate(selectedDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    'w-3 h-3 rounded-full',
                    userAvailability === 'all_day' ? 'bg-green-500' :
                    userAvailability === 'am' ? 'bg-yellow-500' :
                    userAvailability === 'pm' ? 'bg-blue-500' :
                    'bg-gray-500'
                  )}></div>
                  <span className="text-sm text-gray-600">
                    空き状況: {
                      userAvailability === 'all_day' ? '終日OK' :
                      userAvailability === 'am' ? '午前OK' :
                      userAvailability === 'pm' ? '午後OK' :
                      '参加不可'
                    }
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {recommendations.length}件の活動
              </div>
            </div>
          </Card>
        </div>

        {/* メインコンテンツ */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loading />
          </div>
        ) : recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((recommendation) => (
              <ActivityCard
                key={recommendation.activity.id}
                recommendation={recommendation}
                onJoin={handleJoinActivity}
                onViewDetails={handleViewDetails}
                isJoining={joiningActivities.has(recommendation.activity.id)}
              />
            ))}
          </div>
        ) : (
          /* 0件の場合のヒント */
          <div className="text-center py-12">
            <div className="max-w-2xl mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <MapPin className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                おすすめの活動が見つかりませんでした
              </h3>
              <p className="text-gray-600 mb-8">
                以下のヒントを参考に設定を見直してみてください
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {NO_RECOMMENDATIONS_HINTS.map((hint, index) => (
                  <Card key={index} className="p-6 text-left">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {hint.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4">
                      {hint.description}
                    </p>
                    {hint.action && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => router.push(hint.action!.href)}
                      >
                        {hint.action.label}
                      </Button>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}