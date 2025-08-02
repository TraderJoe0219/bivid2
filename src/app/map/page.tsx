'use client';

import React, { useState, useCallback } from 'react';
import { GoogleMap } from '@/components/maps/GoogleMap';
import { MapSearch } from '@/components/maps/MapSearch';
import { DEFAULT_CENTER } from '@/lib/maps';
import { AlertCircle, X } from 'lucide-react';

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

  // 場所選択時の処理
  const handleLocationSelect = useCallback((location: LocationData) => {
    setCenter({ lat: location.lat, lng: location.lng });
    setSelectedLocation(location);
    
    // マーカーを追加
    const newMarker: MarkerData = {
      id: `location-${Date.now()}`,
      position: { lat: location.lat, lng: location.lng },
      title: '選択した場所',
      info: location.address || `緯度: ${location.lat.toFixed(6)}, 経度: ${location.lng.toFixed(6)}`
    };
    
    setMarkers([newMarker]);
    setError(null);
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">地図検索</h1>
              <p className="text-gray-600 mt-1">場所を検索して、スキルを提供する場所を見つけましょう</p>
            </div>
          </div>
        </div>
      </header>

      {/* エラー表示 */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
            <button
              onClick={closeError}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 検索パネル */}
          <div className="lg:col-span-1">
            <MapSearch
              onLocationSelect={handleLocationSelect}
              onError={handleError}
            />
            
            {/* 選択した場所の情報 */}
            {selectedLocation && (
              <div className="mt-4 bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">選択した場所</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    <span className="font-semibold">住所:</span> {selectedLocation.address || '住所不明'}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">緯度:</span> {selectedLocation.lat.toFixed(6)}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">経度:</span> {selectedLocation.lng.toFixed(6)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 地図表示エリア */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-800">地図</h2>
                <p className="text-gray-600 text-sm mt-1">
                  地図をクリックして場所を選択できます
                </p>
              </div>
              
              <GoogleMap
                center={center}
                zoom={13}
                markers={markers}
                onMapClick={handleMapClick}
                height="500px"
                className="rounded-lg overflow-hidden"
              />
            </div>
          </div>
        </div>

        {/* 使い方ガイド */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">地図の使い方</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-orange-600 font-bold text-lg">1</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">住所を検索</h3>
              <p className="text-gray-600 text-sm">
                検索ボックスに住所を入力して、その場所を地図上に表示します
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold text-lg">2</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">現在地を取得</h3>
              <p className="text-gray-600 text-sm">
                「現在地を取得」ボタンで今いる場所を地図上に表示します
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold text-lg">3</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">地図を操作</h3>
              <p className="text-gray-600 text-sm">
                地図をドラッグして移動、ピンチやマウスホイールで拡大・縮小できます
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
