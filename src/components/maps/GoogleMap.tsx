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
  className?: string;
  height?: string;
}

export const GoogleMap: React.FC<GoogleMapProps> = ({
  center = DEFAULT_CENTER,
  zoom = 13,
  markers = [],
  onMapClick,
  onMarkerClick,
  className = '',
  height = '400px'
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

    try {
      setIsLoading(true);
      setError(null);

      await mapsLoader.load();

      const mapOptions = getMapOptions(center);
      mapOptions.zoom = zoom;

      const map = new google.maps.Map(mapRef.current, mapOptions);
      mapInstanceRef.current = map;

      // InfoWindow初期化
      infoWindowRef.current = new google.maps.InfoWindow();

      // マップクリックイベント
      if (onMapClick) {
        map.addListener('click', onMapClick);
      }

      setIsLoading(false);
    } catch (err) {
      console.error('地図の初期化に失敗しました:', err);
      setError('地図を読み込めませんでした');
      setIsLoading(false);
    }
  }, [center, zoom, onMapClick]);

  // マーカーの更新
  const updateMarkers = useCallback(() => {
    if (!mapInstanceRef.current) return;

    // 既存のマーカーを削除
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // 新しいマーカーを追加
    markers.forEach(markerData => {
      const marker = new google.maps.Marker({
        position: markerData.position,
        map: mapInstanceRef.current,
        title: markerData.title,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0C7.163 0 0 7.163 0 16c0 16 16 24 16 24s16-8 16-24C32 7.163 24.837 0 16 0z" fill="#E85D04"/>
              <circle cx="16" cy="16" r="8" fill="white"/>
            </svg>
          `)}`,
          scaledSize: new google.maps.Size(32, 40),
          anchor: new google.maps.Point(16, 40)
        }
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
          <p className="text-gray-600 text-lg">{error}</p>
          <button
            onClick={initializeMap}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            再試行
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-2" />
            <p className="text-gray-600">地図を読み込んでいます...</p>
          </div>
        </div>
      )}
      <div
        ref={mapRef}
        className="w-full h-full rounded-lg"
        style={{ minHeight: height }}
      />
    </div>
  );
};

export default GoogleMap;
