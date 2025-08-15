import { useState, useCallback, useMemo } from 'react';
import { SocialActivity } from '@/types/activity';

export interface MapFilters {
  keyword: string;
  categories: string[];
  distance: number;
  dateRange: 'today' | 'tomorrow' | 'this_week' | 'next_week' | 'all';
  priceRange: 'free' | 'under_1000' | 'under_3000' | 'under_5000' | 'all';
  gender: 'male' | 'female' | 'all';
  ageRange: 'under_30' | '30_50' | 'over_50' | 'all';
  location?: {
    lat: number;
    lng: number;
  };
}

export const DEFAULT_FILTERS: MapFilters = {
  keyword: '',
  categories: [],
  distance: 10,
  dateRange: 'all',
  priceRange: 'all',
  gender: 'all',
  ageRange: 'all',
};

export interface UseMapFiltersReturn {
  filters: MapFilters;
  updateFilter: <K extends keyof MapFilters>(key: K, value: MapFilters[K]) => void;
  clearFilters: () => void;
  filteredActivities: SocialActivity[];
  activeFilterCount: number;
  isFiltering: boolean;
}

// ハーバーサイン公式で距離を計算
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // 地球の半径（km）
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 日付範囲チェック
function isInDateRange(activity: SocialActivity, dateRange: string): boolean {
  if (dateRange === 'all') return true;
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // 簡単な実装 - 実際のスケジュールデータがある場合は適切に実装
  return true;
}

// 価格範囲チェック
function isInPriceRange(activity: SocialActivity, priceRange: string): boolean {
  if (priceRange === 'all') return true;
  
  const price = activity.price.amount;
  
  switch (priceRange) {
    case 'free':
      return price === 0;
    case 'under_1000':
      return price < 1000;
    case 'under_3000':
      return price < 3000;
    case 'under_5000':
      return price < 5000;
    default:
      return true;
  }
}

export function useMapFilters(activities: SocialActivity[] = []): UseMapFiltersReturn {
  const [filters, setFilters] = useState<MapFilters>(DEFAULT_FILTERS);

  // フィルター更新
  const updateFilter = useCallback(<K extends keyof MapFilters>(
    key: K,
    value: MapFilters[K]
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // フィルタークリア
  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // フィルター適用
  const filteredActivities = useMemo(() => {
    let filtered = activities;

    // キーワード検索
    if (filters.keyword.trim()) {
      const keyword = filters.keyword.toLowerCase();
      filtered = filtered.filter(activity =>
        activity.title.toLowerCase().includes(keyword) ||
        activity.description.toLowerCase().includes(keyword) ||
        activity.tags.some(tag => tag.toLowerCase().includes(keyword)) ||
        activity.teacherName.toLowerCase().includes(keyword)
      );
    }

    // カテゴリフィルター
    if (filters.categories.length > 0) {
      filtered = filtered.filter(activity =>
        filters.categories.includes(activity.category)
      );
    }

    // 距離フィルター
    if (filters.location && filters.distance > 0) {
      filtered = filtered.filter(activity => {
        if (!activity.location.coordinates) return false;
        
        const distance = calculateDistance(
          filters.location!.lat,
          filters.location!.lng,
          activity.location.coordinates.lat,
          activity.location.coordinates.lng
        );
        
        return distance <= filters.distance;
      });
    }

    // 日付範囲フィルター
    if (filters.dateRange !== 'all') {
      filtered = filtered.filter(activity =>
        isInDateRange(activity, filters.dateRange)
      );
    }

    // 価格範囲フィルター
    if (filters.priceRange !== 'all') {
      filtered = filtered.filter(activity =>
        isInPriceRange(activity, filters.priceRange)
      );
    }

    // 性別フィルター（簡単な実装 - 実際のデータ構造に応じて調整）
    if (filters.gender !== 'all') {
      // teacherGenderフィールドがあると仮定
      // filtered = filtered.filter(activity => activity.teacherGender === filters.gender);
    }

    // 年齢範囲フィルター（簡単な実装 - 実際のデータ構造に応じて調整）
    if (filters.ageRange !== 'all') {
      // teacherAgeRangeフィールドがあると仮定
      // filtered = filtered.filter(activity => activity.teacherAgeRange === filters.ageRange);
    }

    return filtered;
  }, [activities, filters]);

  // アクティブフィルター数
  const activeFilterCount = useMemo(() => {
    let count = 0;
    
    if (filters.keyword.trim()) count++;
    if (filters.categories.length > 0) count++;
    if (filters.dateRange !== 'all') count++;
    if (filters.priceRange !== 'all') count++;
    if (filters.gender !== 'all') count++;
    if (filters.ageRange !== 'all') count++;
    
    return count;
  }, [filters]);

  // フィルタリング中かどうか
  const isFiltering = useMemo(() => {
    return activeFilterCount > 0 || filters.keyword.trim().length > 0;
  }, [activeFilterCount, filters.keyword]);

  return {
    filters,
    updateFilter,
    clearFilters,
    filteredActivities,
    activeFilterCount,
    isFiltering
  };
}
