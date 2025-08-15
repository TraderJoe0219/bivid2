'use client';

import React, { useState } from 'react';
import { 
  Filter, 
  X, 
  Calendar, 
  DollarSign, 
  Users, 
  ChevronDown, 
  ChevronUp,
  RotateCcw
} from 'lucide-react';
import { SearchFilters, DATE_RANGE_OPTIONS, PRICE_RANGE_OPTIONS, GENDER_OPTIONS, AGE_RANGE_OPTIONS } from '@/types/filters';
import { CATEGORY_OPTIONS } from '@/lib/socialActivities';

interface MapFilterPanelProps {
  filters: SearchFilters;
  onUpdateFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
  resultCount: number;
  className?: string;
}

export function MapFilterPanel({
  filters,
  onUpdateFilter,
  onClearFilters,
  activeFilterCount,
  resultCount,
  className = '',
}: MapFilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true,
    date: true,
    price: false,
    provider: false,
  });

  // セクション展開/折りたたみ
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // カテゴリ選択
  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(id => id !== categoryId)
      : [...filters.categories, categoryId];
    
    onUpdateFilter('categories', newCategories);
  };

  // カスタム日付変更
  const handleCustomDateChange = (type: 'start' | 'end', value: string) => {
    const date = value ? new Date(value) : undefined;
    
    if (type === 'start') {
      onUpdateFilter('customDateStart', date);
    } else {
      onUpdateFilter('customDateEnd', date);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {/* ヘッダー */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Filter className="w-5 h-5 mr-2 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-800">フィルター</h2>
            {activeFilterCount > 0 && (
              <span className="ml-2 bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>
          
          {activeFilterCount > 0 && (
            <button
              onClick={onClearFilters}
              className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              クリア
            </button>
          )}
        </div>
        
        <div className="mt-2 text-sm text-gray-600">
          検索結果: <span className="font-semibold text-gray-800">{resultCount}件</span>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* カテゴリフィルター */}
        <div>
          <button
            onClick={() => toggleSection('categories')}
            className="w-full flex items-center justify-between text-left mb-3"
          >
            <h3 className="text-base font-semibold text-gray-800">カテゴリ</h3>
            {expandedSections.categories ? (
              <ChevronUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            )}
          </button>
          
          {expandedSections.categories && (
            <div className="space-y-2">
              {CATEGORY_OPTIONS.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer min-h-[44px]"
                >
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category.id)}
                    onChange={() => handleCategoryToggle(category.id)}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <div className="ml-3 flex items-center">
                    <span className="text-lg mr-2">{category.icon}</span>
                    <span className="text-sm font-medium text-gray-800">
                      {category.name}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* 日時フィルター */}
        <div>
          <button
            onClick={() => toggleSection('date')}
            className="w-full flex items-center justify-between text-left mb-3"
          >
            <h3 className="text-base font-semibold text-gray-800 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              日時
            </h3>
            {expandedSections.date ? (
              <ChevronUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            )}
          </button>
          
          {expandedSections.date && (
            <div className="space-y-2">
              {DATE_RANGE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer min-h-[44px]"
                >
                  <input
                    type="radio"
                    name="dateRange"
                    value={option.value}
                    checked={filters.dateRange === option.value}
                    onChange={(e) => onUpdateFilter('dateRange', e.target.value as any)}
                    className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-800">
                    {option.label}
                  </span>
                </label>
              ))}
              
              {filters.dateRange === 'custom' && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      開始日
                    </label>
                    <input
                      type="date"
                      value={filters.customDateStart ? filters.customDateStart.toISOString().split('T')[0] : ''}
                      onChange={(e) => handleCustomDateChange('start', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      終了日
                    </label>
                    <input
                      type="date"
                      value={filters.customDateEnd ? filters.customDateEnd.toISOString().split('T')[0] : ''}
                      onChange={(e) => handleCustomDateChange('end', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 料金フィルター */}
        <div>
          <button
            onClick={() => toggleSection('price')}
            className="w-full flex items-center justify-between text-left mb-3"
          >
            <h3 className="text-base font-semibold text-gray-800 flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              料金
            </h3>
            {expandedSections.price ? (
              <ChevronUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            )}
          </button>
          
          {expandedSections.price && (
            <div className="space-y-2">
              {PRICE_RANGE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer min-h-[44px]"
                >
                  <input
                    type="radio"
                    name="priceRange"
                    value={option.value}
                    checked={filters.priceRange === option.value}
                    onChange={(e) => onUpdateFilter('priceRange', e.target.value as any)}
                    className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-800">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* 提供者フィルター */}
        <div>
          <button
            onClick={() => toggleSection('provider')}
            className="w-full flex items-center justify-between text-left mb-3"
          >
            <h3 className="text-base font-semibold text-gray-800 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              提供者
            </h3>
            {expandedSections.provider ? (
              <ChevronUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            )}
          </button>
          
          {expandedSections.provider && (
            <div className="space-y-4">
              {/* 性別 */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">性別</h4>
                <div className="space-y-1">
                  {GENDER_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer min-h-[44px]"
                    >
                      <input
                        type="radio"
                        name="providerGender"
                        value={option.value}
                        checked={filters.providerGender === option.value}
                        onChange={(e) => onUpdateFilter('providerGender', e.target.value as any)}
                        className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-800">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 年齢層 */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">年齢層</h4>
                <div className="space-y-1">
                  {AGE_RANGE_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer min-h-[44px]"
                    >
                      <input
                        type="radio"
                        name="providerAgeRange"
                        value={option.value}
                        checked={filters.providerAgeRange === option.value}
                        onChange={(e) => onUpdateFilter('providerAgeRange', e.target.value as any)}
                        className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-800">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
