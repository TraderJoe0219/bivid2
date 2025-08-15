'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { AlertCircle, X, Search, Menu, MapPin, Filter } from 'lucide-react';
import { GoogleMap } from '@/components/maps/GoogleMap';
import { ActivityDetailPanel } from '@/components/maps/ActivityDetailPanel';
import { RouteDirections } from '@/components/maps/RouteDirections';
import { BookingModal, BookingData } from '@/components/maps/BookingModal';
import { useMapFilters } from '@/hooks/useMapFilters';
import { getSampleActivities, getSampleActivityById } from '@/lib/sampleActivities';
import { SocialActivity, FavoriteStatus } from '@/types/activity';
import { CATEGORY_OPTIONS } from '@/lib/socialActivities';

interface MarkerData {
  id: string;
  position: google.maps.LatLngLiteral;
  title: string;
  activity: SocialActivity;
}

const DEFAULT_CENTER = {
  lat: 34.7816,
  lng: 135.4956
};

export default function MapPage() {
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'filter'>('search');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<SocialActivity[]>([]);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>(DEFAULT_CENTER);
  const [selectedActivity, setSelectedActivity] = useState<SocialActivity | null>(null);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [showRouteDirections, setShowRouteDirections] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteStatus>({});
  
  const {
    filters,
    updateFilter,
    clearFilters,
    filteredActivities,
    activeFilterCount,
    isFiltering
  } = useMapFilters(activities);

  const closeError = useCallback(() => {
    setError(null);
  }, []);

  // データ読み込み
  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        // 開発中はサンプルデータを使用
        const data = getSampleActivities();
        setActivities(data);
      } catch (err) {
        console.error('活動データの読み込みに失敗:', err);
        setError('活動データの読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  // 現在地取得
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('位置情報がサポートされていません');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);
        setCenter(location);
        updateFilter('location', location);
      },
      (error) => {
        console.error('位置情報の取得に失敗:', error);
        setError('位置情報の取得に失敗しました');
      }
    );
  }, [updateFilter]);

  // 住所検索
  const searchAddress = useCallback(async (address: string) => {
    if (!address.trim()) return;

    try {
      const geocoder = new google.maps.Geocoder();
      const result = await geocoder.geocode({ address });
      
      if (result.results && result.results.length > 0) {
        const location = result.results[0].geometry.location;
        const newCenter = {
          lat: location.lat(),
          lng: location.lng()
        };
        setCenter(newCenter);
        updateFilter('location', newCenter);
      } else {
        setError('住所が見つかりませんでした');
      }
    } catch (err) {
      console.error('住所検索に失敗:', err);
      setError('住所検索に失敗しました');
    }
  }, [updateFilter]);

  // マーカーデータ生成
  const markers: MarkerData[] = filteredActivities
    .filter(activity => activity.location.coordinates)
    .map(activity => ({
      id: activity.id,
      position: activity.location.coordinates!,
      title: activity.title,
      activity
    }));

  // マーカークリック処理
  const handleMarkerClick = useCallback((activity: SocialActivity) => {
    setSelectedActivity(activity);
    setShowDetailPanel(true);
    setShowMobileDrawer(false); // モバイルドロワーを閉じる
  }, []);

  // 詳細パネルを閉じる
  const handleCloseDetailPanel = useCallback(() => {
    setShowDetailPanel(false);
    setSelectedActivity(null);
  }, []);

  // 予約処理
  const handleBooking = useCallback((activity: SocialActivity) => {
    setShowBookingModal(true);
  }, []);

  // 予約確定処理
  const handleBookingConfirm = useCallback(async (bookingData: BookingData) => {
    try {
      // 実際の予約処理をここに実装
      console.log('予約データ:', bookingData);
      
      // 成功メッセージなどの処理
      alert('予約リクエストを送信しました！');
      
      setShowBookingModal(false);
    } catch (error) {
      console.error('予約処理に失敗:', error);
      alert('予約処理に失敗しました。もう一度お試しください。');
      throw error;
    }
  }, []);

  // お気に入り処理
  const handleFavorite = useCallback((activity: SocialActivity) => {
    setFavorites(prev => ({
      ...prev,
      [activity.id]: !prev[activity.id]
    }));
  }, []);

  // メッセージ処理
  const handleMessage = useCallback((activity: SocialActivity) => {
    // メッセージ機能の実装
    alert(`${activity.organizer.name}さんにメッセージを送信します`);
  }, []);

  // 共有処理
  const handleShare = useCallback((activity: SocialActivity) => {
    if (navigator.share) {
      navigator.share({
        title: activity.title,
        text: activity.shortDescription,
        url: window.location.href
      });
    } else {
      // フォールバック: クリップボードにコピー
      navigator.clipboard.writeText(window.location.href);
      alert('URLをクリップボードにコピーしました');
    }
  }, []);

  // ルート案内処理
  const handleGetDirections = useCallback((activity: SocialActivity) => {
    setShowRouteDirections(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* モバイル用ヘッダー */}
      <div className="lg:hidden bg-white shadow-md p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">地図検索</h1>
        <button
          onClick={() => setShowMobileDrawer(!showMobileDrawer)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors min-h-[44px] flex items-center relative"
        >
          <Search className="w-4 h-4 mr-2" />
          検索・フィルター
          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <main className="flex h-screen lg:h-[calc(100vh-0px)]">
        {/* サイドバー（デスクトップ） */}
        <div className="hidden lg:flex flex-col bg-white shadow-lg w-96">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800">地図検索</h1>
            <p className="text-sm text-gray-600 mt-1">
              活動を検索・フィルターして地図上で確認
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              {/* 検索セクション */}
              <div className="bg-white rounded-lg border p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">場所を検索</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={filters.keyword}
                    onChange={(e) => updateFilter('keyword', e.target.value)}
                    placeholder="住所、駅名、キーワードを入力"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <div className="flex space-x-2">
                    <button 
                      onClick={getCurrentLocation}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      現在地
                    </button>
                    <button 
                      onClick={() => searchAddress(filters.keyword)}
                      className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                    >
                      検索
                    </button>
                  </div>
                </div>
              </div>

              {/* 距離フィルター */}
              <div className="bg-white rounded-lg border p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">距離範囲</h3>
                <select
                  value={filters.distance}
                  onChange={(e) => updateFilter('distance', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value={1}>1km 以内</option>
                  <option value={3}>3km 以内</option>
                  <option value={5}>5km 以内</option>
                  <option value={10}>10km 以内</option>
                  <option value={20}>20km 以内</option>
                </select>
              </div>

              {/* カテゴリフィルター */}
              <div className="bg-white rounded-lg border p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">カテゴリ</h3>
                <div className="space-y-2">
                  {CATEGORY_OPTIONS.map((category) => (
                    <label key={category.id} className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={filters.categories.includes(category.id)}
                        onChange={(e) => {
                          const newCategories = e.target.checked
                            ? [...filters.categories, category.id]
                            : filters.categories.filter(c => c !== category.id);
                          updateFilter('categories', newCategories);
                        }}
                        className="mr-3 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500" 
                      />
                      <span className="text-sm flex items-center">
                        <span className="mr-2">{category.icon}</span>
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 価格フィルター */}
              <div className="bg-white rounded-lg border p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">価格範囲</h3>
                <select
                  value={filters.priceRange}
                  onChange={(e) => updateFilter('priceRange', e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">すべて</option>
                  <option value="free">無料</option>
                  <option value="under_1000">1,000円未満</option>
                  <option value="under_3000">3,000円未満</option>
                  <option value="under_5000">5,000円未満</option>
                </select>
              </div>

              {/* フィルタークリア */}
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  フィルターをクリア ({activeFilterCount})
                </button>
              )}

              {/* 検索結果 */}
              <div className="bg-white rounded-lg border p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  検索結果 ({filteredActivities.length}件)
                </h3>
                {loading ? (
                  <p className="text-gray-600 text-sm">読み込み中...</p>
                ) : filteredActivities.length === 0 ? (
                  <p className="text-gray-600 text-sm">条件に一致する活動がありません</p>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {filteredActivities.slice(0, 5).map((activity) => (
                      <div 
                        key={activity.id}
                        onClick={() => setSelectedActivity(activity)}
                        className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <h4 className="font-medium text-gray-800 text-sm mb-1">{activity.title}</h4>
                        <p className="text-xs text-gray-600 mb-2">{activity.shortDescription}</p>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-orange-600 font-medium">
                            {activity.price.amount === 0 ? '無料' : `¥${activity.price.amount.toLocaleString()}`}
                          </span>
                          <span className="text-gray-500">{activity.teacherName}</span>
                        </div>
                      </div>
                    ))}
                    {filteredActivities.length > 5 && (
                      <p className="text-xs text-gray-500 text-center">
                        他 {filteredActivities.length - 5} 件...
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1 flex flex-col">
          {/* エラー表示 */}
          {error && (
            <div className="m-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-800 font-medium">エラーが発生しました</p>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
              <button
                onClick={closeError}
                className="ml-4 text-red-600 hover:text-red-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* 地図コンテンツ */}
          <div className="flex-1 relative">
            {typeof window !== 'undefined' && (
              <GoogleMap
                center={center}
                markers={markers}
                onMarkerClick={(marker) => setSelectedActivity(marker.activity)}
                onMapClick={() => setSelectedActivity(null)}
                className="w-full h-full"
              />
            )}
            
            {/* 選択された活動の詳細 */}
            {selectedActivity && (
              <div className="absolute bottom-4 left-4 right-4 lg:right-auto lg:w-80 bg-white rounded-lg shadow-lg p-4 z-10">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-800">{selectedActivity.title}</h3>
                  <button
                    onClick={() => setSelectedActivity(null)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-3">{selectedActivity.shortDescription}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">価格:</span>
                    <span className="font-medium text-orange-600">
                      {selectedActivity.price.amount === 0 ? '無料' : `¥${selectedActivity.price.amount.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">提供者:</span>
                    <span>{selectedActivity.teacherName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">場所:</span>
                    <span>{selectedActivity.location.address}</span>
                  </div>
                </div>
                <button className="w-full mt-4 bg-orange-600 text-white py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors">
                  詳細を見る
                </button>
              </div>
            )}
          </div>
        </div>

        {/* モバイル用ドロワー */}
        {showMobileDrawer && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setShowMobileDrawer(false)}
            />
            <div className="fixed inset-x-0 bottom-0 bg-white z-50 lg:hidden rounded-t-2xl shadow-2xl max-h-[90vh] flex flex-col">
              <div className="flex justify-center py-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full" />
              </div>
              
              {/* タブヘッダー */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('search')}
                  className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                    activeTab === 'search'
                      ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Search className="w-4 h-4 mx-auto mb-1" />
                  検索
                </button>
                <button
                  onClick={() => setActiveTab('filter')}
                  className={`flex-1 py-3 px-4 text-center font-medium transition-colors relative ${
                    activeTab === 'filter'
                      ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Filter className="w-4 h-4 mx-auto mb-1" />
                  フィルター
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setShowMobileDrawer(false)}
                  className="p-3 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {activeTab === 'search' ? (
                  <div className="space-y-6">
                    {/* モバイル検索セクション */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">場所を検索</h3>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={filters.keyword}
                          onChange={(e) => updateFilter('keyword', e.target.value)}
                          placeholder="住所、駅名、キーワードを入力"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <div className="flex space-x-2">
                          <button 
                            onClick={getCurrentLocation}
                            className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                          >
                            <MapPin className="w-4 h-4 mr-2" />
                            現在地
                          </button>
                          <button 
                            onClick={() => searchAddress(filters.keyword)}
                            className="flex-1 bg-orange-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                          >
                            検索
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 距離フィルター */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">距離範囲</h3>
                      <select
                        value={filters.distance}
                        onChange={(e) => updateFilter('distance', Number(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value={1}>1km 以内</option>
                        <option value={3}>3km 以内</option>
                        <option value={5}>5km 以内</option>
                        <option value={10}>10km 以内</option>
                        <option value={20}>20km 以内</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* カテゴリフィルター */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">カテゴリ</h3>
                      <div className="space-y-3">
                        {CATEGORY_OPTIONS.map((category) => (
                          <label key={category.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <input 
                              type="checkbox" 
                              checked={filters.categories.includes(category.id)}
                              onChange={(e) => {
                                const newCategories = e.target.checked
                                  ? [...filters.categories, category.id]
                                  : filters.categories.filter(c => c !== category.id);
                                updateFilter('categories', newCategories);
                              }}
                              className="mr-3 w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500" 
                            />
                            <span className="flex items-center text-base">
                              <span className="mr-3 text-lg">{category.icon}</span>
                              {category.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* 価格フィルター */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">価格範囲</h3>
                      <select
                        value={filters.priceRange}
                        onChange={(e) => updateFilter('priceRange', e.target.value as any)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="all">すべて</option>
                        <option value="free">無料</option>
                        <option value="under_1000">1,000円未満</option>
                        <option value="under_3000">3,000円未満</option>
                        <option value="under_5000">5,000円未満</option>
                      </select>
                    </div>

                    {/* フィルタークリア */}
                    {activeFilterCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="w-full bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                      >
                        フィルターをクリア ({activeFilterCount})
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">
                    検索結果: {filteredActivities.length}件
                  </span>
                  {activeFilterCount > 0 && (
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                      {activeFilterCount}個のフィルターが適用中
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowMobileDrawer(false)}
                  className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                >
                  地図を表示
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      {/* デスクトップ用詳細パネル */}
      {showDetailPanel && selectedActivity && (
        <div className="hidden lg:block">
          <div className="fixed right-0 top-0 h-full w-96 z-40">
            <ActivityDetailPanel
              activity={selectedActivity}
              onClose={handleCloseDetailPanel}
              onBooking={handleBooking}
              onFavorite={handleFavorite}
              onMessage={handleMessage}
              onShare={handleShare}
              onGetDirections={handleGetDirections}
              isFavorited={favorites[selectedActivity.id] || false}
              className="h-full flex flex-col"
            />
          </div>
        </div>
      )}

      {/* モバイル用詳細パネル */}
      {showDetailPanel && selectedActivity && (
        <div className="lg:hidden">
          <div className="fixed inset-0 bg-white z-50">
            <ActivityDetailPanel
              activity={selectedActivity}
              onClose={handleCloseDetailPanel}
              onBooking={handleBooking}
              onFavorite={handleFavorite}
              onMessage={handleMessage}
              onShare={handleShare}
              onGetDirections={handleGetDirections}
              isFavorited={favorites[selectedActivity.id] || false}
              className="h-full flex flex-col"
            />
          </div>
        </div>
      )}

      {/* ルート案内モーダル */}
      {showRouteDirections && selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md">
            <RouteDirections
              activity={selectedActivity}
              userLocation={userLocation}
              onClose={() => setShowRouteDirections(false)}
            />
          </div>
        </div>
      )}

      {/* 予約モーダル */}
      {showBookingModal && selectedActivity && (
        <BookingModal
          activity={selectedActivity}
          onClose={() => setShowBookingModal(false)}
          onConfirm={handleBookingConfirm}
        />
      )}
    </div>
  );
}
