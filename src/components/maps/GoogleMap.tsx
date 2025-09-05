'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { mapsLoader, getMapOptions, DEFAULT_CENTER } from '@/lib/maps';
import { MapPin, Navigation, Search, Loader2 } from 'lucide-react';

interface GoogleMapProps {
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  markers?: Array<{
    id: string;
    position: google.maps.LatLngLiteral;
    title?: string;
    info?: string;
  }>;
  onMapClick?: (event: google.maps.MapMouseEvent) => void;
  onMarkerClick?: (markerId: string) => void;
  onMapLoad?: (map: google.maps.Map) => void;
  className?: string;
  height?: string;
  children?: React.ReactNode;
}

export const GoogleMap: React.FC<GoogleMapProps> = ({
  center = DEFAULT_CENTER,
  zoom = 13,
  markers = [],
  onMapClick,
  onMarkerClick,
  onMapLoad,
  className = '',
  height = '400px',
  children
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 地図の初期化
  const initializeMap = useCallback(async () => {
    if (!mapRef.current) return;

    // モバイルデバイスの判定
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    try {
      setIsLoading(true);
      setError(null);

      console.log('地図初期化開始...');

      // APIキーのチェック
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      console.log('API Key exists:', !!apiKey);
      
      if (!apiKey) {
        throw new Error('Google Maps APIキーが設定されていません');
      }

      // Google Maps APIの読み込み
      console.log('Google Maps API読み込み開始...');
      
      // モバイルデバイスの場合、タイムアウトを延長
      const loadTimeout = isMobile ? 15000 : 10000;
      
      const loadPromise = mapsLoader.load();
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Google Maps APIの読み込みがタイムアウトしました（ネットワークが不安定な可能性があります）'));
        }, loadTimeout);
      });
      
      await Promise.race([loadPromise, timeoutPromise]);
      console.log('Google Maps API読み込み完了');

      // マップオプションの取得
      const mapOptions = getMapOptions(center);
      mapOptions.zoom = zoom;
      console.log('地図オプション:', mapOptions);

      // 地図インスタンスの作成
      console.log('地図インスタンス作成中...');
      const map = new google.maps.Map(mapRef.current, mapOptions);
      mapInstanceRef.current = map;
      console.log('地図インスタンス作成完了');

      // InfoWindow初期化
      infoWindowRef.current = new google.maps.InfoWindow();

      // マップクリックイベント
      if (onMapClick) {
        map.addListener('click', onMapClick);
      }

      // マップ読み込み完了イベント
      google.maps.event.addListenerOnce(map, 'idle', () => {
        console.log('地図読み込み完了');
        setIsLoading(false);
        if (onMapLoad) {
          onMapLoad(map);
        }
      });

      // タイムアウト設定（モバイル環境を考慮して延長）
      const renderTimeout = isMobile ? 15000 : 10000;
      setTimeout(() => {
        if (isLoading) {
          console.log('地図読み込みタイムアウト（レンダリング）');
          setIsLoading(false);
        }
      }, renderTimeout);

    } catch (err) {
      console.error('地図の初期化に失敗しました:', err);
      let errorMessage = '地図を読み込めませんでした';
      
      if (err instanceof Error) {
        console.error('エラー詳細:', err.message);
        if (err.message.includes('APIキー') || err.message.includes('API key')) {
          errorMessage = 'Google Maps APIの設定に問題があります';
        } else if (err.message.includes('quota') || err.message.includes('OVER_QUERY_LIMIT')) {
          errorMessage = 'Google Maps APIの利用制限に達しています';
        } else if (err.message.includes('network') || err.message.includes('Network') || err.message.includes('タイムアウト')) {
          errorMessage = isMobile 
            ? 'ネットワーク接続が不安定です。Wi-Fi環境での利用をお試しください。'
            : 'ネットワークエラーが発生しました';
        } else if (err.message.includes('REQUEST_DENIED')) {
          errorMessage = 'Google Maps APIへのアクセスが拒否されました';
        } else if (err.message.includes('INVALID_REQUEST')) {
          errorMessage = 'Google Maps APIリクエストが無効です';
        }
      }
      
      setError(errorMessage);
      setIsLoading(false);
    }
  }, [center, zoom, onMapClick, onMapLoad, isLoading]);

  // マーカーの更新
  const updateMarkers = useCallback(() => {
    if (!mapInstanceRef.current) return;

    // 既存のマーカーを削除
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // 新しいマーカーを追加（モバイル対応のレガシーMarkerを使用 - AdvancedMarkerはまだ不安定）
    markers.forEach(markerData => {
      // レガシーMarkerを一時的に使用（モバイル互換性のため）
      const marker = new (google.maps as any).Marker({
        position: markerData.position,
        map: mapInstanceRef.current,
        title: markerData.title,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 0C8.954 0 0 8.954 0 20c0 20 20 30 20 30s20-10 20-30C40 8.954 31.046 0 20 0z" fill="#FF4444" stroke="#FFFFFF" stroke-width="2"/>
              <circle cx="20" cy="20" r="10" fill="white"/>
              <circle cx="20" cy="20" r="6" fill="#FF4444"/>
            </svg>
          `)}`,
          scaledSize: new google.maps.Size(40, 50),
          anchor: new google.maps.Point(20, 50)
        },
        // モバイル向けの最適化
        optimized: true,
        clickable: true
      });

      // マーカークリックイベント
      marker.addListener('click', () => {
        if (onMarkerClick) {
          onMarkerClick(markerData.id);
        }

        // InfoWindow表示
        if (markerData.info && infoWindowRef.current) {
          infoWindowRef.current.setContent(`
            <div class="p-2">
              <h3 class="font-bold text-lg mb-1">${markerData.title || ''}</h3>
              <p class="text-sm text-gray-600">${markerData.info}</p>
            </div>
          `);
          infoWindowRef.current.open(mapInstanceRef.current, marker);
        }
      });

      markersRef.current.push(marker);
    });
  }, [markers, onMarkerClick]);

  // 地図の中心を変更
  const panTo = useCallback((newCenter: google.maps.LatLngLiteral) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo(newCenter);
    }
  }, []);

  // ズームレベルを変更
  const setZoom = useCallback((newZoom: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(newZoom);
    }
  }, []);

  // 地図を特定の範囲に合わせる
  const fitBounds = useCallback((bounds: google.maps.LatLngBounds) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds(bounds);
    }
  }, []);

  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  useEffect(() => {
    updateMarkers();
  }, [updateMarkers]);

  // 外部からアクセス可能なメソッドを公開するためのrefを作成
  const mapControlRef = React.useRef<{
    panTo: (newCenter: google.maps.LatLngLiteral) => void;
    setZoom: (newZoom: number) => void;
    fitBounds: (bounds: google.maps.LatLngBounds) => void;
    getMap: () => google.maps.Map | null;
  }>({
    panTo,
    setZoom,
    fitBounds,
    getMap: () => mapInstanceRef.current
  });

  // メソッドを更新
  React.useEffect(() => {
    mapControlRef.current = {
      panTo,
      setZoom,
      fitBounds,
      getMap: () => mapInstanceRef.current
    };
  }, [panTo, setZoom, fitBounds]);

  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}
        style={{ height }}
      >
        <div className="text-center p-6">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 text-lg">地図の読み込みに失敗しました</p>
          <button
            onClick={initializeMap}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ height }} data-testid="google-map-container">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-2" data-testid="loading-spinner" />
            <p className="text-gray-600">地図を読み込み中...</p>
          </div>
        </div>
      )}
      <div
        ref={mapRef}
        className="w-full h-full rounded-lg"
        style={{ minHeight: height }}
      />
      {/* 子コンポーネント（マーカーなど）をレンダリング */}
      {children}
    </div>
  );
};

export default GoogleMap;
