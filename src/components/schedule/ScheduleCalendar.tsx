'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Calendar, Info } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import {
  AvailabilityStatus,
  DailyAvailability,
  AVAILABILITY_LABELS,
  AVAILABILITY_COLORS
} from '@/types/schedule'
import { cn } from '@/lib/utils'

interface CalendarDay {
  date: string
  day: number
  isCurrentMonth: boolean
  isToday: boolean
  status?: AvailabilityStatus
}

interface ScheduleCalendarProps {
  availability: DailyAvailability[]
  onStatusChange: (date: string, status: AvailabilityStatus) => Promise<void>
  isLoading?: boolean
  year: number
  month: number
  onMonthChange: (year: number, month: number) => void
}

export function ScheduleCalendar({
  availability,
  onStatusChange,
  isLoading = false,
  year,
  month,
  onMonthChange
}: ScheduleCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [updatingDates, setUpdatingDates] = useState<Set<string>>(new Set())

  // 空き状況のマップを作成
  const availabilityMap = useMemo(() => {
    const map = new Map<string, AvailabilityStatus>()
    availability.forEach(item => {
      map.set(item.date, item.status)
    })
    return map
  }, [availability])

  // カレンダーの日付を生成
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month - 1, 1)
    const lastDay = new Date(year, month, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay()) // 日曜日から開始

    const days: CalendarDay[] = []
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]

    for (let i = 0; i < 42; i++) { // 6週間分
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)

      const dateStr = date.toISOString().split('T')[0]
      const isCurrentMonth = date.getMonth() === month - 1

      days.push({
        date: dateStr,
        day: date.getDate(),
        isCurrentMonth,
        isToday: dateStr === todayStr,
        status: availabilityMap.get(dateStr)
      })
    }

    return days
  }, [year, month, availabilityMap])

  // ステータス変更
  const handleStatusChange = useCallback(async (date: string, newStatus: AvailabilityStatus) => {
    if (updatingDates.has(date)) return

    try {
      setUpdatingDates(prev => new Set(prev).add(date))
      await onStatusChange(date, newStatus)
    } catch (error) {
      console.error('スケジュール更新エラー:', error)
    } finally {
      setUpdatingDates(prev => {
        const newSet = new Set(prev)
        newSet.delete(date)
        return newSet
      })
    }
  }, [onStatusChange, updatingDates])

  // ステータスの循環（○ → △ → ▽ → × → ○）
  const getNextStatus = (currentStatus?: AvailabilityStatus): AvailabilityStatus => {
    switch (currentStatus) {
      case 'all_day': return 'am'
      case 'am': return 'pm'
      case 'pm': return 'none'
      case 'none': return 'all_day'
      default: return 'all_day'
    }
  }

  // 月移動
  const goToPreviousMonth = () => {
    if (month === 1) {
      onMonthChange(year - 1, 12)
    } else {
      onMonthChange(year, month - 1)
    }
  }

  const goToNextMonth = () => {
    if (month === 12) {
      onMonthChange(year + 1, 1)
    } else {
      onMonthChange(year, month + 1)
    }
  }

  const goToToday = () => {
    const today = new Date()
    onMonthChange(today.getFullYear(), today.getMonth() + 1)
  }

  const monthName = `${year}年${month}月`

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ヘッダー */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-blue-500" />
              スケジュール管理
            </h1>
            <p className="text-gray-600 mt-1">
              空き状況を設定して、あなたに合った活動をおすすめします。
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={goToPreviousMonth}
              disabled={isLoading}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              前月
            </Button>

            <div className="text-lg font-semibold text-gray-900 min-w-[120px] text-center">
              {monthName}
            </div>

            <Button
              variant="ghost"
              onClick={goToNextMonth}
              disabled={isLoading}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              翌月
            </Button>

            <Button
              variant="secondary"
              onClick={goToToday}
              disabled={isLoading}
            >
              今日
            </Button>
          </div>
        </div>
      </Card>

      {/* 凡例 */}
      <Card className="p-4">
        <div className="flex items-center justify-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">凡例:</span>
          </div>
          {Object.entries(AVAILABILITY_LABELS).map(([status, label]) => (
            <div key={status} className="flex items-center gap-2">
              <div className={cn(
                'w-6 h-6 rounded border flex items-center justify-center text-xs font-bold',
                AVAILABILITY_COLORS[status as AvailabilityStatus]
              )}>
                {status === 'all_day' ? '○' :
                 status === 'am' ? '△' :
                 status === 'pm' ? '▽' : '×'}
              </div>
              <span className="text-sm text-gray-700">{label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* カレンダー */}
      <Card className="p-6">
        <div className="grid grid-cols-7 gap-2">
          {/* 曜日ヘッダー */}
          {['日', '月', '火', '水', '木', '金', '土'].map((dayName, index) => (
            <div
              key={dayName}
              className={cn(
                'h-12 flex items-center justify-center text-sm font-semibold',
                index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-700'
              )}
            >
              {dayName}
            </div>
          ))}

          {/* カレンダーの日付 */}
          {calendarDays.map((day) => {
            const isUpdating = updatingDates.has(day.date)
            const isDisabled = !day.isCurrentMonth || isLoading || isUpdating

            return (
              <button
                key={day.date}
                onClick={() => {
                  if (!isDisabled) {
                    const nextStatus = getNextStatus(day.status)
                    handleStatusChange(day.date, nextStatus)
                  }
                }}
                disabled={isDisabled}
                className={cn(
                  'h-16 rounded-lg border-2 transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1',
                  'disabled:cursor-not-allowed',
                  // 基本スタイル
                  day.isCurrentMonth
                    ? 'border-gray-200 hover:border-blue-300'
                    : 'border-gray-100 bg-gray-50',
                  // 今日のハイライト
                  day.isToday && 'ring-2 ring-blue-400',
                  // ステータスによる色分け
                  day.status && day.isCurrentMonth
                    ? AVAILABILITY_COLORS[day.status]
                    : day.isCurrentMonth
                    ? 'bg-white hover:bg-gray-50'
                    : '',
                  // 更新中のスタイル
                  isUpdating && 'opacity-50 animate-pulse'
                )}
                aria-label={`${day.date} ${day.status ? AVAILABILITY_LABELS[day.status] : '設定なし'}`}
                aria-pressed={day.status ? 'true' : 'false'}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <span className={cn(
                    'text-lg font-semibold',
                    !day.isCurrentMonth && 'text-gray-400'
                  )}>
                    {day.day}
                  </span>
                  {day.status && day.isCurrentMonth && (
                    <span className="text-xs font-bold mt-1">
                      {day.status === 'all_day' ? '○' :
                       day.status === 'am' ? '△' :
                       day.status === 'pm' ? '▽' : '×'}
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </Card>

      {/* 使い方の説明 */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-2">使い方:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>日付をクリックすると、空き状況が ○ → △ → ▽ → × → ○ の順に変わります</li>
            <li>○（終日）: 9:00-17:00 の活動に参加できます</li>
            <li>△（午前）: 9:00-12:00 の活動に参加できます</li>
            <li>▽（午後）: 13:00-17:00 の活動に参加できます</li>
            <li>×（不可）: その日は活動に参加できません</li>
          </ul>
        </div>
      </Card>
    </div>
  )
}