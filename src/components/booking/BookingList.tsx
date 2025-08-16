'use client';

import React, { useState } from 'react';
import { 
  Calendar,
  Clock,
  Users,
  MapPin,
  CreditCard,
  Phone,
  Mail,
  MessageSquare,
  Eye,
  Edit3,
  X,
  Check,
  MoreHorizontal,
  Filter,
  Search,
  ChevronDown,
  Download
} from 'lucide-react';
import { Booking, BookingStatus, PaymentStatus } from '@/types/booking';
import { formatCurrency } from '@/lib/stripe';

interface BookingListProps {
  bookings: Booking[];
  userRole: 'student' | 'teacher';
  onStatusUpdate?: (bookingId: string, status: BookingStatus, notes?: string) => void;
  onViewDetails?: (booking: Booking) => void;
  onCancel?: (bookingId: string, reason: string) => void;
  loading?: boolean;
}

type FilterStatus = 'all' | BookingStatus;
type SortBy = 'date' | 'status' | 'amount' | 'created';

export function BookingList({
  bookings,
  userRole,
  onStatusUpdate,
  onViewDetails,
  onCancel,
  loading = false,
}: BookingListProps) {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showActions, setShowActions] = useState<string | null>(null);

  // フィルタリングとソート
  const filteredBookings = bookings
    .filter(booking => {
      if (filterStatus !== 'all' && booking.status !== filterStatus) return false;
      if (searchTerm && !booking.contactInfo.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.scheduledAt.toDate().getTime() - a.scheduledAt.toDate().getTime();
        case 'status':
          return a.status.localeCompare(b.status);
        case 'amount':
          return b.pricing.totalAmount - a.pricing.totalAmount;
        case 'created':
          return b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime();
        default:
          return 0;
      }
    });

  const getStatusBadge = (status: BookingStatus) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-blue-100 text-blue-800 border-blue-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };

    const labels = {
      pending: '保留中',
      confirmed: '確定済み',
      completed: '完了',
      cancelled: 'キャンセル',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getPaymentBadge = (status: PaymentStatus) => {
    const styles = {
      pending: 'bg-orange-100 text-orange-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    };

    const labels = {
      pending: '未払い',
      paid: '支払済み',
      failed: '失敗',
      refunded: '返金済み',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const handleStatusUpdate = (booking: Booking, newStatus: BookingStatus) => {
    const notes = prompt('メモ（任意）:');
    onStatusUpdate?.(booking.id, newStatus, notes || undefined);
    setShowActions(null);
  };

  const handleCancel = (booking: Booking) => {
    const reason = prompt('キャンセル理由を入力してください:');
    if (reason) {
      onCancel?.(booking.id, reason);
    }
    setShowActions(null);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* フィルターとソート */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* 検索 */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="予約者名で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* ステータスフィルター */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">全てのステータス</option>
              <option value="pending">保留中</option>
              <option value="confirmed">確定済み</option>
              <option value="completed">完了</option>
              <option value="cancelled">キャンセル</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* ソート */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="date">開催日順</option>
              <option value="created">作成日順</option>
              <option value="status">ステータス順</option>
              <option value="amount">金額順</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 予約リスト */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">予約がありません</h3>
            <p className="text-gray-500">条件に一致する予約が見つかりませんでした。</p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      予約ID: {booking.id.slice(-8)}
                    </h3>
                    {getStatusBadge(booking.status)}
                    {getPaymentBadge(booking.paymentStatus)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{booking.scheduledAt.toDate().toLocaleDateString('ja-JP')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{booking.duration}分</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>{booking.participantCount}名</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>{booking.contactInfo.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{booking.contactInfo.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CreditCard className="w-4 h-4" />
                        <span className="font-semibold">
                          {formatCurrency(booking.pricing.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {booking.studentNotes && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-blue-800">参加者からのメモ</p>
                          <p className="text-sm text-blue-700">{booking.studentNotes}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {booking.teacherNotes && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <MessageSquare className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-green-800">主催者からのメモ</p>
                          <p className="text-sm text-green-700">{booking.teacherNotes}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* アクションメニュー */}
                <div className="relative ml-4">
                  <button
                    onClick={() => setShowActions(showActions === booking.id ? null : booking.id)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <MoreHorizontal className="w-5 h-5 text-gray-600" />
                  </button>

                  {showActions === booking.id && (
                    <div className="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <div className="py-1">
                        <button
                          onClick={() => onViewDetails?.(booking)}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Eye className="w-4 h-4" />
                          <span>詳細を見る</span>
                        </button>

                        {userRole === 'teacher' && booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(booking, 'confirmed')}
                              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-green-700 hover:bg-green-50"
                            >
                              <Check className="w-4 h-4" />
                              <span>承認する</span>
                            </button>
                          </>
                        )}

                        {userRole === 'teacher' && booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusUpdate(booking, 'completed')}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-blue-700 hover:bg-blue-50"
                          >
                            <Check className="w-4 h-4" />
                            <span>完了にする</span>
                          </button>
                        )}

                        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                          <button
                            onClick={() => handleCancel(booking)}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                            <span>キャンセル</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 統計情報 */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-800">
              {bookings.length}
            </div>
            <div className="text-sm text-gray-600">総予約数</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {bookings.filter(b => b.status === 'confirmed').length}
            </div>
            <div className="text-sm text-gray-600">確定済み</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {bookings.filter(b => b.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">保留中</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(
                bookings
                  .filter(b => b.paymentStatus === 'paid')
                  .reduce((sum, b) => sum + b.pricing.totalAmount, 0)
              )}
            </div>
            <div className="text-sm text-gray-600">売上合計</div>
          </div>
        </div>
      </div>
    </div>
  );
}