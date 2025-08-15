'use client';

import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  MapPin, 
  Clock, 
  Car, 
  Train, 
  Bus, 
  Footprints,
  ExternalLink,
  X,
  AlertCircle
} from 'lucide-react';
import { SocialActivity } from '@/types/activity';

interface RouteDirectionsProps {
  activity: SocialActivity;
  userLocation: google.maps.LatLngLiteral | null;
  onClose: () => void;
}

interface RouteOption {
  mode: 'walking' | 'transit' | 'driving';
  icon: React.ReactNode;
  name: string;
  duration: string;
  distance: string;
  description: string;
  color: string;
}

export function RouteDirections({ activity, userLocation, onClose }: RouteDirectionsProps) {
  const [selectedMode, setSelectedMode] = useState<'walking' | 'transit' | 'driving'>('walking');
  const [routeOptions, setRouteOptions] = useState<RouteOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ルートオプションの初期化
  useEffect(() => {
    if (userLocation && activity.location.coordinates) {
      calculateRoutes();
    }
  }, [userLocation, activity.location.coordinates]);

  const calculateRoutes = async () => {
    if (!userLocation || !activity.location.coordinates) return;

    setLoading(true);
    setError(null);

    try {
      const directionsService = new google.maps.DirectionsService();
      
      // 各交通手段のルートを計算
      const modes: Array<{ 
        mode: google.maps.TravelMode; 
        key: 'walking' | 'transit' | 'driving';
        icon: React.ReactNode;
        name: string;
        color: string;
      }> = [
        { 
          mode: google.maps.TravelMode.WALKING, 
          key: 'walking',
          icon: <Footprints className="w-5 h-5" />,
          name: '徒歩',
          color: 'bg-green-100 text-green-800'
        },
        { 
          mode: google.maps.TravelMode.TRANSIT, 
          key: 'transit',
          icon: <Train className="w-5 h-5" />,
          name: '公共交通機関',
          color: 'bg-blue-100 text-blue-800'
        },
        { 
          mode: google.maps.TravelMode.DRIVING, 
          key: 'driving',
          icon: <Car className="w-5 h-5" />,
          name: '車',
          color: 'bg-purple-100 text-purple-800'
        }
      ];

      const options: RouteOption[] = [];

      for (const modeConfig of modes) {
        try {
          const result = await directionsService.route({
            origin: userLocation,
            destination: activity.location.coordinates,
            travelMode: modeConfig.mode,
            transitOptions: modeConfig.mode === google.maps.TravelMode.TRANSIT ? {
              modes: [google.maps.TransitMode.BUS, google.maps.TransitMode.RAIL, google.maps.TransitMode.SUBWAY],
              routingPreference: google.maps.TransitRoutePreference.FEWER_TRANSFERS
            } : undefined
          });

          if (result.routes && result.routes.length > 0) {
            const route = result.routes[0];
            const leg = route.legs[0];
            
            let description = '';
            if (modeConfig.mode === google.maps.TravelMode.TRANSIT && leg.steps) {
              const transitSteps = leg.steps.filter(step => step.transit);
              if (transitSteps.length > 0) {
                description = transitSteps.map(step => 
                  `${step.transit?.line?.name || ''}${step.transit?.line?.short_name ? `(${step.transit.line.short_name})` : ''}`
                ).join(' → ');
              }
            } else if (modeConfig.mode === google.maps.TravelMode.WALKING) {
              description = '最短ルートで案内します';
            } else if (modeConfig.mode === google.maps.TravelMode.DRIVING) {
              description = '一般道路を利用したルート';
            }

            options.push({
              mode: modeConfig.key,
              icon: modeConfig.icon,
              name: modeConfig.name,
              duration: leg.duration?.text || '',
              distance: leg.distance?.text || '',
              description,
              color: modeConfig.color
            });
          }
        } catch (err) {
          console.warn(`${modeConfig.name}のルート計算に失敗:`, err);
        }
      }

      setRouteOptions(options);
      if (options.length > 0) {
        setSelectedMode(options[0].mode);
      }
    } catch (err) {
      console.error('ルート計算に失敗:', err);
      setError('ルート計算に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const openInGoogleMaps = () => {
    if (!userLocation || !activity.location.coordinates) return;

    const origin = `${userLocation.lat},${userLocation.lng}`;
    const destination = `${activity.location.coordinates.lat},${activity.location.coordinates.lng}`;
    
    let travelMode = '';
    switch (selectedMode) {
      case 'walking':
        travelMode = 'walking';
        break;
      case 'transit':
        travelMode = 'transit';
        break;
      case 'driving':
        travelMode = 'driving';
        break;
    }

    const url = `https://www.google.com/maps/dir/${origin}/${destination}/@${destination},15z/data=!3m1!4b1!4m2!4m1!3e${
      selectedMode === 'walking' ? '2' : selectedMode === 'transit' ? '3' : '0'
    }`;
    
    window.open(url, '_blank');
  };

  const selectedRoute = routeOptions.find(option => option.mode === selectedMode);

  if (!userLocation) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">ルート案内</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        <div className="flex items-center space-x-3 text-amber-600 bg-amber-50 p-4 rounded-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>ルート案内を表示するには、現在地の取得が必要です。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* ヘッダー */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">ルート案内</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="p-4">
        {/* 目的地情報 */}
        <div className="mb-6">
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-800">{activity.title}</h4>
              <p className="text-sm text-gray-600">{activity.location.address}</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">ルートを計算中...</p>
          </div>
        ) : error ? (
          <div className="flex items-center space-x-3 text-red-600 bg-red-50 p-4 rounded-lg mb-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        ) : routeOptions.length > 0 ? (
          <>
            {/* 交通手段選択 */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">交通手段を選択</h4>
              <div className="grid grid-cols-1 gap-2">
                {routeOptions.map((option) => (
                  <button
                    key={option.mode}
                    onClick={() => setSelectedMode(option.mode)}
                    className={`p-4 rounded-lg border-2 transition-colors text-left ${
                      selectedMode === option.mode
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className={`p-2 rounded-lg ${option.color}`}>
                          {option.icon}
                        </span>
                        <div>
                          <div className="font-semibold text-gray-800">{option.name}</div>
                          <div className="text-sm text-gray-600">{option.description}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-800">{option.duration}</div>
                        <div className="text-sm text-gray-600">{option.distance}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 選択されたルートの詳細 */}
            {selectedRoute && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center space-x-3 mb-3">
                  <span className={`p-2 rounded-lg ${selectedRoute.color}`}>
                    {selectedRoute.icon}
                  </span>
                  <div>
                    <h4 className="font-semibold text-gray-800">{selectedRoute.name}でのルート</h4>
                    <p className="text-sm text-gray-600">{selectedRoute.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="flex items-center justify-center space-x-1 text-gray-600 mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">所要時間</span>
                    </div>
                    <div className="font-semibold text-lg text-gray-800">{selectedRoute.duration}</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center space-x-1 text-gray-600 mb-1">
                      <Navigation className="w-4 h-4" />
                      <span className="text-sm">距離</span>
                    </div>
                    <div className="font-semibold text-lg text-gray-800">{selectedRoute.distance}</div>
                  </div>
                </div>
              </div>
            )}

            {/* アクションボタン */}
            <div className="space-y-3">
              <button
                onClick={openInGoogleMaps}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <ExternalLink className="w-5 h-5" />
                <span>Google Mapsで開く</span>
              </button>
              
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Google Mapsアプリでより詳細なナビゲーションをご利用いただけます
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">ルート情報を取得できませんでした</p>
          </div>
        )}
      </div>
    </div>
  );
}
