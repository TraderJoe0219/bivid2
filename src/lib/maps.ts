import { Loader } from '@googlemaps/js-api-loader';

// Google Maps API設定
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

// 大阪府豊中市の座標
export const DEFAULT_CENTER = {
  lat: 34.7816,
  lng: 135.4689
};

export const DEFAULT_ZOOM = 13;

// Google Maps APIローダー
export const mapsLoader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY,
  version: 'weekly',
  libraries: ['places', 'geometry']
});

// 地図の初期化オプション
export const getMapOptions = (center = DEFAULT_CENTER): google.maps.MapOptions => ({
  center,
  zoom: DEFAULT_ZOOM,
  mapTypeId: google.maps.MapTypeId.ROADMAP,
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: true,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: true,
  // 高齢者向けのUI設定
  gestureHandling: 'cooperative', // スクロール時の誤操作を防ぐ
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels.text',
      stylers: [{ visibility: 'on' }]
    }
  ]
});

// 現在地を取得する関数
export const getCurrentLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('お使いのブラウザは位置情報をサポートしていません'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      resolve,
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error('位置情報の取得が拒否されました'));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error('位置情報を取得できませんでした'));
            break;
          case error.TIMEOUT:
            reject(new Error('位置情報の取得がタイムアウトしました'));
            break;
          default:
            reject(new Error('位置情報の取得中にエラーが発生しました'));
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5分間キャッシュ
      }
    );
  });
};

// 住所から座標を取得する関数
export const geocodeAddress = async (address: string): Promise<google.maps.LatLng> => {
  await mapsLoader.load();
  
  const geocoder = new google.maps.Geocoder();
  
  return new Promise((resolve, reject) => {
    geocoder.geocode(
      { 
        address: address,
        region: 'JP' // 日本国内に限定
      },
      (results, status) => {
        if (status === 'OK' && results && results[0]) {
          resolve(results[0].geometry.location);
        } else {
          reject(new Error('住所が見つかりませんでした'));
        }
      }
    );
  });
};

// 座標から住所を取得する関数
export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  await mapsLoader.load();
  
  const geocoder = new google.maps.Geocoder();
  
  return new Promise((resolve, reject) => {
    geocoder.geocode(
      { location: { lat, lng } },
      (results, status) => {
        if (status === 'OK' && results && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          reject(new Error('住所を取得できませんでした'));
        }
      }
    );
  });
};

// マーカーのスタイル設定
export const createMarkerIcon = (color: string = '#E85D04'): google.maps.Icon => ({
  url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="12" fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="16" cy="16" r="6" fill="white"/>
    </svg>
  `)}`,
  scaledSize: new google.maps.Size(32, 32),
  anchor: new google.maps.Point(16, 16)
});

// 距離を計算する関数
export const calculateDistance = (
  point1: google.maps.LatLng | google.maps.LatLngLiteral,
  point2: google.maps.LatLng | google.maps.LatLngLiteral
): number => {
  const lat1 = typeof point1.lat === 'function' ? point1.lat() : point1.lat;
  const lng1 = typeof point1.lng === 'function' ? point1.lng() : point1.lng;
  const lat2 = typeof point2.lat === 'function' ? point2.lat() : point2.lat;
  const lng2 = typeof point2.lng === 'function' ? point2.lng() : point2.lng;
  
  return google.maps.geometry.spherical.computeDistanceBetween(
    new google.maps.LatLng(lat1, lng1),
    new google.maps.LatLng(lat2, lng2)
  );
};
