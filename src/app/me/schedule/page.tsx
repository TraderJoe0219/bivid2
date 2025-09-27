'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { ScheduleCalendar } from '@/components/schedule/ScheduleCalendar'
import { Loading } from '@/components/Loading'
import { DailyAvailability, AvailabilityStatus } from '@/types/schedule'

export default function SchedulePage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()

  // カレンダーの状態
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date()
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1
    }
  })

  const [availability, setAvailability] = useState<DailyAvailability[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 認証チェック
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  // 月が変わったときに空き状況を取得
  useEffect(() => {
    if (user) {
      fetchAvailability(currentDate.year, currentDate.month)
    }
  }, [user, currentDate])

  // 空き状況取得
  const fetchAvailability = async (year: number, month: number) => {
    try {
      setIsLoading(true)
      setError(null)

      const monthParam = `${year}-${month.toString().padStart(2, '0')}`
      const response = await fetch(`/api/availability?month=${monthParam}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('スケジュールの取得に失敗しました')
      }

      const result = await response.json()
      if (result.success) {
        setAvailability(result.data || [])
      } else {
        throw new Error(result.error || 'スケジュールの取得に失敗しました')
      }
    } catch (error) {
      console.error('スケジュール取得エラー:', error)
      setError(error instanceof Error ? error.message : 'エラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  // 月変更
  const handleMonthChange = useCallback((year: number, month: number) => {
    setCurrentDate({ year, month })
  }, [])

  // ステータス変更
  const handleStatusChange = useCallback(async (date: string, status: AvailabilityStatus) => {
    try {
      setIsUpdating(true)
      setError(null)

      const response = await fetch('/api/availability', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, status }),
      })

      if (!response.ok) {
        throw new Error('スケジュールの更新に失敗しました')
      }

      const result = await response.json()
      if (result.success) {
        // ローカル状態を更新
        setAvailability(prev => {
          const existing = prev.find(item => item.date === date)
          if (existing) {
            // 既存の項目を更新
            return prev.map(item =>
              item.date === date
                ? { ...item, status, updatedAt: new Date() }
                : item
            )
          } else {
            // 新しい項目を追加
            return [...prev, {
              date,
              status,
              updatedAt: new Date()
            }]
          }
        })
      } else {
        throw new Error(result.error || 'スケジュールの更新に失敗しました')
      }
    } catch (error) {
      console.error('スケジュール更新エラー:', error)
      setError(error instanceof Error ? error.message : 'エラーが発生しました')
      throw error // ScheduleCalendar でエラーハンドリングするため再スロー
    } finally {
      setIsUpdating(false)
    }
  }, [])

  // 認証中の場合
  if (authLoading) {
    return <Loading />
  }

  // ユーザーが認証されていない場合
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* エラー表示 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-red-800">エラーが発生しました</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
              <button
                onClick={() => fetchAvailability(currentDate.year, currentDate.month)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                再試行
              </button>
            </div>
          </div>
        )}

        {/* スケジュールカレンダー */}
        <ScheduleCalendar
          availability={availability}
          onStatusChange={handleStatusChange}
          isLoading={isLoading || isUpdating}
          year={currentDate.year}
          month={currentDate.month}
          onMonthChange={handleMonthChange}
        />

        {/* 統計情報 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: '終日OK', status: 'all_day', color: 'bg-green-100 text-green-800' },
            { label: '午前OK', status: 'am', color: 'bg-yellow-100 text-yellow-800' },
            { label: '午後OK', status: 'pm', color: 'bg-blue-100 text-blue-800' },
            { label: '参加不可', status: 'none', color: 'bg-gray-100 text-gray-800' }
          ].map(({ label, status, color }) => {
            const count = availability.filter(item => item.status === status).length
            return (
              <div key={status} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">{label}</span>
                  <span className={`px-2 py-1 rounded-full text-sm font-semibold ${color}`}>
                    {count}日
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}