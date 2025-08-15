import { useState, useCallback, useMemo } from 'react';
import { SearchFilters, DEFAULT_FILTERS } from '@/types/filters';
import { SocialActivity } from '@/lib/socialActivities';

export interface UseMapFiltersReturn {
  filters: SearchFilters;
  updateFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;
  clearFilters: () => void;
  filteredActivities: SocialActivity[];
  activeFilterCount: number;
  isFiltering: boolean;
}

export function useMapFilters(activities: SocialActivity[] = []): UseMapFiltersReturn {
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);

  // フィルター更新
  const updateFilter = useCallback(<K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // フィルタークリア
  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // 距離計算（Haversine formula）
  const calculateDistance = useCallback((
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number => {
    const R = 6371; // 地球の半径（km）
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, []);

  // 日付フィルター
  const isDateInRange = useCallback((activityDate: Date): boolean => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());
    const thisWeekEnd = new Date(thisWeekStart);
    thisWeekEnd.setDate(thisWeekStart.getDate() + 6);
    
    const nextWeekStart = new Date(thisWeekEnd);
    nextWeekStart.setDate(thisWeekEnd.getDate() + 1);
    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekStart.getDate() + 6);

    switch (filters.dateRange) {
      case 'today':
        return activityDate >= today && activityDate < tomorrow;
      case 'tomorrow':
        const dayAfterTomorrow = new Date(tomorrow);
        dayAfterTomorrow.setDate(tomorrow.getDate() + 1);
        return activityDate >= tomorrow && activityDate < dayAfterTomorrow;
      case 'this_week':
        return activityDate >= thisWeekStart && activityDate <= thisWeekEnd;
      case 'next_week':
        return activityDate >= nextWeekStart && activityDate <= nextWeekEnd;
      case 'custom':
        if (filters.customDateStart && filters.customDateEnd) {
          return activityDate >= filters.customDateStart && activityDate <= filters.customDateEnd;
        }
        return true;
      default:
        return true;
    }
  }, [filters.dateRange, filters.customDateStart, filters.customDateEnd]);

  // 料金フィルター
  const isPriceInRange = useCallback((price: number): boolean => {
    switch (filters.priceRange) {
      case 'free':
        return price === 0;
      case 'under_1000':
        return price < 1000;
      case '1000_to_3000':
        return price >= 1000 && price <= 3000;
      case '3000_to_5000':
        return price >= 3000 && price <= 5000;
      case 'over_5000':
        return price > 5000;
      case 'any':
      default:
        return true;
    }
  }, [filters.priceRange]);

  // フィルター適用済み活動
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      // キーワード検索
      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase();
        const searchText = [
          activity.title,
          activity.description,
          activity.category,
          activity.location.address,
        ].join(' ').toLowerCase();
        
        if (!searchText.includes(keyword)) {
          return false;
        }
      }

      // カテゴリフィルター
      if (filters.categories.length > 0 && !filters.categories.includes(activity.category)) {
        return false;
      }

      // 距離フィルター
      if (filters.location.lat && filters.location.lng) {
        const distance = calculateDistance(
          filters.location.lat,
          filters.location.lng,
          activity.location.lat,
          activity.location.lng
        );
        if (distance > filters.location.radius) {
          return false;
        }
      }

      // 日付フィルター
      if (activity.schedule?.startDate && !isDateInRange(new Date(activity.schedule.startDate))) {
        return false;
      }

      // 料金フィルター
      if (activity.price !== undefined && !isPriceInRange(activity.price)) {
        return false;
      }

      // 提供者性別フィルター
      if (filters.providerGender !== 'any' && activity.organizer?.gender !== filters.providerGender) {
        return false;
      }

      // 提供者年齢フィルター
      if (filters.providerAgeRange !== 'any' && activity.organizer?.ageRange !== filters.providerAgeRange) {
        return false;
      }

      return true;
    });
  }, [activities, filters, calculateDistance, isDateInRange, isPriceInRange]);

  // アクティブなフィルター数
  const activeFilterCount = useMemo(() => {
    let count = 0;
    
    if (filters.keyword) count++;
    if (filters.categories.length > 0) count++;
    if (filters.location.address) count++;
    if (filters.dateRange !== 'this_week') count++;
    if (filters.priceRange !== 'any') count++;
    if (filters.providerGender !== 'any') count++;
    if (filters.providerAgeRange !== 'any') count++;
    
    return count;
  }, [filters]);

  // フィルタリング中かどうか
  const isFiltering = useMemo(() => {
    return activeFilterCount > 0;
  }, [activeFilterCount]);

  return {
    filters,
    updateFilter,
    clearFilters,
    filteredActivities,
    activeFilterCount,
    isFiltering,
  };
}
