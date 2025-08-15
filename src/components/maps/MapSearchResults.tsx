'use client';

import React from 'react';
import { MapPin, Clock, DollarSign, User, Star, Calendar } from 'lucide-react';
import { SocialActivity } from '@/lib/socialActivities';
import { formatDistance } from '@/lib/maps';

interface MapSearchResultsProps {
  activities: SocialActivity[];
  userLocation?: { lat: number; lng: number };
  onActivityClick: (activity: SocialActivity) => void;
  className?: string;
}

export function MapSearchResults({
  activities,
  userLocation,
  onActivityClick,
  className = '',
}: MapSearchResultsProps) {
  // 距離計算
  const calculateDistance = (activity: SocialActivity): number | null => {
    if (!userLocation) return null;
    
    const R = 6371; // 地球の半径（km）
    const dLat = (activity.location.lat - userLocation.lat) * Math.PI / 180;
    const dLng = (activity.location.lng - userLocation.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(activity.location.lat * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 日付フォーマット
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date >= today && date < tomorrow) {
      return '今日';
    } else if (date >= tomorrow && date < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)) {
      return '明日';
    } else {
      return date.toLocaleDateString('ja-JP', {
        month: 'short',
        day: 'numeric',
        weekday: 'short'
      });
    }
  };

  // 料金表示
  const formatPrice = (price: number): string => {
    if (price === 0) return '無料';
    return `¥${price.toLocaleString()}`;
  };

  if (activities.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 text-center ${className}`}>
        <div className="text-gray-400 mb-4">
          <MapPin className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          検索結果が見つかりません
        </h3>
        <p className="text-gray-600">
          検索条件を変更して再度お試しください
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          検索結果 ({activities.length}件)
        </h2>
        <p className="text-sm text-gray-600">
          地図上のマーカーをクリックするか、下記のリストから選択してください
        </p>
      </div>

      <div className="space-y-3">
        {activities.map((activity) => {
          const distance = calculateDistance(activity);
          
          return (
            <div
              key={activity.id}
              onClick={() => onActivityClick(activity)}
              className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-orange-500"
            >
              {/* ヘッダー */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">
                    {activity.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium mr-2">
                      {activity.category}
                    </span>
                    {distance && (
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-orange-600 mb-1">
                    {formatPrice(activity.price)}
                  </div>
                  {activity.rating && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      {activity.rating.toFixed(1)}
                    </div>
                  )}
                </div>
              </div>

              {/* 説明 */}
              <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                {activity.description}
              </p>

              {/* 詳細情報 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {/* 日時 */}
                {activity.schedule?.startDate && (
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                    <span>
                      {formatDate(activity.schedule.startDate)}
                      {activity.schedule.startTime && ` ${activity.schedule.startTime}`}
                    </span>
                  </div>
                )}

                {/* 所要時間 */}
                {activity.duration && (
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-green-500" />
                    <span>{activity.duration}分</span>
                  </div>
                )}

                {/* 場所 */}
                <div className="flex items-center text-gray-600 sm:col-span-2">
                  <MapPin className="w-4 h-4 mr-2 text-red-500" />
                  <span className="truncate">{activity.location.address}</span>
                </div>

                {/* 主催者 */}
                {activity.organizer && (
                  <div className="flex items-center text-gray-600 sm:col-span-2">
                    <User className="w-4 h-4 mr-2 text-purple-500" />
                    <span>
                      {activity.organizer.name}
                      {activity.organizer.ageRange && ` (${activity.organizer.ageRange})`}
                    </span>
                  </div>
                )}
              </div>

              {/* 参加可能人数 */}
              {activity.maxParticipants && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">参加可能人数</span>
                    <span className="font-medium text-gray-800">
                      {activity.currentParticipants || 0} / {activity.maxParticipants}人
                    </span>
                  </div>
                  <div className="mt-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, ((activity.currentParticipants || 0) / activity.maxParticipants) * 100)}%`
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
