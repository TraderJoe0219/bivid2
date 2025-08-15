'use client';

import React, { useState, useCallback } from 'react';
import { Search, MapPin, Navigation, X } from 'lucide-react';
import { SearchFilters } from '@/types/filters';

interface MapSearchBarProps {
  filters: SearchFilters;
  onUpdateFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;
  onLocationSearch: (address: string) => Promise<void>;
  onCurrentLocation: () => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

export function MapSearchBar({
  filters,
  onUpdateFilter,
  onLocationSearch,
  onCurrentLocation,
  isLoading = false,
  className = '',
}: MapSearchBarProps) {
  const [searchInput, setSearchInput] = useState(filters.location.address);
  const [keywordInput, setKeywordInput] = useState(filters.keyword);

  // 住所検索
  const handleLocationSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      await onLocationSearch(searchInput.trim());
    }
  }, [searchInput, onLocationSearch]);

  // キーワード検索
  const handleKeywordSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onUpdateFilter('keyword', keywordInput.trim());
  }, [keywordInput, onUpdateFilter]);

  // 現在地取得
  const handleCurrentLocation = useCallback(async () => {
    await onCurrentLocation();
  }, [onCurrentLocation]);

  // 検索クリア
  const clearLocationSearch = useCallback(() => {
    setSearchInput('');
    onUpdateFilter('location', { ...filters.location, address: '' });
  }, [filters.location, onUpdateFilter]);

  const clearKeywordSearch = useCallback(() => {
    setKeywordInput('');
    onUpdateFilter('keyword', '');
  }, [onUpdateFilter]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 住所・場所検索 */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-orange-600" />
          場所を検索
        </h3>
        
        <form onSubmit={handleLocationSearch} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="住所、駅名、施設名を入力"
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              disabled={isLoading}
            />
            {searchInput && (
              <button
                type="button"
                onClick={clearLocationSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading || !searchInput.trim()}
              className="flex-1 bg-orange-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors min-h-[48px] flex items-center justify-center"
            >
              <Search className="w-5 h-5 mr-2" />
              {isLoading ? '検索中...' : '検索'}
            </button>
            
            <button
              type="button"
              onClick={handleCurrentLocation}
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors min-h-[48px] flex items-center justify-center"
              title="現在地を取得"
            >
              <Navigation className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      {/* キーワード検索 */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <Search className="w-5 h-5 mr-2 text-blue-600" />
          活動内容を検索
        </h3>
        
        <form onSubmit={handleKeywordSearch} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="スキル名、活動内容、キーワードを入力"
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {keywordInput && (
              <button
                type="button"
                onClick={clearKeywordSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors min-h-[48px] flex items-center justify-center"
          >
            <Search className="w-5 h-5 mr-2" />
            キーワード検索
          </button>
        </form>
      </div>

      {/* 検索範囲設定 */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">検索範囲</h3>
        
        <div className="grid grid-cols-2 gap-2">
          {[1, 3, 5, 10].map((radius) => (
            <button
              key={radius}
              onClick={() => onUpdateFilter('location', { ...filters.location, radius })}
              className={`px-3 py-2 rounded-lg font-medium transition-colors min-h-[44px] ${
                filters.location.radius === radius
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {radius}km以内
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
