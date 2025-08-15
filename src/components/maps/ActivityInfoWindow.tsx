'use client'

import { useState, useEffect } from 'react'
import { SocialActivity, formatPrice, getDayOfWeekName, calculateActivityDistance } from '@/lib/socialActivities'
import { getMarkerConfig, getCategoryDisplayName } from '@/lib/mapMarkers'

interface ActivityInfoWindowProps {
  activity: SocialActivity | null
  map: google.maps.Map | null
  userLocation?: { lat: number; lng: number }
  onClose: () => void
  onViewDetails: (activity: SocialActivity) => void
}

export default function ActivityInfoWindow({
  activity,
  map,
  userLocation,
  onClose,
  onViewDetails
}: ActivityInfoWindowProps) {
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null)

  useEffect(() => {
    if (!activity || !map || !activity.location.coordinates) {
      if (infoWindow) {
        infoWindow.close()
      }
      return
    }

    const config = getMarkerConfig(activity.category)
    const distance = userLocation 
      ? calculateActivityDistance(activity, userLocation.lat, userLocation.lng)
      : null

    // 利用可能な時間スロットを取得
    const availableSlots = activity.availableSlots
      .filter(slot => slot.isAvailable)
      .slice(0, 3) // 最大3つまで表示

    const content = `
      <div class="max-w-sm p-0 font-sans">
        <!-- ヘッダー -->
        <div class="flex items-start space-x-3 p-4 border-b border-gray-200">
          <div 
            class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
            style="background-color: ${config.bgColor}; color: ${config.textColor}; border: 2px solid ${config.color};"
          >
            ${config.emoji}
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold text-gray-900 leading-tight mb-1">
              ${activity.title}
            </h3>
            <div class="flex items-center space-x-2 text-sm text-gray-600">
              <span class="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">
                ${getCategoryDisplayName(activity.category)}
              </span>
              ${distance ? `<span class="text-xs">約${distance.toFixed(1)}km</span>` : ''}
            </div>
          </div>
        </div>

        <!-- 詳細情報 -->
        <div class="p-4 space-y-3">
          <!-- 説明 -->
          <p class="text-sm text-gray-700 leading-relaxed">
            ${activity.shortDescription}
          </p>

          <!-- 提供者情報 -->
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span class="text-sm text-gray-700 font-medium">${activity.teacherName}</span>
          </div>

          <!-- 場所 -->
          <div class="flex items-start space-x-2">
            <svg class="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="text-sm text-gray-700">${activity.location.area}, ${activity.location.city}</span>
          </div>

          <!-- 価格 -->
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <span class="text-sm font-semibold text-gray-900">${formatPrice(activity.price)}</span>
          </div>

          <!-- 評価 -->
          <div class="flex items-center space-x-2">
            <div class="flex items-center">
              ${Array.from({ length: 5 }, (_, i) => 
                `<svg class="w-4 h-4 ${i < Math.floor(activity.rating.average) ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>`
              ).join('')}
            </div>
            <span class="text-sm text-gray-600">
              ${activity.rating.average.toFixed(1)} (${activity.rating.count}件)
            </span>
          </div>

          <!-- 利用可能時間 -->
          ${availableSlots.length > 0 ? `
            <div class="space-y-1">
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm font-medium text-gray-700">利用可能時間</span>
              </div>
              <div class="ml-6 space-y-1">
                ${availableSlots.map(slot => `
                  <div class="text-xs text-gray-600">
                    ${getDayOfWeekName(slot.dayOfWeek)}曜日 ${slot.startTime}-${slot.endTime}
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- アクションボタン -->
          <div class="pt-2 border-t border-gray-200">
            <button 
              onclick="window.viewActivityDetails('${activity.id}')"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors"
            >
              詳細を見る
            </button>
          </div>
        </div>
      </div>
    `

    // グローバル関数を設定（InfoWindow内のボタンクリック用）
    ;(window as any).viewActivityDetails = (activityId: string) => {
      if (activity.id === activityId) {
        onViewDetails(activity)
      }
    }

    const newInfoWindow = new google.maps.InfoWindow({
      content,
      maxWidth: 350,
      pixelOffset: new google.maps.Size(0, -10)
    })

    newInfoWindow.setPosition(activity.location.coordinates)
    newInfoWindow.open(map)

    // 閉じるイベントリスナー
    newInfoWindow.addListener('closeclick', onClose)

    setInfoWindow(newInfoWindow)

    return () => {
      newInfoWindow.close()
      // グローバル関数をクリーンアップ
      delete (window as any).viewActivityDetails
    }
  }, [activity, map, userLocation, onClose, onViewDetails])

  return null // このコンポーネントは描画要素を持たない
}

/**
 * クラスター活動リスト表示コンポーネント
 */
interface ClusterActivitiesModalProps {
  activities: SocialActivity[]
  isOpen: boolean
  onClose: () => void
  onSelectActivity: (activity: SocialActivity) => void
  userLocation?: { lat: number; lng: number }
}

export function ClusterActivitiesModal({
  activities,
  isOpen,
  onClose,
  onSelectActivity,
  userLocation
}: ClusterActivitiesModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            この地域の活動 ({activities.length}件)
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 活動リスト */}
        <div className="overflow-y-auto max-h-[60vh]">
          {activities.map(activity => {
            const config = getMarkerConfig(activity.category)
            const distance = userLocation 
              ? calculateActivityDistance(activity, userLocation.lat, userLocation.lng)
              : null

            return (
              <div
                key={activity.id}
                className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onSelectActivity(activity)}
              >
                <div className="flex items-start space-x-3">
                  <div 
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{
                      backgroundColor: config.bgColor,
                      color: config.textColor,
                      border: `2px solid ${config.color}`
                    }}
                  >
                    {config.emoji}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                      {activity.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {activity.shortDescription}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="px-2 py-1 bg-gray-100 rounded-full">
                        {getCategoryDisplayName(activity.category)}
                      </span>
                      <span>{activity.teacherName}</span>
                      {distance && <span>約{distance.toFixed(1)}km</span>}
                      <span className="font-semibold text-gray-900">
                        {formatPrice(activity.price)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
