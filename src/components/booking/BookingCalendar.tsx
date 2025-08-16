'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/ja';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  MapPin,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter
} from 'lucide-react';
import { BookingCalendarEvent } from '@/types/booking';

// 日本語設定
moment.locale('ja');
const localizer = momentLocalizer(moment);

interface BookingCalendarProps {
  events: BookingCalendarEvent[];
  onSelectEvent?: (event: BookingCalendarEvent) => void;
  onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void;
  onNavigate?: (date: Date) => void;
  onViewChange?: (view: View) => void;
  defaultView?: View;
  showToolbar?: boolean;
  selectable?: boolean;
  className?: string;
}

interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
  capacity: number;
  booked: number;
}

const messages = {
  allDay: '終日',
  previous: '前へ',
  next: '次へ',
  today: '今日',
  month: '月表示',
  week: '週表示',
  day: '日表示',
  agenda: '予定表',
  date: '日付',
  time: '時間',
  event: 'イベント',
  showMore: (total: number) => `他 ${total} 件`,
  noEventsInRange: 'この期間にイベントはありません',
};

export function BookingCalendar({
  events,
  onSelectEvent,
  onSelectSlot,
  onNavigate,
  onViewChange,
  defaultView = Views.MONTH,
  showToolbar = true,
  selectable = false,
  className = '',
}: BookingCalendarProps) {
  const [currentView, setCurrentView] = useState<View>(defaultView);
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleNavigate = useCallback((date: Date) => {
    setCurrentDate(date);
    onNavigate?.(date);
  }, [onNavigate]);

  const handleViewChange = useCallback((view: View) => {
    setCurrentView(view);
    onViewChange?.(view);
  }, [onViewChange]);

  const handleSelectEvent = useCallback((event: BookingCalendarEvent) => {
    onSelectEvent?.(event);
  }, [onSelectEvent]);

  const handleSelectSlot = useCallback((slotInfo: { start: Date; end: Date }) => {
    onSelectSlot?.(slotInfo);
  }, [onSelectSlot]);

  // イベントのスタイリング
  const eventStyleGetter = useCallback((event: BookingCalendarEvent) => {
    let backgroundColor = '#059669'; // green-600
    let borderColor = '#047857'; // green-700

    switch (event.status) {
      case 'pending':
        backgroundColor = '#d97706'; // amber-600
        borderColor = '#b45309'; // amber-700
        break;
      case 'confirmed':
        backgroundColor = '#059669'; // green-600
        borderColor = '#047857'; // green-700
        break;
      case 'completed':
        backgroundColor = '#6b7280'; // gray-500
        borderColor = '#4b5563'; // gray-600
        break;
      case 'cancelled':
        backgroundColor = '#dc2626'; // red-600
        borderColor = '#b91c1c'; // red-700
        break;
    }

    // 空きが少ない場合は警告色
    if (event.isAvailable && event.participantCount >= event.maxCapacity * 0.8) {
      backgroundColor = '#ea580c'; // orange-600
      borderColor = '#c2410c'; // orange-700
    }

    // 満席の場合
    if (!event.isAvailable || event.participantCount >= event.maxCapacity) {
      backgroundColor = '#6b7280'; // gray-500
      borderColor = '#4b5563'; // gray-600
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '4px',
        color: 'white',
        fontSize: '12px',
        padding: '2px 4px',
      },
    };
  }, []);

  // カスタムイベントコンポーネント
  const EventComponent = ({ event }: { event: BookingCalendarEvent }) => (
    <div className="text-xs">
      <div className="font-semibold truncate">{event.title}</div>
      <div className="flex items-center space-x-1 mt-1">
        <Users className="w-3 h-3" />
        <span>{event.participantCount}/{event.maxCapacity}</span>
        {!event.isAvailable && (
          <span className="bg-red-500 text-white px-1 rounded text-xs">満席</span>
        )}
      </div>
    </div>
  );

  const formats = useMemo(() => ({
    monthHeaderFormat: 'YYYY年M月',
    dayHeaderFormat: 'M月D日(ddd)',
    dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
      `${moment(start).format('M月D日')} - ${moment(end).format('M月D日')}`,
    agendaHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
      `${moment(start).format('M月D日')} - ${moment(end).format('M月D日')}`,
    selectRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
      `${moment(start).format('M月D日 HH:mm')} - ${moment(end).format('HH:mm')}`,
    agendaDateFormat: 'M月D日(ddd)',
    agendaTimeFormat: 'HH:mm',
    agendaTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
      `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`,
  }), []);

  return (
    <div className={`booking-calendar ${className}`}>
      <style jsx global>{`
        .rbc-calendar {
          font-family: inherit;
        }
        .rbc-toolbar {
          padding: 16px 0;
          margin-bottom: 16px;
          border-bottom: 1px solid #e5e7eb;
        }
        .rbc-btn-group {
          display: flex;
          gap: 4px;
        }
        .rbc-btn-group button {
          padding: 8px 16px;
          border: 1px solid #d1d5db;
          background: white;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }
        .rbc-btn-group button:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
        }
        .rbc-btn-group button.rbc-active {
          background: #ea580c;
          border-color: #ea580c;
          color: white;
        }
        .rbc-toolbar-label {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }
        .rbc-header {
          padding: 12px 8px;
          font-weight: 600;
          font-size: 14px;
          color: #374151;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }
        .rbc-date-cell {
          padding: 8px;
          font-size: 14px;
        }
        .rbc-date-cell.rbc-off-range-bg {
          background: #f9fafb;
          color: #9ca3af;
        }
        .rbc-today {
          background: #fef3c7;
        }
        .rbc-event {
          border-radius: 4px;
          padding: 2px 4px;
          font-size: 12px;
          line-height: 1.2;
        }
        .rbc-selected {
          outline: 2px solid #ea580c;
          outline-offset: 2px;
        }
        .rbc-slot-selection {
          background: rgba(234, 88, 12, 0.1);
          border: 1px solid #ea580c;
        }
      `}</style>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        view={currentView}
        onView={handleViewChange}
        date={currentDate}
        onNavigate={handleNavigate}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        selectable={selectable}
        eventPropGetter={eventStyleGetter}
        components={{
          event: EventComponent,
        }}
        formats={formats}
        messages={messages}
        showMultiDayTimes
        step={30}
        timeslots={2}
        toolbar={showToolbar}
        popup
        className="min-h-96"
      />

      {/* レジェンド */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-600 rounded"></div>
          <span>確定済み</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-amber-600 rounded"></div>
          <span>保留中</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-orange-600 rounded"></div>
          <span>残りわずか</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-500 rounded"></div>
          <span>満席・完了</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-600 rounded"></div>
          <span>キャンセル</span>
        </div>
      </div>
    </div>
  );
}

// 時間スロット選択用のサブコンポーネント
interface TimeSlotSelectorProps {
  date: Date;
  timeSlots: TimeSlot[];
  selectedSlots: string[];
  onSlotSelect: (slot: string) => void;
  onSlotDeselect: (slot: string) => void;
}

export function TimeSlotSelector({
  date,
  timeSlots,
  selectedSlots,
  onSlotSelect,
  onSlotDeselect,
}: TimeSlotSelectorProps) {
  const handleSlotClick = (slot: TimeSlot) => {
    const slotKey = `${slot.start}-${slot.end}`;
    if (selectedSlots.includes(slotKey)) {
      onSlotDeselect(slotKey);
    } else {
      onSlotSelect(slotKey);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-lg font-semibold">
        <CalendarIcon className="w-5 h-5" />
        <span>{moment(date).format('M月D日(ddd)')}</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {timeSlots.map((slot, index) => {
          const slotKey = `${slot.start}-${slot.end}`;
          const isSelected = selectedSlots.includes(slotKey);
          const availabilityRate = (slot.capacity - slot.booked) / slot.capacity;
          
          let statusColor = 'bg-green-50 border-green-200 text-green-800';
          let statusText = `空き${slot.capacity - slot.booked}名`;
          
          if (!slot.available || slot.booked >= slot.capacity) {
            statusColor = 'bg-gray-50 border-gray-300 text-gray-500';
            statusText = '満席';
          } else if (availabilityRate <= 0.2) {
            statusColor = 'bg-red-50 border-red-200 text-red-800';
            statusText = '残りわずか';
          } else if (availabilityRate <= 0.5) {
            statusColor = 'bg-orange-50 border-orange-200 text-orange-800';
            statusText = `空き${slot.capacity - slot.booked}名`;
          }

          return (
            <button
              key={index}
              onClick={() => slot.available && handleSlotClick(slot)}
              disabled={!slot.available || slot.booked >= slot.capacity}
              className={`p-3 border rounded-lg transition-all text-left ${
                isSelected
                  ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200'
                  : statusColor
              } ${
                !slot.available || slot.booked >= slot.capacity
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:shadow-sm cursor-pointer'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <Clock className="w-4 h-4" />
                <span className="font-medium">
                  {slot.start} - {slot.end}
                </span>
              </div>
              <div className="text-xs">{statusText}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}