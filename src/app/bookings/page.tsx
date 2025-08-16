'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar,
  List,
  BarChart3,
  Settings,
  Download,
  Plus,
  Filter
} from 'lucide-react';
import { Booking, BookingStatus } from '@/types/booking';
import { BookingList } from '@/components/booking/BookingList';
import { BookingCalendar } from '@/components/booking/BookingCalendar';
import { useAuth } from '@/hooks/useAuth';

type ViewMode = 'list' | 'calendar' | 'analytics';

export default function BookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [userRole, setUserRole] = useState<'student' | 'teacher'>('student');

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`/api/bookings?role=${userRole}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('予約情報の取得に失敗しました');
      }

      const data = await response.json();
      setBookings(data.bookings);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予約情報の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    bookingId: string,
    status: BookingStatus,
    notes?: string
  ) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, teacherNotes: notes }),
      });

      if (!response.ok) {
        throw new Error('ステータスの更新に失敗しました');
      }

      // 予約リストを更新
      await fetchBookings();
      alert('ステータスを更新しました');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'ステータスの更新に失敗しました');
    }
  };

  const handleCancel = async (bookingId: string, reason: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}?reason=${encodeURIComponent(reason)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('キャンセルに失敗しました');
      }

      const data = await response.json();
      
      // 予約リストを更新
      await fetchBookings();
      
      if (data.refund && data.refund.refundAmount > 0) {
        alert(`予約をキャンセルしました。返金額: ¥${data.refund.refundAmount.toLocaleString()}`);
      } else {
        alert('予約をキャンセルしました。');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'キャンセルに失敗しました');
    }
  };

  const handleViewDetails = (booking: Booking) => {
    // 詳細モーダルを表示（実装は省略）
    alert(`予約詳細: ${booking.id}`);
  };

  const convertBookingsToCalendarEvents = (bookings: Booking[]) => {
    return bookings.map(booking => ({
      id: booking.id,
      title: `${booking.contactInfo.name} (${booking.participantCount}名)`,
      start: booking.scheduledAt.toDate(),
      end: new Date(booking.scheduledAt.toDate().getTime() + booking.duration * 60000),
      status: booking.status,
      participantCount: booking.participantCount,
      maxCapacity: 10, // 仮の値
      isAvailable: booking.status !== 'cancelled',
    }));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">ログインが必要です</h1>
          <a
            href="/login"
            className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
          >
            ログインする
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">予約管理</h1>
              <p className="text-gray-600 mt-2">
                {userRole === 'teacher' ? '主催している活動の予約を管理' : 'あなたの予約履歴'}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* ロール切り替え */}
              <div className="flex bg-white border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setUserRole('student')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    userRole === 'student'
                      ? 'bg-orange-600 text-white'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  参加者として
                </button>
                <button
                  onClick={() => setUserRole('teacher')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    userRole === 'teacher'
                      ? 'bg-orange-600 text-white'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  主催者として
                </button>
              </div>

              {/* エクスポートボタン */}
              <button className="flex items-center space-x-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                <span>エクスポート</span>
              </button>
            </div>
          </div>

          {/* ビュー切り替え */}
          <div className="flex bg-white border border-gray-300 rounded-lg p-1 w-fit">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <List className="w-4 h-4" />
              <span>リスト表示</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>カレンダー表示</span>
            </button>
            <button
              onClick={() => setViewMode('analytics')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'analytics'
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>分析</span>
            </button>
          </div>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchBookings}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              再試行
            </button>
          </div>
        )}

        {/* メインコンテンツ */}
        {viewMode === 'list' && (
          <BookingList
            bookings={bookings}
            userRole={userRole}
            onStatusUpdate={handleStatusUpdate}
            onViewDetails={handleViewDetails}
            onCancel={handleCancel}
            loading={loading}
          />
        )}

        {viewMode === 'calendar' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <BookingCalendar
              events={convertBookingsToCalendarEvents(bookings)}
              onSelectEvent={(event) => {
                const booking = bookings.find(b => b.id === event.id);
                if (booking) handleViewDetails(booking);
              }}
              selectable={false}
              className="min-h-96"
            />
          </div>
        )}

        {viewMode === 'analytics' && (
          <div className="space-y-6">
            {/* 分析画面のプレースホルダー */}
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">分析機能</h3>
              <p className="text-gray-500">予約データの分析機能は今後実装予定です。</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}