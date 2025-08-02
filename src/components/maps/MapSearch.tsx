'use client';

import React, { useState, useCallback } from 'react';
import { Search, Navigation, MapPin, Loader2 } from 'lucide-react';
import { getCurrentLocation, geocodeAddress, reverseGeocode } from '@/lib/maps';

interface MapSearchProps {
  onLocationSelect: (location: { lat: number; lng: number; address?: string }) => void;
  onError?: (error: string) => void;
  className?: string;
}

export const MapSearch: React.FC<MapSearchProps> = ({
  onLocationSelect,
  onError,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // 住所検索
  const handleAddressSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    
    try {
      const location = await geocodeAddress(searchQuery);
      const address = await reverseGeocode(location.lat(), location.lng());
      
      onLocationSelect({
        lat: location.lat(),
        lng: location.lng(),
        address
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '住所の検索に失敗しました';
      onError?.(errorMessage);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, onLocationSelect, onError]);

  // 現在地取得
  const handleGetCurrentLocation = useCallback(async () => {
    setIsGettingLocation(true);
    
    try {
      const position = await getCurrentLocation();
      const { latitude, longitude } = position.coords;
      
      const address = await reverseGeocode(latitude, longitude);
      
      onLocationSelect({
        lat: latitude,
        lng: longitude,
        address
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '現在地の取得に失敗しました';
      onError?.(errorMessage);
    } finally {
      setIsGettingLocation(false);
    }
  }, [onLocationSelect, onError]);

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <MapPin className="w-5 h-5 mr-2 text-orange-500" />
        場所を検索
      </h3>
      
      {/* 住所検索フォーム */}
      <form onSubmit={handleAddressSearch} className="mb-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="住所を入力してください（例：大阪府豊中市）"
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              disabled={isSearching}
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            <Search className="w-5 h-5" />
            <span className="ml-2 hidden sm:inline">検索</span>
          </button>
        </div>
      </form>

      {/* 現在地取得ボタン */}
      <button
        onClick={handleGetCurrentLocation}
        disabled={isGettingLocation}
        className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-lg"
      >
        {isGettingLocation ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            現在地を取得中...
          </>
        ) : (
          <>
            <Navigation className="w-5 h-5 mr-2" />
            現在地を取得
          </>
        )}
      </button>

      {/* 使い方の説明 */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-700 mb-2">使い方</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 住所を入力して「検索」ボタンを押してください</li>
          <li>• 「現在地を取得」ボタンで今いる場所を表示できます</li>
          <li>• 地図をドラッグして移動、ピンチで拡大・縮小できます</li>
        </ul>
      </div>
    </div>
  );
};

export default MapSearch;
