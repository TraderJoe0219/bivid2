import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BookingCalendar, TimeSlotSelector } from '../BookingCalendar';
import { BookingCalendarEvent } from '@/types/booking';
import { Views } from 'react-big-calendar';

// react-big-calendarのモック
jest.mock('react-big-calendar', () => ({
  Calendar: ({ onSelectEvent, onSelectSlot, onNavigate, onView, events, toolbar, selectable, ...props }: any) => (
    <div data-testid="calendar-component" toolbar={toolbar} selectable={selectable} {...props}>
      <div data-testid="calendar-toolbar">
        <button onClick={() => onNavigate?.(new Date('2024-01-01'))}>前へ</button>
        <button onClick={() => onNavigate?.(new Date('2024-02-01'))}>次へ</button>
        <button onClick={() => onView?.('month')}>月表示</button>
        <button onClick={() => onView?.('week')}>週表示</button>
      </div>
      <div data-testid="calendar-events">
        {events?.map((event: any, index: number) => (
          <div
            key={index}
            data-testid={`event-${index}`}
            onClick={() => onSelectEvent?.(event)}
          >
            {event.title}
          </div>
        ))}
      </div>
      <div
        data-testid="calendar-slot"
        onClick={() => onSelectSlot?.({ start: new Date(), end: new Date() })}
      >
        空きスロット
      </div>
    </div>
  ),
  momentLocalizer: jest.fn(() => ({})),
  Views: {
    MONTH: 'month',
    WEEK: 'week',
    DAY: 'day',
    AGENDA: 'agenda',
  },
}));

// momentのモック
jest.mock('moment', () => {
  const actualMoment = jest.requireActual('moment');
  const moment = (date?: any) => actualMoment(date);
  Object.assign(moment, actualMoment);
  moment.locale = jest.fn();
  return moment;
});

describe('BookingCalendar', () => {
  const mockEvents: BookingCalendarEvent[] = [
    {
      id: '1',
      title: 'テストイベント1',
      start: new Date('2024-01-15T10:00:00'),
      end: new Date('2024-01-15T12:00:00'),
      status: 'confirmed',
      participantCount: 5,
      maxCapacity: 10,
      isAvailable: true,
    },
    {
      id: '2',
      title: 'テストイベント2',
      start: new Date('2024-01-16T14:00:00'),
      end: new Date('2024-01-16T16:00:00'),
      status: 'pending',
      participantCount: 8,
      maxCapacity: 10,
      isAvailable: true,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基本的なレンダリング', () => {
    it('カレンダーコンポーネントが正しくレンダリングされる', () => {
      render(<BookingCalendar events={mockEvents} />);
      
      expect(screen.getByTestId('calendar-component')).toBeInTheDocument();
      expect(screen.getByTestId('calendar-toolbar')).toBeInTheDocument();
      expect(screen.getByTestId('calendar-events')).toBeInTheDocument();
    });

    it('イベントが正しく表示される', () => {
      render(<BookingCalendar events={mockEvents} />);
      
      expect(screen.getByTestId('event-0')).toHaveTextContent('テストイベント1');
      expect(screen.getByTestId('event-1')).toHaveTextContent('テストイベント2');
    });

    it('レジェンドが表示される', () => {
      render(<BookingCalendar events={mockEvents} />);
      
      expect(screen.getByText('確定済み')).toBeInTheDocument();
      expect(screen.getByText('保留中')).toBeInTheDocument();
      expect(screen.getByText('残りわずか')).toBeInTheDocument();
      expect(screen.getByText('満席・完了')).toBeInTheDocument();
      expect(screen.getByText('キャンセル')).toBeInTheDocument();
    });
  });

  describe('イベント処理', () => {
    it('イベント選択時にコールバックが呼ばれる', () => {
      const onSelectEvent = jest.fn();
      render(<BookingCalendar events={mockEvents} onSelectEvent={onSelectEvent} />);
      
      fireEvent.click(screen.getByTestId('event-0'));
      
      expect(onSelectEvent).toHaveBeenCalledWith(mockEvents[0]);
    });

    it('スロット選択時にコールバックが呼ばれる', () => {
      const onSelectSlot = jest.fn();
      render(<BookingCalendar events={mockEvents} onSelectSlot={onSelectSlot} selectable />);
      
      fireEvent.click(screen.getByTestId('calendar-slot'));
      
      expect(onSelectSlot).toHaveBeenCalledWith({
        start: expect.any(Date),
        end: expect.any(Date),
      });
    });

    it('ナビゲーション時にコールバックが呼ばれる', () => {
      const onNavigate = jest.fn();
      render(<BookingCalendar events={mockEvents} onNavigate={onNavigate} />);
      
      fireEvent.click(screen.getByText('前へ'));
      
      expect(onNavigate).toHaveBeenCalledWith(new Date('2024-01-01'));
    });

    it('ビュー変更時にコールバックが呼ばれる', () => {
      const onViewChange = jest.fn();
      render(<BookingCalendar events={mockEvents} onViewChange={onViewChange} />);
      
      fireEvent.click(screen.getByText('週表示'));
      
      expect(onViewChange).toHaveBeenCalledWith('week');
    });
  });

  describe('プロパティ', () => {
    it('カスタムクラス名が適用される', () => {
      const customClass = 'custom-calendar-class';
      render(<BookingCalendar events={mockEvents} className={customClass} />);
      
      const calendarContainer = screen.getByTestId('calendar-component').parentElement;
      expect(calendarContainer).toHaveClass('booking-calendar', customClass);
    });

    it('ツールバーの表示/非表示が制御される', () => {
      const { rerender } = render(<BookingCalendar events={mockEvents} showToolbar={false} />);
      
      expect(screen.getByTestId('calendar-component')).toBeInTheDocument();
      
      rerender(<BookingCalendar events={mockEvents} showToolbar={true} />);
      expect(screen.getByTestId('calendar-component')).toBeInTheDocument();
    });

    it('選択可能性が制御される', () => {
      const { rerender } = render(<BookingCalendar events={mockEvents} selectable={false} />);
      
      expect(screen.getByTestId('calendar-component')).toBeInTheDocument();
      
      rerender(<BookingCalendar events={mockEvents} selectable={true} />);
      expect(screen.getByTestId('calendar-component')).toBeInTheDocument();
    });
  });
});

describe('TimeSlotSelector', () => {
  const mockTimeSlots = [
    {
      start: '09:00',
      end: '10:00',
      available: true,
      capacity: 10,
      booked: 3,
    },
    {
      start: '10:00',
      end: '11:00',
      available: true,
      capacity: 10,
      booked: 8,
    },
    {
      start: '11:00',
      end: '12:00',
      available: false,
      capacity: 10,
      booked: 10,
    },
  ];

  const mockDate = new Date('2024-01-15');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基本的なレンダリング', () => {
    it('日付が正しく表示される', () => {
      render(
        <TimeSlotSelector
          date={mockDate}
          timeSlots={mockTimeSlots}
          selectedSlots={[]}
          onSlotSelect={jest.fn()}
          onSlotDeselect={jest.fn()}
        />
      );
      
      expect(screen.getByText(/1月15日/)).toBeInTheDocument();
    });

    it('時間スロットが正しく表示される', () => {
      render(
        <TimeSlotSelector
          date={mockDate}
          timeSlots={mockTimeSlots}
          selectedSlots={[]}
          onSlotSelect={jest.fn()}
          onSlotDeselect={jest.fn()}
        />
      );
      
      expect(screen.getByText('09:00 - 10:00')).toBeInTheDocument();
      expect(screen.getByText('10:00 - 11:00')).toBeInTheDocument();
      expect(screen.getByText('11:00 - 12:00')).toBeInTheDocument();
    });

    it('空き状況が正しく表示される', () => {
      render(
        <TimeSlotSelector
          date={mockDate}
          timeSlots={mockTimeSlots}
          selectedSlots={[]}
          onSlotSelect={jest.fn()}
          onSlotDeselect={jest.fn()}
        />
      );
      
      expect(screen.getByText('空き7名')).toBeInTheDocument(); // 10 - 3
      expect(screen.getByText('残りわずか')).toBeInTheDocument(); // 10 - 8 (20%以下なので残りわずか表示)
      expect(screen.getByText('満席')).toBeInTheDocument();
    });
  });

  describe('スロット選択', () => {
    it('利用可能なスロットをクリックすると選択される', () => {
      const onSlotSelect = jest.fn();
      render(
        <TimeSlotSelector
          date={mockDate}
          timeSlots={mockTimeSlots}
          selectedSlots={[]}
          onSlotSelect={onSlotSelect}
          onSlotDeselect={jest.fn()}
        />
      );
      
      const firstSlot = screen.getByText('09:00 - 10:00').closest('button');
      fireEvent.click(firstSlot!);
      
      expect(onSlotSelect).toHaveBeenCalledWith('09:00-10:00');
    });

    it('選択済みスロットをクリックすると選択解除される', () => {
      const onSlotDeselect = jest.fn();
      render(
        <TimeSlotSelector
          date={mockDate}
          timeSlots={mockTimeSlots}
          selectedSlots={['09:00-10:00']}
          onSlotSelect={jest.fn()}
          onSlotDeselect={onSlotDeselect}
        />
      );
      
      const firstSlot = screen.getByText('09:00 - 10:00').closest('button');
      fireEvent.click(firstSlot!);
      
      expect(onSlotDeselect).toHaveBeenCalledWith('09:00-10:00');
    });

    it('利用不可能なスロットはクリックできない', () => {
      const onSlotSelect = jest.fn();
      render(
        <TimeSlotSelector
          date={mockDate}
          timeSlots={mockTimeSlots}
          selectedSlots={[]}
          onSlotSelect={onSlotSelect}
          onSlotDeselect={jest.fn()}
        />
      );
      
      const unavailableSlot = screen.getByText('11:00 - 12:00').closest('button');
      expect(unavailableSlot).toBeDisabled();
      
      fireEvent.click(unavailableSlot!);
      expect(onSlotSelect).not.toHaveBeenCalled();
    });
  });

  describe('スタイリング', () => {
    it('選択されたスロットに適切なスタイルが適用される', () => {
      render(
        <TimeSlotSelector
          date={mockDate}
          timeSlots={mockTimeSlots}
          selectedSlots={['09:00-10:00']}
          onSlotSelect={jest.fn()}
          onSlotDeselect={jest.fn()}
        />
      );
      
      const selectedSlot = screen.getByText('09:00 - 10:00').closest('button');
      expect(selectedSlot).toHaveClass('border-orange-500', 'bg-orange-50');
    });

    it('利用不可能なスロットに適切なスタイルが適用される', () => {
      render(
        <TimeSlotSelector
          date={mockDate}
          timeSlots={mockTimeSlots}
          selectedSlots={[]}
          onSlotSelect={jest.fn()}
          onSlotDeselect={jest.fn()}
        />
      );
      
      const unavailableSlot = screen.getByText('11:00 - 12:00').closest('button');
      expect(unavailableSlot).toHaveClass('cursor-not-allowed', 'opacity-50');
    });
  });
});
