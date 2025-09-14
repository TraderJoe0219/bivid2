'use client'

import React from 'react'
import { ChevronDown, MapPin, Star, Clock, TrendingUp, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export type SortOption = 'distance' | 'rating' | 'price' | 'newest' | 'relevance' | 'popularity'

interface SortingControlsProps {
  sortBy: SortOption
  onSortChange: (sortBy: SortOption) => void
  showDistanceSort?: boolean
  className?: string
}

const SORT_OPTIONS: { value: SortOption; label: string; icon: React.ReactNode; description: string }[] = [
  {
    value: 'relevance',
    label: '関連度順',
    icon: <TrendingUp className="w-4 h-4" />,
    description: '検索キーワードとの関連度が高い順'
  },
  {
    value: 'distance',
    label: '距離順',
    icon: <MapPin className="w-4 h-4" />,
    description: '現在地からの距離が近い順'
  },
  {
    value: 'rating',
    label: '評価順',
    icon: <Star className="w-4 h-4" />,
    description: '評価の高い順'
  },
  {
    value: 'price',
    label: '価格順',
    icon: <Clock className="w-4 h-4" />,
    description: '価格の安い順'
  },
  {
    value: 'newest',
    label: '新着順',
    icon: <Calendar className="w-4 h-4" />,
    description: '登録日の新しい順'
  },
  {
    value: 'popularity',
    label: '人気順',
    icon: <TrendingUp className="w-4 h-4" />,
    description: '予約数の多い順'
  }
]

export function SortingControls({
  sortBy,
  onSortChange,
  showDistanceSort = false,
  className
}: SortingControlsProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  // 距離ソートが無効な場合は選択肢から除外
  const availableOptions = showDistanceSort
    ? SORT_OPTIONS
    : SORT_OPTIONS.filter(option => option.value !== 'distance')

  const selectedOption = availableOptions.find(option => option.value === sortBy)

  const handleOptionClick = (value: SortOption) => {
    onSortChange(value)
    setIsOpen(false)
  }

  return (
    <div className={cn('relative', className)}>
      <Button
        variant="secondary"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full sm:w-auto justify-between min-w-[140px]"
        rightIcon={<ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />}
      >
        <div className="flex items-center gap-2">
          {selectedOption?.icon}
          <span className="text-sm">{selectedOption?.label}</span>
        </div>
      </Button>

      {isOpen && (
        <>
          {/* オーバーレイ */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* ドロップダウンメニュー */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-elder-border-medium rounded-elder shadow-lg z-20 min-w-[280px]">
            <div className="p-2">
              <div className="text-xs font-medium text-elder-text-muted px-3 py-2 border-b border-elder-border-light mb-2">
                並び替え
              </div>

              {availableOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleOptionClick(option.value)}
                  className={cn(
                    'w-full flex items-start gap-3 px-3 py-3 text-left rounded-md transition-colors',
                    'hover:bg-elder-bg-accent',
                    sortBy === option.value && 'bg-elder-interactive-primary bg-opacity-10 text-elder-interactive-primary'
                  )}
                >
                  <div className={cn(
                    'flex-shrink-0 mt-0.5',
                    sortBy === option.value ? 'text-elder-interactive-primary' : 'text-elder-text-muted'
                  )}>
                    {option.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className={cn(
                      'font-medium text-sm',
                      sortBy === option.value ? 'text-elder-interactive-primary' : 'text-elder-text-primary'
                    )}>
                      {option.label}
                    </div>
                    <div className="text-xs text-elder-text-muted mt-0.5">
                      {option.description}
                    </div>
                  </div>

                  {sortBy === option.value && (
                    <div className="flex-shrink-0 w-2 h-2 bg-elder-interactive-primary rounded-full mt-2" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}