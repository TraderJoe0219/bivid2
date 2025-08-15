'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { AlertCircle, X, Search, Menu, MapPin, Filter } from 'lucide-react';
import { GoogleMap } from '@/components/maps/GoogleMap';
import SocialActivityMarkers from '@/components/maps/SocialActivityMarkers';
import { getSocialActivities, SocialActivity } from '@/lib/socialActivities';

// 社会活動カテゴリーのマッピング
const CATEGORY_LABELS: Record<string, string> = {
  work: '🔨 仕事',
  help: '🤝 お手伝い',
  volunteer: '❤️ ボランティア',
  seminar: '🎤 講演会・セミナー',
  event: '🎉 イベント',
  meeting: '📣 集会'
};

const SOCIAL_ACTIVITY_CATEGORIES = [
  { id: 'work', name: '🔨 仕事', color: 'blue' },
  { id: 'help', name: '🤝 お手伝い', color: 'green' },
  { id: 'volunteer', name: '❤️ ボランティア', color: 'red' },
  { id: 'seminar', name: '🎤 講演会・セミナー', color: 'yellow' },
  { id: 'event', name: '🎉 イベント', color: 'orange' },
  { id: 'meeting', name: '📣 集会', color: 'purple' }
];

const DEFAULT_CENTER = {
  lat: 34.7816,
  lng: 135.4956
};

export default function MapPage() {
  // 状態管理
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [activities, setActivities] = useState<SocialActivity[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(SOCIAL_ACTIVITY_CATEGORIES.map(c => c.id));
  const [selectedActivity, setSelectedActivity] = useState<SocialActivity | null>(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // 社会活動データを取得
  const fetchActivities = useCallback(async () => {
    console.log('🔍 地図ページ: 社会活動データを取得中...');
    setLoading(true);
    try {
      const filters = {
        categories: selectedCategories.length > 0 ? selectedCategories : undefined,
        location: userLocation || undefined,
        maxDistance: userLocation ? 10 : undefined,
        hasAvailableSlots: true
      };
      
      const data = await getSocialActivities(filters);
      console.log('✅ 地図ページ: 社会活動データ取得成功:', data.length, '件', data);
      setActivities(data);
    } catch (error) {
      console.error('社会活動データの取得に失敗しました:', error);
      setError('データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, [selectedCategories, userLocation]);

  // コンポーネントマウント時にデータ取得
  useEffect(() => {
    console.log('📈 地図ページ: コンポーネントマウント - データ取得開始');
    fetchActivities();
  }, [fetchActivities]);

  // ユーザーの現在位置を取得
  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
        },
        (error) => {
          console.error('位置情報の取得に失敗しました:', error);
        }
      );
    }
  }, []);

  // マーカークリック時の処理
  const handleMarkerClick = useCallback((activity: SocialActivity) => {
    setSelectedActivity(activity);
    setShowDetailPanel(true);
  }, []);

  // クラスタークリック時の処理
  const handleClusterClick = useCallback((activities: SocialActivity[]) => {
    // 最初のアクティビティを選択して詳細を表示
    if (activities.length > 0) {
      setSelectedActivity(activities[0]);
      setShowDetailPanel(true);
    }
  }, []);

  // カテゴリフィルター変更時の処理
  const handleCategoryChange = useCallback((categories: string[]) => {
    setSelectedCategories(categories);
  }, []);

  // マップ読み込み完了時の処理
  const handleMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    getCurrentLocation();
  }, [getCurrentLocation]);

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-bold text-gray-900">社会活動マップ</h1>
            <span className="bg-orange-100 text-orange-800 text-sm font-medium px-2 py-1 rounded">
              {activities.length}件の活動
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowMobileDrawer(!showMobileDrawer)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <button
              onClick={getCurrentLocation}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="現在地を取得"
            >
              <MapPin className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
            <button
              onClick={() => setError('')}
              className="text-red-400 hover:text-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* メインコンテンツ */}
      <div className="flex-1 flex relative">
        {/* サイドバー（デスクトップ） */}
        <div className="hidden lg:block w-80 bg-white shadow-sm border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            {/* カテゴリフィルター */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">活動カテゴリ</h3>
              <div className="space-y-2">
                {SOCIAL_ACTIVITY_CATEGORIES.map(category => {
                  const isSelected = selectedCategories.includes(category.id);
                  return (
                    <button
                      key={category.id}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedCategories(selectedCategories.filter(c => c !== category.id));
                        } else {
                          setSelectedCategories([...selectedCategories, category.id]);
                        }
                      }}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-orange-300 bg-orange-50 text-orange-900'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-lg">{category.name.split(' ')[0]}</span>
                      <span className="text-sm font-medium">{category.name.split(' ').slice(1).join(' ')}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 活動リスト */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">近くの活動</h3>
              {loading ? (
                <div className="text-center py-8">
                  <div className="text-gray-500">読み込み中...</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {activities.slice(0, 10).map(activity => (
                    <div
                      key={activity.id}
                      onClick={() => handleMarkerClick(activity)}
                      className="p-3 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 cursor-pointer transition-all"
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-lg">
                          {CATEGORY_LABELS[activity.category]?.split(' ')[0] || '📍'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {activity.title}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {activity.description}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {activity.location.address}
                            </span>
                            <span className="text-xs font-medium text-orange-600">
                              {typeof activity.price === 'number' 
                                ? (activity.price === 0 ? '無料' : `¥${Number(activity.price).toLocaleString()}`)
                                : (activity.price && typeof activity.price === 'object' && 'amount' in activity.price
                                  ? `¥${Number(activity.price.amount).toLocaleString()}`
                                  : '無料')
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* マップエリア */}
        <div className="flex-1 relative">
          <GoogleMap
            center={DEFAULT_CENTER}
            zoom={13}
            onMapLoad={handleMapLoad}
            className="w-full h-full"
            height="100%"
          >
            <SocialActivityMarkers
              map={map}
              selectedCategories={selectedCategories}
              onMarkerClick={handleMarkerClick}
              onClusterClick={handleClusterClick}
              userLocation={userLocation || undefined}
              maxDistance={10}
            />
          </GoogleMap>
        </div>

        {/* 詳細パネル */}
        {showDetailPanel && selectedActivity && (
          <div className="absolute top-0 right-0 w-96 h-full bg-white shadow-xl border-l border-gray-200 overflow-y-auto z-10">
            <div className="relative">
              {/* ヘッダー */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-20">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">活動詳細</h3>
                  <button
                    onClick={() => setShowDetailPanel(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-4 space-y-6">
                {/* メイン情報 */}
                <div>
                  <div className="flex items-start space-x-3 mb-3">
                    <span className="text-2xl">
                      {CATEGORY_LABELS[selectedActivity.category]?.split(' ')[0] || '📍'}
                    </span>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{selectedActivity.title}</h4>
                      <span className="inline-block bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                        {CATEGORY_LABELS[selectedActivity.category]?.split(' ').slice(1).join(' ') || selectedActivity.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{selectedActivity.description}</p>
                </div>

                {/* 講師情報 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="mr-2">👨‍🏫</span>
                    講師情報
                  </h5>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center overflow-hidden">
                      {selectedActivity.teacherPhotoURL ? (
                        <img
                          src={selectedActivity.teacherPhotoURL}
                          alt={selectedActivity.teacherName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-orange-700 font-semibold text-lg">
                          {selectedActivity.teacherName.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h6 className="font-medium text-gray-900">{selectedActivity.teacherName}</h6>
                      <p className="text-sm text-gray-600">{selectedActivity.teacherLocation}</p>
                    </div>
                  </div>
                </div>

                {/* 開催情報 */}
                <div>
                  <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="mr-2">📍</span>
                    開催情報
                  </h5>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">場所</p>
                        <p className="text-sm text-gray-600">{selectedActivity.location.address}</p>
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1">
                          {selectedActivity.location.type === 'offline' ? '対面' : 
                           selectedActivity.location.type === 'online' ? 'オンライン' : 'ハイブリッド'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-500">⏱️</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">所要時間</p>
                        <p className="text-sm text-gray-600">{selectedActivity.duration}分</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-500">👥</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">定員</p>
                        <p className="text-sm text-gray-600">
                          {selectedActivity.maxStudents}名まで 
                          <span className="text-orange-600 font-medium">
                            (残り{selectedActivity.maxStudents - selectedActivity.currentBookings}名)
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 料金情報 */}
                <div className="bg-orange-50 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <span className="mr-2">💰</span>
                    料金
                  </h5>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-orange-600">
                      {selectedActivity.price.amount === 0 ? '無料' : 
                       `¥${Number(selectedActivity.price.amount).toLocaleString()}`}
                    </span>
                    {selectedActivity.price.amount > 0 && (
                      <span className="text-sm text-gray-600">/ {selectedActivity.price.unit}</span>
                    )}
                  </div>
                </div>

                {/* 評価・レビュー */}
                <div>
                  <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="mr-2">⭐</span>
                    評価・レビュー
                  </h5>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400 text-lg">★</span>
                      <span className="text-lg font-semibold text-gray-900">
                        {selectedActivity.rating.average.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      ({selectedActivity.rating.count}件のレビュー)
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>👁️ {selectedActivity.viewCount.toLocaleString()}回閲覧</span>
                      <span>•</span>
                      <span>❤️ {selectedActivity.favoriteCount}件お気に入り</span>
                    </div>
                  </div>
                </div>

                {/* 難易度・対象者 */}
                <div>
                  <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="mr-2">🎯</span>
                    難易度・対象者
                  </h5>
                  <div className="space-y-2">
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        selectedActivity.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                        selectedActivity.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedActivity.difficulty === 'beginner' ? '初級' :
                         selectedActivity.difficulty === 'intermediate' ? '中級' : '上級'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {selectedActivity.targetAudience.map((audience, index) => (
                        <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {audience}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 必要な条件 */}
                {selectedActivity.requirements.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="mr-2">✅</span>
                      必要な条件
                    </h5>
                    <ul className="space-y-1">
                      {selectedActivity.requirements.map((requirement, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                          <span className="text-orange-500 mt-1">•</span>
                          <span>{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* アクションボタン */}
                <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200 space-y-3">
                  <button className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2">
                    <span>📝</span>
                    <span>参加申し込み</span>
                  </button>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <button className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1">
                      <span>❤️</span>
                      <span>お気に入り</span>
                    </button>
                    
                    <button className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1">
                      <span>💬</span>
                      <span>質問</span>
                    </button>
                    
                    <button className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1">
                      <span>🔗</span>
                      <span>共有</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* モバイルドロワー */}
        {showMobileDrawer && (
          <div className="lg:hidden absolute inset-0 z-20">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileDrawer(false)} />
            <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-lg overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">フィルター</h3>
                  <button
                    onClick={() => setShowMobileDrawer(false)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* カテゴリフィルター（モバイル） */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">活動カテゴリ</h4>
                  <div className="space-y-2">
                    {SOCIAL_ACTIVITY_CATEGORIES.map(category => {
                      const isSelected = selectedCategories.includes(category.id);
                      return (
                        <button
                          key={category.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedCategories(selectedCategories.filter(c => c !== category.id));
                            } else {
                              setSelectedCategories([...selectedCategories, category.id]);
                            }
                          }}
                          className={`w-full flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${
                            isSelected
                              ? 'border-orange-300 bg-orange-50 text-orange-900'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <span className="text-lg">{category.name.split(' ')[0]}</span>
                          <span className="text-sm font-medium">{category.name.split(' ').slice(1).join(' ')}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
