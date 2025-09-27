// ScheduleCalendar のテスト
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { ScheduleCalendar } from '../ScheduleCalendar'
import { DailyAvailability, AvailabilityStatus } from '@/types/schedule'

const mockAvailability: DailyAvailability[] = [
  {
    date: '2025-10-01',
    status: 'all_day',
    updatedAt: new Date()
  },
  {
    date: '2025-10-02',
    status: 'am',
    updatedAt: new Date()
  },
  {
    date: '2025-10-03',
    status: 'pm',
    updatedAt: new Date()
  },
  {
    date: '2025-10-04',
    status: 'none',
    updatedAt: new Date()
  }
]

const mockOnStatusChange = jest.fn().mockResolvedValue(undefined)
const mockOnMonthChange = jest.fn()

const defaultProps = {
  availability: mockAvailability,
  onStatusChange: mockOnStatusChange,
  isLoading: false,
  year: 2025,
  month: 10,
  onMonthChange: mockOnMonthChange
}

describe('ScheduleCalendar', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('正しくレンダリングされる', () => {
    render(<ScheduleCalendar {...defaultProps} />)

    expect(screen.getByText('スケジュール管理')).toBeInTheDocument()
    expect(screen.getByText('2025年10月')).toBeInTheDocument()
    expect(screen.getByText('空き状況を設定して、あなたに合った活動をおすすめします。')).toBeInTheDocument()
  })

  it('月移動ボタンが正しく動作する', async () => {
    const user = userEvent.setup()
    render(<ScheduleCalendar {...defaultProps} />)

    const prevButton = screen.getByRole('button', { name: /前月/ })
    const nextButton = screen.getByRole('button', { name: /翌月/ })

    await user.click(prevButton)
    expect(mockOnMonthChange).toHaveBeenCalledWith(2025, 9)

    await user.click(nextButton)
    expect(mockOnMonthChange).toHaveBeenCalledWith(2025, 11)
  })

  it('年をまたぐ月移動が正しく動作する', async () => {
    const user = userEvent.setup()
    const januaryProps = { ...defaultProps, month: 1 }
    render(<ScheduleCalendar {...januaryProps} />)

    const prevButton = screen.getByRole('button', { name: /前月/ })
    await user.click(prevButton)
    expect(mockOnMonthChange).toHaveBeenCalledWith(2024, 12)
  })

  it('「今日」ボタンが正しく動作する', async () => {
    const user = userEvent.setup()
    render(<ScheduleCalendar {...defaultProps} />)

    const todayButton = screen.getByRole('button', { name: /今日/ })
    await user.click(todayButton)

    const today = new Date()
    expect(mockOnMonthChange).toHaveBeenCalledWith(
      today.getFullYear(),
      today.getMonth() + 1
    )
  })

  it('曜日ヘッダーが表示される', () => {
    render(<ScheduleCalendar {...defaultProps} />)

    expect(screen.getByText('日')).toBeInTheDocument()
    expect(screen.getByText('月')).toBeInTheDocument()
    expect(screen.getByText('火')).toBeInTheDocument()
    expect(screen.getByText('水')).toBeInTheDocument()
    expect(screen.getByText('木')).toBeInTheDocument()
    expect(screen.getByText('金')).toBeInTheDocument()
    expect(screen.getByText('土')).toBeInTheDocument()
  })

  it('凡例が表示される', () => {
    render(<ScheduleCalendar {...defaultProps} />)

    expect(screen.getByText('○（終日）')).toBeInTheDocument()
    expect(screen.getByText('△（午前）')).toBeInTheDocument()
    expect(screen.getByText('▽（午後）')).toBeInTheDocument()
    expect(screen.getByText('×（不可）')).toBeInTheDocument()
  })

  it('空き状況が正しく表示される', () => {
    render(<ScheduleCalendar {...defaultProps} />)

    // 10月1日の○マークを探す
    const day1Button = screen.getByRole('button', { name: /2025-10-01/ })
    expect(day1Button).toHaveTextContent('○')

    // 10月2日の△マークを探す
    const day2Button = screen.getByRole('button', { name: /2025-10-02/ })
    expect(day2Button).toHaveTextContent('△')

    // 10月3日の▽マークを探す
    const day3Button = screen.getByRole('button', { name: /2025-10-03/ })
    expect(day3Button).toHaveTextContent('▽')

    // 10月4日の×マークを探す
    const day4Button = screen.getByRole('button', { name: /2025-10-04/ })
    expect(day4Button).toHaveTextContent('×')
  })

  it('日付クリックでステータスが変更される', async () => {
    const user = userEvent.setup()
    render(<ScheduleCalendar {...defaultProps} />)

    // 設定されていない日付（10月5日）をクリック
    const day5Buttons = screen.getAllByText('5')
    const day5Button = day5Buttons.find(button =>
      button.closest('button')?.getAttribute('aria-label')?.includes('2025-10-05')
    )?.closest('button')

    if (day5Button) {
      await user.click(day5Button)

      await waitFor(() => {
        expect(mockOnStatusChange).toHaveBeenCalledWith('2025-10-05', 'all_day')
      })
    }
  })

  it('ステータスの循環が正しく動作する', async () => {
    const user = userEvent.setup()
    render(<ScheduleCalendar {...defaultProps} />)

    // 10月1日（終日）をクリック → 午前に変わる
    const day1Button = screen.getByRole('button', { name: /2025-10-01/ })
    await user.click(day1Button)

    await waitFor(() => {
      expect(mockOnStatusChange).toHaveBeenCalledWith('2025-10-01', 'am')
    })
  })

  it('ローディング中はボタンが無効になる', () => {
    const loadingProps = { ...defaultProps, isLoading: true }
    render(<ScheduleCalendar {...loadingProps} />)

    const prevButton = screen.getByRole('button', { name: /前月/ })
    const nextButton = screen.getByRole('button', { name: /翌月/ })
    const todayButton = screen.getByRole('button', { name: /今日/ })

    expect(prevButton).toBeDisabled()
    expect(nextButton).toBeDisabled()
    expect(todayButton).toBeDisabled()
  })

  it('当月以外の日付は無効になる', () => {
    render(<ScheduleCalendar {...defaultProps} />)

    // 9月の日付を探す（月の最初の方に表示される）
    const allButtons = screen.getAllByRole('button')
    const dateButtons = allButtons.filter(button =>
      button.getAttribute('aria-label')?.includes('2025-09-')
    )

    dateButtons.forEach(button => {
      expect(button).toBeDisabled()
    })
  })

  it('使い方の説明が表示される', () => {
    render(<ScheduleCalendar {...defaultProps} />)

    expect(screen.getByText('使い方:')).toBeInTheDocument()
    expect(screen.getByText(/日付をクリックすると、空き状況が/)).toBeInTheDocument()
    expect(screen.getByText(/○（終日）: 9:00-17:00 の活動に参加できます/)).toBeInTheDocument()
  })

  it('aria-labelが正しく設定される', () => {
    render(<ScheduleCalendar {...defaultProps} />)

    const day1Button = screen.getByRole('button', { name: /2025-10-01/ })
    expect(day1Button).toHaveAttribute('aria-label', expect.stringContaining('2025-10-01'))
    expect(day1Button).toHaveAttribute('aria-label', expect.stringContaining('○（終日）'))

    const day2Button = screen.getByRole('button', { name: /2025-10-02/ })
    expect(day2Button).toHaveAttribute('aria-label', expect.stringContaining('△（午前）'))
  })

  it('aria-pressedが正しく設定される', () => {
    render(<ScheduleCalendar {...defaultProps} />)

    const day1Button = screen.getByRole('button', { name: /2025-10-01/ })
    expect(day1Button).toHaveAttribute('aria-pressed', 'true')

    // 設定されていない日付
    const unsetButtons = screen.getAllByRole('button').filter(button =>
      button.getAttribute('aria-label')?.includes('設定なし')
    )

    if (unsetButtons.length > 0) {
      expect(unsetButtons[0]).toHaveAttribute('aria-pressed', 'false')
    }
  })

  it('今日の日付がハイライトされる', () => {
    // 今日の日付を取得
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]

    // 今日が10月の場合のテスト
    if (today.getMonth() === 9 && today.getFullYear() === 2025) {
      render(<ScheduleCalendar {...defaultProps} />)

      const todayButton = screen.getByRole('button', { name: new RegExp(todayStr) })
      expect(todayButton).toHaveClass('ring-2', 'ring-blue-400')
    }
  })

  it('エラー時でもUIが正常に動作する', async () => {
    const errorOnStatusChange = jest.fn().mockRejectedValue(new Error('更新エラー'))
    const errorProps = { ...defaultProps, onStatusChange: errorOnStatusChange }
    const user = userEvent.setup()

    render(<ScheduleCalendar {...errorProps} />)

    const day1Button = screen.getByRole('button', { name: /2025-10-01/ })
    await user.click(day1Button)

    await waitFor(() => {
      expect(errorOnStatusChange).toHaveBeenCalled()
    })

    // エラー後もボタンは使用可能
    expect(day1Button).not.toBeDisabled()
  })
})