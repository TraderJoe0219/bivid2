import { GeoPoint } from '@/types'

/**
 * Haversine距離の計算（2点間の距離をkm単位で返す）
 */
export function calculateDistance(
  point1: GeoPoint,
  point2: GeoPoint
): number {
  const R = 6371 // 地球の半径（km）

  const lat1Rad = toRadians(point1.latitude)
  const lat2Rad = toRadians(point2.latitude)
  const deltaLatRad = toRadians(point2.latitude - point1.latitude)
  const deltaLngRad = toRadians(point2.longitude - point1.longitude)

  const a =
    Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) *
    Math.sin(deltaLngRad / 2) * Math.sin(deltaLngRad / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

/**
 * 度をラジアンに変換
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * 距離を読みやすい形式でフォーマット
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`
  } else if (distanceKm < 10) {
    return `${distanceKm.toFixed(1)}km`
  } else {
    return `${Math.round(distanceKm)}km`
  }
}

/**
 * 座標が有効かチェック
 */
export function isValidGeoPoint(point: GeoPoint | undefined | null): point is GeoPoint {
  return (
    point !== null &&
    point !== undefined &&
    typeof point.latitude === 'number' &&
    typeof point.longitude === 'number' &&
    point.latitude >= -90 &&
    point.latitude <= 90 &&
    point.longitude >= -180 &&
    point.longitude <= 180
  )
}

/**
 * 現在地を取得（Promise版）
 */
export function getCurrentPosition(): Promise<GeoPoint> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('位置情報がサポートされていません'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      },
      (error) => {
        reject(new Error(`位置情報の取得に失敗しました: ${error.message}`))
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5分間キャッシュ
      }
    )
  })
}

/**
 * 指定された半径内の座標かチェック
 */
export function isWithinRadius(
  center: GeoPoint,
  point: GeoPoint,
  radiusKm: number
): boolean {
  const distance = calculateDistance(center, point)
  return distance <= radiusKm
}

/**
 * 座標の配列を距離順にソート
 */
export function sortByDistance<T extends { coordinates?: GeoPoint; distance?: number }>(
  items: T[],
  center: GeoPoint
): T[] {
  return items
    .map(item => {
      if (isValidGeoPoint(item.coordinates)) {
        return {
          ...item,
          distance: calculateDistance(center, item.coordinates)
        }
      }
      return {
        ...item,
        distance: Infinity // 座標がない場合は最後にする
      }
    })
    .sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity))
}

/**
 * 検索エリアの境界を取得（地図表示用）
 */
export function getBoundingBox(center: GeoPoint, radiusKm: number) {
  // 概算: 1度 ≈ 111km
  const latDiff = radiusKm / 111
  const lngDiff = radiusKm / (111 * Math.cos(toRadians(center.latitude)))

  return {
    north: center.latitude + latDiff,
    south: center.latitude - latDiff,
    east: center.longitude + lngDiff,
    west: center.longitude - lngDiff
  }
}

/**
 * 日本の都道府県名から大体の座標を取得（フォールバック用）
 */
export function getPrefectureCoordinates(prefecture: string): GeoPoint | null {
  const prefectureCoords: Record<string, GeoPoint> = {
    '北海道': { latitude: 43.0642, longitude: 141.3469 },
    '青森県': { latitude: 40.8244, longitude: 140.7400 },
    '岩手県': { latitude: 39.7036, longitude: 141.1527 },
    '宮城県': { latitude: 38.2682, longitude: 140.8694 },
    '秋田県': { latitude: 39.7186, longitude: 140.1024 },
    '山形県': { latitude: 38.2404, longitude: 140.3634 },
    '福島県': { latitude: 37.7503, longitude: 140.4676 },
    '茨城県': { latitude: 36.3418, longitude: 140.4468 },
    '栃木県': { latitude: 36.5657, longitude: 139.8836 },
    '群馬県': { latitude: 36.3911, longitude: 139.0608 },
    '埼玉県': { latitude: 35.8572, longitude: 139.6489 },
    '千葉県': { latitude: 35.6074, longitude: 140.1065 },
    '東京都': { latitude: 35.6762, longitude: 139.6503 },
    '神奈川県': { latitude: 35.4478, longitude: 139.6425 },
    '新潟県': { latitude: 37.9026, longitude: 139.0232 },
    '富山県': { latitude: 36.6959, longitude: 137.2139 },
    '石川県': { latitude: 36.5944, longitude: 136.6256 },
    '福井県': { latitude: 36.0652, longitude: 136.2215 },
    '山梨県': { latitude: 35.6639, longitude: 138.5681 },
    '長野県': { latitude: 36.6513, longitude: 138.1810 },
    '岐阜県': { latitude: 35.3912, longitude: 136.7223 },
    '静岡県': { latitude: 34.9769, longitude: 138.3831 },
    '愛知県': { latitude: 35.1802, longitude: 136.9066 },
    '三重県': { latitude: 34.7302, longitude: 136.5085 },
    '滋賀県': { latitude: 35.0045, longitude: 135.8686 },
    '京都府': { latitude: 35.0211, longitude: 135.7556 },
    '大阪府': { latitude: 34.6937, longitude: 135.5023 },
    '兵庫県': { latitude: 34.6913, longitude: 135.1830 },
    '奈良県': { latitude: 34.6851, longitude: 135.8052 },
    '和歌山県': { latitude: 34.2261, longitude: 135.1675 },
    '鳥取県': { latitude: 35.5038, longitude: 134.2384 },
    '島根県': { latitude: 35.4723, longitude: 133.0505 },
    '岡山県': { latitude: 34.6617, longitude: 133.9350 },
    '広島県': { latitude: 34.3965, longitude: 132.4596 },
    '山口県': { latitude: 34.1861, longitude: 131.4707 },
    '徳島県': { latitude: 34.0658, longitude: 134.5592 },
    '香川県': { latitude: 34.3401, longitude: 134.0431 },
    '愛媛県': { latitude: 33.8416, longitude: 132.7660 },
    '高知県': { latitude: 33.5597, longitude: 133.5311 },
    '福岡県': { latitude: 33.6064, longitude: 130.4183 },
    '佐賀県': { latitude: 33.2494, longitude: 130.2989 },
    '長崎県': { latitude: 32.7503, longitude: 129.8779 },
    '熊本県': { latitude: 32.7898, longitude: 130.7417 },
    '大分県': { latitude: 33.2382, longitude: 131.6126 },
    '宮崎県': { latitude: 31.9111, longitude: 131.4240 },
    '鹿児島県': { latitude: 31.5602, longitude: 130.5581 },
    '沖縄県': { latitude: 26.2124, longitude: 127.6792 }
  }

  return prefectureCoords[prefecture] || null
}