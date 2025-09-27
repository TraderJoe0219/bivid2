'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleMap } from './GoogleMap';
import { MapSearch } from './MapSearch';
import { Search, Filter, Users, Star, MapPin, Clock, ExternalLink } from 'lucide-react';
import { DEFAULT_CENTER } from '@/lib/maps';
import { getSampleSkills } from '@/lib/sampleData';
import { calculateDistance } from '@/lib/distance';
import { TOYONAKA_CENTER } from '@/lib/sampleDataToyonaka';

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
  category: string;
  maxDistance: number;
  minRating: number;
  maxPrice: number;
  minPrice: number;
  availability: string;
  sortBy: 'distance' | 'rating' | 'price' | 'reviewCount';
  sortOrder: 'asc' | 'desc';
}

interface SkillMapSearchProps {
  className?: string;
}

// 豊中市のサンプルデータを変換
function convertSkillsToProviders(): SkillProvider[] {
  const skills = getSampleSkills();

  return skills.map(skill => ({
    id: skill.id,
    name: skill.teacher.displayName,
    avatar: skill.teacher.photoURL,
    skills: [skill.category, ...skill.tags.slice(0, 2)], // カテゴリ + タグ2つ
    rating: skill.rating,
    reviewCount: skill.reviewCount,
    location: {
      lat: skill.coordinates?.latitude || skill.teacher.coordinates?.latitude || TOYONAKA_CENTER.latitude,
      lng: skill.coordinates?.longitude || skill.teacher.coordinates?.longitude || TOYONAKA_CENTER.longitude,
      address: skill.location || skill.teacher.location || '豊中市'
    },
    price: skill.price,
    availability: ['平日午前', '平日午後', '土日'].slice(0, Math.floor(Math.random() * 3) + 1) // ランダムに1-3個
  }));
}

const sampleProviders: SkillProvider[] = convertSkillsToProviders();

export const SkillMapSearch: React.FC<SkillMapSearchProps> = ({ className = '' }) => {
  const router = useRouter();
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({
    lat: TOYONAKA_CENTER.latitude,
    lng: TOYONAKA_CENTER.longitude
  });
  const [providers, setProviders] = useState<SkillProvider[]>(sampleProviders);
  const [filteredProviders, setFilteredProviders] = useState<SkillProvider[]>(sampleProviders);
  const [selectedProvider, setSelectedProvider] = useState<SkillProvider | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    skill: '',
    category: '',
    maxDistance: 10,
    minRating: 0,
    maxPrice: 5000,
    minPrice: 0,
    availability: '',
    sortBy: 'distance',
    sortOrder: 'asc'
  });
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);

  // 距離計算と並び替え
  const calculateDistances = useCallback((userLoc: google.maps.LatLngLiteral) => {
    const providersWithDistance = providers.map(provider => ({
      ...provider,
      distance: calculateDistance(
        { latitude: userLoc.lat, longitude: userLoc.lng },
        { latitude: provider.location.lat, longitude: provider.location.lng }
      ) // km単位で返される
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

      // カテゴリフィルター
      if (filters.category && !provider.skills.some(skill => 
        skill.toLowerCase().includes(filters.category.toLowerCase())
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

      // 価格フィルター（範囲）
      if (provider.price > filters.maxPrice || provider.price < filters.minPrice) {
        return false;
      }

      // 空き時間フィルター
      if (filters.availability && !provider.availability.includes(filters.availability)) {
        return false;
      }

      return true;
    });

    // ソート処理
    filtered.sort((a, b) => {
      let aValue: number, bValue: number;
      
      switch (filters.sortBy) {
        case 'distance':
          aValue = a.distance || 999;
          bValue = b.distance || 999;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'reviewCount':
          aValue = a.reviewCount;
          bValue = b.reviewCount;
          break;
        default:
          aValue = a.distance || 999;
          bValue = b.distance || 999;
      }

      return filters.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });
    
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

  // マーカー内ボタンからのナビゲーション処理
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'navigate' && event.data.path) {
        router.push(event.data.path);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [router]);

  // スキル詳細ページに遷移する関数
  const handleViewSkillDetail = useCallback((skillId: string) => {
    router.push(`/skills/${skillId}`);
  }, [router]);

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
        <p class="text-sm text-gray-600">¥${provider.price}/回</p>
        ${provider.distance ? `<p class="text-sm text-gray-500">約${provider.distance.toFixed(1)}km</p>` : ''}
        <button
          onclick="window.parent.postMessage({type: 'navigate', path: '/skills/${provider.id}'}, '*')"
          class="mt-2 bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600 cursor-pointer transition-colors"
        >
          詳細を見る
        </button>
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
          
          {/* 基本検索 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* スキル検索 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                スキル検索
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={filters.skill}
                  onChange={(e) => setFilters(prev => ({ ...prev, skill: e.target.value }))}
                  placeholder="料理、園芸、パソコンなど"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* カテゴリ選択 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                カテゴリ
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">すべてのカテゴリ</option>
                <option value="料理・お菓子作り">料理・お菓子作り</option>
                <option value="園芸・ガーデニング">園芸・ガーデニング</option>
                <option value="手芸・裁縫">手芸・裁縫</option>
                <option value="楽器演奏">楽器演奏</option>
                <option value="パソコン・スマホ">パソコン・スマホ</option>
                <option value="語学">語学</option>
                <option value="書道・絵画">書道・絵画</option>
                <option value="健康・体操">健康・体操</option>
                <option value="その他">その他</option>
              </select>
            </div>

            {/* ソート */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                並び順
              </label>
              <div className="flex space-x-2">
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="distance">距離順</option>
                  <option value="rating">評価順</option>
                  <option value="price">価格順</option>
                  <option value="reviewCount">レビュー数順</option>
                </select>
                <select
                  value={filters.sortOrder}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortOrder: e.target.value as 'asc' | 'desc' }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="asc">昇順</option>
                  <option value="desc">降順</option>
                </select>
              </div>
            </div>
          </div>

          {/* 詳細フィルター */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

            {/* 価格範囲 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                価格範囲
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPrice: parseInt(e.target.value) || 0 }))}
                  placeholder="最低"
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-orange-500"
                />
                <span className="text-gray-500 self-center">〜</span>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value) || 5000 }))}
                  placeholder="最高"
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-orange-500"
                />
              </div>
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

          {/* 検索結果数とリセットボタン */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <Users className="w-4 h-4 mr-1" />
              {filteredProviders.length}件のスキル提供者が見つかりました
              {providers.length !== filteredProviders.length && (
                <span className="ml-2 text-gray-400">
                  （全{providers.length}件中）
                </span>
              )}
            </div>
            <button
              onClick={() => setFilters({
                skill: '',
                category: '',
                maxDistance: 10,
                minRating: 0,
                maxPrice: 5000,
                minPrice: 0,
                availability: '',
                sortBy: 'distance',
                sortOrder: 'asc'
              })}
              className="text-sm text-orange-600 hover:text-orange-700 underline"
            >
              フィルターをリセット
            </button>
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">スキル提供者</h2>
              <div className="text-sm text-gray-500">
                {filters.sortBy === 'distance' && '距離順'}
                {filters.sortBy === 'rating' && '評価順'}
                {filters.sortBy === 'price' && '価格順'}
                {filters.sortBy === 'reviewCount' && 'レビュー数順'}
                {filters.sortOrder === 'desc' && ' (高い順)'}
                {filters.sortOrder === 'asc' && ' (低い順)'}
              </div>
            </div>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {filteredProviders.map((provider, index) => (
                <div
                  key={provider.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedProvider?.id === provider.id
                      ? 'border-orange-500 bg-orange-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                  onClick={() => setSelectedProvider(provider)}
                >
                  {/* ランキング表示 */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                        {index + 1}
                      </span>
                      <h3 className="font-semibold text-gray-800">{provider.name}</h3>
                    </div>
                    <div className="flex items-center text-sm">
                      <Star className="w-4 h-4 mr-1 fill-current text-yellow-500" />
                      <span className="font-medium text-gray-700">{provider.rating}</span>
                      <span className="text-gray-500 ml-1">({provider.reviewCount})</span>
                    </div>
                  </div>
                  
                  {/* スキルタグ */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {provider.skills.slice(0, 3).map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {provider.skills.length > 3 && (
                      <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                        +{provider.skills.length - 3}
                      </span>
                    )}
                  </div>
                  
                  {/* 詳細情報 */}
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{provider.location.address}</span>
                      {provider.distance && (
                        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                          {provider.distance.toFixed(1)}km
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{provider.availability.slice(0, 2).join(', ')}</span>
                      {provider.availability.length > 2 && (
                        <span className="ml-1 text-gray-400">など</span>
                      )}
                    </div>
                  </div>
                  
                  {/* 価格と詳細ボタン */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-orange-600">
                        ¥{provider.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500">/回</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewSkillDetail(provider.id);
                      }}
                      className="inline-flex items-center px-3 py-1 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                    >
                      <span>詳細</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </button>
                  </div>
                </div>
              ))}
              
              {filteredProviders.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    条件に合うスキル提供者が見つかりませんでした
                  </h3>
                  <p className="text-sm mb-4">
                    検索条件を変更してお試しください
                  </p>
                  <div className="text-xs text-gray-400 space-y-1">
                    <p>• スキル名を変更してみる</p>
                    <p>• 距離を広げてみる</p>
                    <p>• 価格範囲を調整してみる</p>
                  </div>
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
