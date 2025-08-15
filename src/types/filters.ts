export interface SearchFilters {
  // 検索関連
  keyword: string;
  location: {
    address: string;
    lat?: number;
    lng?: number;
    radius: number; // km
  };
  
  // カテゴリフィルター
  categories: string[];
  
  // 日時フィルター
  dateRange: 'today' | 'tomorrow' | 'this_week' | 'next_week' | 'custom';
  customDateStart?: Date;
  customDateEnd?: Date;
  
  // 料金フィルター
  priceRange: 'free' | 'under_1000' | '1000_to_3000' | '3000_to_5000' | 'over_5000' | 'any';
  
  // 提供者フィルター
  providerGender: 'male' | 'female' | 'any';
  providerAgeRange: '20s' | '30s' | '40s' | '50s' | '60s' | '70s_plus' | 'any';
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface CategoryOption extends FilterOption {
  color: string;
  icon: string;
}

export const DISTANCE_OPTIONS: FilterOption[] = [
  { value: '1', label: '1km以内' },
  { value: '3', label: '3km以内' },
  { value: '5', label: '5km以内' },
  { value: '10', label: '10km以内' },
];

export const DATE_RANGE_OPTIONS: FilterOption[] = [
  { value: 'today', label: '今日' },
  { value: 'tomorrow', label: '明日' },
  { value: 'this_week', label: '今週' },
  { value: 'next_week', label: '来週' },
  { value: 'custom', label: 'カスタム' },
];

export const PRICE_RANGE_OPTIONS: FilterOption[] = [
  { value: 'free', label: '無料' },
  { value: 'under_1000', label: '〜1,000円' },
  { value: '1000_to_3000', label: '1,000円〜3,000円' },
  { value: '3000_to_5000', label: '3,000円〜5,000円' },
  { value: 'over_5000', label: '5,000円以上' },
  { value: 'any', label: '指定なし' },
];

export const GENDER_OPTIONS: FilterOption[] = [
  { value: 'male', label: '男性' },
  { value: 'female', label: '女性' },
  { value: 'any', label: '指定なし' },
];

export const AGE_RANGE_OPTIONS: FilterOption[] = [
  { value: '20s', label: '20代' },
  { value: '30s', label: '30代' },
  { value: '40s', label: '40代' },
  { value: '50s', label: '50代' },
  { value: '60s', label: '60代' },
  { value: '70s_plus', label: '70代以上' },
  { value: 'any', label: '指定なし' },
];

export const DEFAULT_FILTERS: SearchFilters = {
  keyword: '',
  location: {
    address: '',
    radius: 5,
  },
  categories: [],
  dateRange: 'this_week',
  priceRange: 'any',
  providerGender: 'any',
  providerAgeRange: 'any',
};
