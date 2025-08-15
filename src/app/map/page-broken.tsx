'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap } from '@/components/maps/GoogleMap';
import { MapSearch } from '@/components/maps/MapSearch';
import { MapSearchBar } from '@/components/maps/MapSearchBar';
import { MapFilterPanel } from '@/components/maps/MapFilterPanel';
import { MapMobileDrawer } from '@/components/maps/MapMobileDrawer';
import { MapSearchResults } from '@/components/maps/MapSearchResults';
import SocialActivityMarkers, { CategoryFilter } from '@/components/maps/SocialActivityMarkers';
import ActivityInfoWindow, { ClusterActivitiesModal } from '@/components/maps/ActivityInfoWindow';
import { DEFAULT_CENTER, geocodeAddress, getCurrentLocation } from '@/lib/maps';
import { SocialActivity, getSocialActivities } from '@/lib/socialActivities';
import { useMapFilters } from '@/hooks/useMapFilters';
import { AlertCircle, X, Filter, MapPin, Search, Menu } from 'lucide-react';

interface LocationData {
  lat: number;
  lng: number;
  address?: string;
}

interface MarkerData {
  id: string;
  position: google.maps.LatLngLiteral;
  title?: string;
  info?: string;
}

export default function MapPage() {
  const [center, setCenter] = useState<google.maps.LatLngLiteral>(DEFAULT_CENTER);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<SocialActivity | null>(null);
  const [clusterActivities, setClusterActivities] = useState<SocialActivity[]>([]);
  const [showClusterModal, setShowClusterModal] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [allActivities, setAllActivities] = useState<SocialActivity[]>([]);
  
  // モバイル用状態
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState<'search' | 'filter'>('search');
  const [showSidebar, setShowSidebar] = useState(true);
  
  // フィルターフック
  const {
    filters,
    updateFilter,
    clearFilters,
    filteredActivities,
    activeFilterCount,
    isFiltering,
  } = useMapFilters(allActivities);

  // 活動データ取得
  useEffect(() => {
    const loadActivities = async () => {
      try {
        setIsLoading(true);
        const activities = await getSocialActivities({});
        setAllActivities(activities);
      } catch (error) {
        console.error('活動データの取得に失敗しました:', error);
        setError('活動データの取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadActivities();
  }, []);

  // 場所選択時の処理
  const handleLocationSelect = useCallback((location: LocationData) => {
    setCenter({ lat: location.lat, lng: location.lng });
    setSelectedLocation(location);
    setUserLocation({ lat: location.lat, lng: location.lng });
    
    // フィルターの場所情報を更新
    updateFilter('location', {
      address: location.address || '',
      lat: location.lat,
      lng: location.lng,
      radius: filters.location.radius,
    });
    
    // マーカーを追加
    const newMarker: MarkerData = {
      id: `location-${Date.now()}`,
      position: { lat: location.lat, lng: location.lng },
      title: '選択した場所',
      info: location.address || `緯度: ${location.lat.toFixed(6)}, 経度: ${location.lng.toFixed(6)}`
    };
    
    setMarkers([newMarker]);
    setError(null);
  }, [filters.location.radius, updateFilter]);

  // 住所検索
  const handleLocationSearch = useCallback(async (address: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await geocodeAddress(address);
      if (result) {
        handleLocationSelect({
          lat: result.lat,
          lng: result.lng,
          address: result.address,
        });
      } else {
        setError('住所が見つかりませんでした');
      }
    } catch (error) {
      console.error('住所検索エラー:', error);
      setError('住所検索に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [handleLocationSelect]);

  // 現在地取得
  const handleCurrentLocation = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await getCurrentLocation();
      if (result) {
        handleLocationSelect({
          lat: result.lat,
          lng: result.lng,
          address: '現在地',
        });
      } else {
        setError('現在地を取得できませんでした');
      }
    } catch (error) {
      console.error('現在地取得エラー:', error);
      setError('現在地の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [handleLocationSelect]);

  // エラー処理
  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
  }, []);

  // エラーを閉じる
  const closeError = useCallback(() => {
    setError(null);
  }, []);

  // 地図クリック時の処理
  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      handleLocationSelect({ lat, lng });
    }
  }, [handleLocationSelect]);

  // 地図インスタンス取得
  const handleMapLoad = useCallback(async (mapInstance: google.maps.Map) => {
    console.log('Map loaded');
    setMap(mapInstance);
  }, []);

  // モバイルドロワー制御
  const handleMobileDrawerToggle = useCallback(() => {
    setShowMobileDrawer(!showMobileDrawer);
  }, [showMobileDrawer]);

  const handleMobileTabChange = useCallback((tab: 'search' | 'filter') => {
    setMobileActiveTab(tab);
  }, []);

  // サイドバー制御
  const toggleSidebar = useCallback(() => {
    setShowSidebar(!showSidebar);
  }, [showSidebar]);

  // 検索結果から活動選択
  const handleActivityFromResults = useCallback((activity: SocialActivity) => {
    setSelectedActivity(activity);
    setCenter({
      lat: activity.location.lat,
      lng: activity.location.lng,
    });
    
    // モバイルの場合はドロワーを閉じる
    if (showMobileDrawer) {
      setShowMobileDrawer(false);
    }
  }, [showMobileDrawer]);

  // 活動マーカークリック処理
  const handleActivityMarkerClick = useCallback((activity: SocialActivity) => {
    setSelectedActivity(activity);
  }, []);

  // クラスタークリック処理
  const handleClusterClick = useCallback((activities: SocialActivity[]) => {
    setClusterActivities(activities);
    setShowClusterModal(true);
  }, []);

  // InfoWindow閉じる処理
  const handleInfoWindowClose = useCallback(() => {
    setSelectedActivity(null);
  }, []);

  // 活動詳細表示
  const handleViewActivityDetails = useCallback((activity: SocialActivity) => {
    // TODO: 活動詳細ページに遷移
    console.log('活動詳細を表示:', activity);
    alert(`活動詳細: ${activity.title}\n\n詳細ページは今後実装予定です。`);
  }, []);

  // クラスターモーダルから活動選択
  const handleSelectActivityFromCluster = useCallback((activity: SocialActivity) => {
    setShowClusterModal(false);
    setSelectedActivity(activity);
    setCenter({
      lat: activity.location.lat,
      lng: activity.location.lng,
    });
    if (map) {
      map.setZoom(16);
    }
  }, [map]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* モバイル用ヘッダー */}
      <div className="lg:hidden bg-white shadow-md p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">地図検索</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleMobileDrawerToggle}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors min-h-[44px] flex items-center relative"
          >
            <Search className="w-4 h-4 mr-2" />
            検索・フィルター
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <main className="flex h-screen lg:h-[calc(100vh-0px)]">
        {/* サイドバー（デスクトップ） */}
        <div className={`hidden lg:flex flex-col bg-white shadow-lg transition-all duration-300 ${
          showSidebar ? 'w-96' : 'w-0 overflow-hidden'
        }`}>
          {showSidebar && (
            <>
              {/* サイドバーヘッダー */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-bold text-gray-800">地図検索</h1>
                  <button
                    onClick={toggleSidebar}
                    className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  活動を検索・フィルターして地図上で確認
                </p>
              </div>

              {/* サイドバーコンテンツ */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-6">
                  {/* 検索バー */}
                  <MapSearchBar
                    filters={filters}
                    onUpdateFilter={updateFilter}
                    onLocationSearch={handleLocationSearch}
                    onCurrentLocation={handleCurrentLocation}
                    isLoading={isLoading}
                  />
                  
                  {/* フィルターパネル */}
                  <MapFilterPanel
                    filters={filters}
                    onUpdateFilter={updateFilter}
                    onClearFilters={clearFilters}
                    activeFilterCount={activeFilterCount}
                    resultCount={filteredActivities.length}
                  />
                  
                  {/* 検索結果 */}
                  <MapSearchResults
                    activities={filteredActivities}
                    userLocation={userLocation}
                    onActivityClick={handleActivityFromResults}
                  />
                </div>
              </div>
            </>
          )}
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

          {/* サイドバートグル（デスクトップ） */}
          {!showSidebar && (
            <div className="hidden lg:block absolute top-4 left-4 z-10">
              <button
                onClick={toggleSidebar}
                className="bg-white shadow-lg p-3 rounded-lg text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* 地図 */}
          <div className="flex-1 relative">
            <GoogleMap
              center={center}
              zoom={13}
              markers={markers}
              onMapClick={handleMapClick}
              onMapLoad={handleMapLoad}
              height="100%"
              className="w-full h-full"
            >
              {/* 社会活動マーカー */}
              <SocialActivityMarkers
                map={map}
                selectedCategories={filters.categories.length > 0 ? filters.categories : ['work', 'help', 'volunteer', 'seminar', 'event', 'meeting']}
                onMarkerClick={handleActivityMarkerClick}
                onClusterClick={handleClusterClick}
                userLocation={userLocation}
                activities={filteredActivities}
              />
              
              {/* 活動詳細InfoWindow */}
              <ActivityInfoWindow
                activity={selectedActivity}
                map={map}
                userLocation={userLocation}
                onClose={handleInfoWindowClose}
                onViewDetails={handleViewActivityDetails}
              />
            </GoogleMap>
          </div>
        </div>

        {/* モバイル用ドロワー */}
        <MapMobileDrawer
          isOpen={showMobileDrawer}
          onClose={() => setShowMobileDrawer(false)}
          activeTab={mobileActiveTab}
          onTabChange={handleMobileTabChange}
          filters={filters}
          onUpdateFilter={updateFilter}
          onClearFilters={clearFilters}
          onLocationSearch={handleLocationSearch}
          onCurrentLocation={handleCurrentLocation}
          activeFilterCount={activeFilterCount}
          resultCount={filteredActivities.length}
          isLoading={isLoading}
        />

        {/* クラスター活動モーダル */}
        <ClusterActivitiesModal
          activities={clusterActivities}
          isOpen={showClusterModal}
          onClose={() => setShowClusterModal(false)}
          onSelectActivity={handleSelectActivityFromCluster}
          userLocation={userLocation}
        />
      </main>
    </div>
  );
}
                <button
                  onClick={toggleSidebar}
                  className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                活動を検索・フィルターして地図上で確認
              </p>
            </div>

            {/* サイドバーコンテンツ */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-6">
                {/* 検索バー */}
                <MapSearchBar
                  filters={filters}
                  onUpdateFilter={updateFilter}
                  onLocationSearch={handleLocationSearch}
                  onCurrentLocation={handleCurrentLocation}
                  isLoading={isLoading}
                />
                
                {/* フィルターパネル */}
                <MapFilterPanel
                  filters={filters}
                  onUpdateFilter={updateFilter}
                  onClearFilters={clearFilters}
                  activeFilterCount={activeFilterCount}
                  resultCount={filteredActivities.length}
                />
                
                {/* 検索結果 */}
                <MapSearchResults
                  activities={filteredActivities}
                  userLocation={userLocation}
                  onActivityClick={handleActivityFromResults}
                />
              </div>
            </div>
          </>
        )}
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

        {/* サイドバートグル（デスクトップ） */}
        {!showSidebar && (
          <div className="hidden lg:block absolute top-4 left-4 z-10">
            <button
              onClick={toggleSidebar}
              className="bg-white shadow-lg p-3 rounded-lg text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* 地図 */}
        <div className="flex-1 relative">
          <GoogleMap
            center={center}
            zoom={13}
            markers={markers}
            onMapClick={handleMapClick}
            onMapLoad={handleMapLoad}
            height="100%"
            className="w-full h-full"
          >
            {/* 社会活動マーカー */}
            <SocialActivityMarkers
              map={map}
              selectedCategories={filters.categories.length > 0 ? filters.categories : ['work', 'help', 'volunteer', 'seminar', 'event', 'meeting']}
              onMarkerClick={handleActivityMarkerClick}
              onClusterClick={handleClusterClick}
              userLocation={userLocation}
              activities={filteredActivities}
            />
            
            {/* 活動詳細InfoWindow */}
            <ActivityInfoWindow
              activity={selectedActivity}
              map={map}
              userLocation={userLocation}
              onClose={handleInfoWindowClose}
              onViewDetails={handleViewActivityDetails}
            />
          </GoogleMap>
        </div>
      </div>

      {/* モバイル用ドロワー */}
      <MapMobileDrawer
        isOpen={showMobileDrawer}
        onClose={() => setShowMobileDrawer(false)}
        activeTab={mobileActiveTab}
        onTabChange={handleMobileTabChange}
        filters={filters}
        onUpdateFilter={updateFilter}
        onClearFilters={clearFilters}
        onLocationSearch={handleLocationSearch}
        onCurrentLocation={handleCurrentLocation}
        activeFilterCount={activeFilterCount}
        resultCount={filteredActivities.length}
        isLoading={isLoading}
      />
          onClose={() => setShowMobileDrawer(false)}
          activeTab={mobileActiveTab}
          onTabChange={handleMobileTabChange}
          filters={filters}
          onUpdateFilter={updateFilter}
          onClearFilters={clearFilters}
          onLocationSearch={handleLocationSearch}
          onCurrentLocation={handleCurrentLocation}
          activeFilterCount={activeFilterCount}
          resultCount={filteredActivities.length}
          isLoading={isLoading}
        />

        {/* クラスター活動モーダル */}
        <ClusterActivitiesModal
          activities={clusterActivities}
          isOpen={showClusterModal}
          onClose={() => setShowClusterModal(false)}
          onSelectActivity={handleSelectActivityFromCluster}
          userLocation={userLocation}
        />
      </main>
    </div>
  );
}
