'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap } from './GoogleMap';
import { MapSearch } from './MapSearch';
import { Search, Filter, Users, Star, MapPin, Clock } from 'lucide-react';
import { DEFAULT_CENTER, calculateDistance } from '@/lib/maps';

// スキル提供者の型定義
interface SkillProvider {
  id: string;
  name: string;
  avatar?: string;
  skills: string[];
  rating: number;
  reviewCount: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  distance?: number;
  price: number;
  availability: string[];
}

// フィルター条件の型定義
interface SearchFilters {
  skill: string;
  maxDistance: number;
  minRating: number;
  maxPrice: number;
  availability: string;
}

interface SkillMapSearchProps {
  className?: string;
}

// サンプルデータ（実際はFirestoreから取得）
const sampleProviders: SkillProvider[] = [
  {
    id: '1',
    name: '田中 花子',
    skills: ['料理', '和食', '家庭料理'],
    rating: 4.8,
    reviewCount: 24,
    location: {
      lat: 34.7816,
      lng: 135.4689,
      address: '大阪府豊中市本町3-1-1'
    },
    price: 2000,
    availability: ['平日午前', '土日']
  },
  {
    id: '2',
    name: '佐藤 太郎',
    skills: ['園芸', 'ガーデニング', '野菜作り'],
    rating: 4.6,
    reviewCount: 18,
    location: {
      lat: 34.7900,
      lng: 135.4600,
      address: '大阪府豊中市岡町北1-2-3'
    },
    price: 1500,
    availability: ['平日午後', '土日']
  },
  {
    id: '3',
    name: '山田 美代子',
    skills: ['編み物', '手芸', '洋裁'],
    rating: 4.9,
    reviewCount: 31,
    location: {
      lat: 34.7750,
      lng: 135.4750,
      address: '大阪府豊中市蛍池東町2-4-5'
    },
    price: 1800,
    availability: ['平日午前', '平日午後']
  }
];

export const SkillMapSearch: React.FC<SkillMapSearchProps> = ({ className = '' }) => {
  const [center, setCenter] = useState<google.maps.LatLngLiteral>(DEFAULT_CENTER);
  const [providers, setProviders] = useState<SkillProvider[]>(sampleProviders);
  const [filteredProviders, setFilteredProviders] = useState<SkillProvider[]>(sampleProviders);
  const [selectedProvider, setSelectedProvider] = useState<SkillProvider | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    skill: '',
    maxDistance: 10,
    minRating: 0,
    maxPrice: 5000,
    availability: ''
  });
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);

  // 距離計算と並び替え
  const calculateDistances = useCallback((userLoc: google.maps.LatLngLiteral) => {
    const providersWithDistance = providers.map(provider => ({
      ...provider,
      distance: calculateDistance(userLoc, provider.location) / 1000 // km変換
    }));
    
    setProviders(providersWithDistance);
  }, [providers]);

  // フィルタリング処理
  const applyFilters = useCallback(() => {
    let filtered = providers.filter(provider => {
      // スキル検索
      if (filters.skill && !provider.skills.some(skill => 
        skill.toLowerCase().includes(filters.skill.toLowerCase())
      )) {
        return false;
      }

      // 距離フィルター
      if (provider.distance && provider.distance > filters.maxDistance) {
        return false;
      }

      // 評価フィルター
      if (provider.rating < filters.minRating) {
        return false;
      }

      // 価格フィルター
      if (provider.price > filters.maxPrice) {
        return false;
      }

      // 空き時間フィルター
      if (filters.availability && !provider.availability.includes(filters.availability)) {
        return false;
      }

      return true;
    });

    // 距離順でソート
    filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    
    setFilteredProviders(filtered);
  }, [providers, filters]);

  // 場所選択時の処理
  const handleLocationSelect = useCallback((location: { lat: number; lng: number; address?: string }) => {
    setCenter({ lat: location.lat, lng: location.lng });
    setUserLocation({ lat: location.lat, lng: location.lng });
    calculateDistances({ lat: location.lat, lng: location.lng });
  }, [calculateDistances]);

  // マーカークリック時の処理
  const handleMarkerClick = useCallback((markerId: string) => {
    const provider = filteredProviders.find(p => p.id === markerId);
    if (provider) {
      setSelectedProvider(provider);
    }
  }, [filteredProviders]);

  // フィルター適用
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // 地図用マーカーデータ
  const markers = filteredProviders.map(provider => ({
    id: provider.id,
    position: provider.location,
    title: provider.name,
    info: `
      <div class="p-2">
        <h3 class="font-bold text-lg">${provider.name}</h3>
        <p class="text-sm text-gray-600 mb-1">${provider.skills.join(', ')}</p>
        <div class="flex items-center mb-1">
          <span class="text-yellow-500">★</span>
          <span class="text-sm ml-1">${provider.rating} (${provider.reviewCount}件)</span>
        </div>
        <p class="text-sm text-gray-600">¥${provider.price}/時間</p>
        ${provider.distance ? `<p class="text-sm text-gray-500">約${provider.distance.toFixed(1)}km</p>` : ''}
      </div>
    `
  }));

  return (
    <div className={`${className}`}>
      {/* 検索・フィルターセクション */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        {/* 場所検索 */}
        <div className="lg:col-span-1">
          <MapSearch
            onLocationSelect={handleLocationSelect}
            onError={(error) => console.error(error)}
          />
        </div>

        {/* スキル・フィルター検索 */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Filter className="w-5 h-5 mr-2 text-orange-500" />
            スキル検索・フィルター
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* スキル検索 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                スキル
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={filters.skill}
                  onChange={(e) => setFilters(prev => ({ ...prev, skill: e.target.value }))}
                  placeholder="料理、園芸など"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* 距離フィルター */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                最大距離: {filters.maxDistance}km
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={filters.maxDistance}
                onChange={(e) => setFilters(prev => ({ ...prev, maxDistance: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* 評価フィルター */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                最低評価
              </label>
              <select
                value={filters.minRating}
                onChange={(e) => setFilters(prev => ({ ...prev, minRating: parseFloat(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value={0}>指定なし</option>
                <option value={3}>★3.0以上</option>
                <option value={4}>★4.0以上</option>
                <option value={4.5}>★4.5以上</option>
              </select>
            </div>

            {/* 空き時間フィルター */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                空き時間
              </label>
              <select
                value={filters.availability}
                onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">指定なし</option>
                <option value="平日午前">平日午前</option>
                <option value="平日午後">平日午後</option>
                <option value="土日">土日</option>
              </select>
            </div>
          </div>

          {/* 検索結果数 */}
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-1" />
            {filteredProviders.length}件のスキル提供者が見つかりました
          </div>
        </div>
      </div>

      {/* 地図とリスト */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 地図 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">地図</h2>
            <GoogleMap
              center={center}
              zoom={13}
              markers={markers}
              onMarkerClick={handleMarkerClick}
              height="500px"
              className="rounded-lg overflow-hidden"
            />
          </div>
        </div>

        {/* スキル提供者リスト */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">スキル提供者</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredProviders.map(provider => (
                <div
                  key={provider.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedProvider?.id === provider.id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedProvider(provider)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">{provider.name}</h3>
                    <div className="flex items-center text-sm text-yellow-600">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      {provider.rating}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    {provider.skills.join(', ')}
                  </p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {provider.distance ? `約${provider.distance.toFixed(1)}km` : '距離不明'}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Clock className="w-4 h-4 mr-1" />
                    {provider.availability.join(', ')}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-orange-600">
                      ¥{provider.price}/時間
                    </span>
                    <span className="text-sm text-gray-500">
                      {provider.reviewCount}件のレビュー
                    </span>
                  </div>
                </div>
              ))}
              
              {filteredProviders.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>条件に合うスキル提供者が見つかりませんでした</p>
                  <p className="text-sm mt-1">検索条件を変更してお試しください</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillMapSearch;
