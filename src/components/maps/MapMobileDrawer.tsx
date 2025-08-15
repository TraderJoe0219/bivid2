'use client';

import React, { useEffect } from 'react';
import { X, Search, Filter } from 'lucide-react';
import { MapSearchBar } from './MapSearchBar';
import { MapFilterPanel } from './MapFilterPanel';
import { SearchFilters } from '@/types/filters';

interface MapMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'search' | 'filter';
  onTabChange: (tab: 'search' | 'filter') => void;
  filters: SearchFilters;
  onUpdateFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;
  onClearFilters: () => void;
  onLocationSearch: (address: string) => Promise<void>;
  onCurrentLocation: () => Promise<void>;
  activeFilterCount: number;
  resultCount: number;
  isLoading?: boolean;
}

export function MapMobileDrawer({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  filters,
  onUpdateFilter,
  onClearFilters,
  onLocationSearch,
  onCurrentLocation,
  activeFilterCount,
  resultCount,
  isLoading = false,
}: MapMobileDrawerProps) {
  // ドロワー開閉時のスクロール制御
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // ESCキーでドロワーを閉じる
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* オーバーレイ */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* ドロワー */}
      <div className="fixed inset-x-0 bottom-0 bg-white z-50 lg:hidden rounded-t-2xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* ハンドル */}
        <div className="flex justify-center py-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex space-x-1">
            <button
              onClick={() => onTabChange('search')}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors min-h-[44px] ${
                activeTab === 'search'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Search className="w-4 h-4 mr-2" />
              検索
            </button>
            
            <button
              onClick={() => onTabChange('filter')}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors min-h-[44px] relative ${
                activeTab === 'filter'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-4 h-4 mr-2" />
              フィルター
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'search' ? (
            <div className="p-4">
              <MapSearchBar
                filters={filters}
                onUpdateFilter={onUpdateFilter}
                onLocationSearch={onLocationSearch}
                onCurrentLocation={onCurrentLocation}
                isLoading={isLoading}
              />
            </div>
          ) : (
            <MapFilterPanel
              filters={filters}
              onUpdateFilter={onUpdateFilter}
              onClearFilters={onClearFilters}
              activeFilterCount={activeFilterCount}
              resultCount={resultCount}
              className="m-4"
            />
          )}
        </div>

        {/* フッター（結果件数表示） */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              検索結果: <span className="font-semibold text-gray-800">{resultCount}件</span>
            </p>
            <button
              onClick={onClose}
              className="mt-2 w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors min-h-[48px]"
            >
              地図を表示
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
