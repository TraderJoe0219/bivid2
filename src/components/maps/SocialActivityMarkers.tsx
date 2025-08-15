'use client'

import { useEffect, useState, useCallback } from 'react'
import { SocialActivity, getSocialActivities } from '@/lib/socialActivities'
import { 
  getMarkerConfig, 
  createMarkerIcon, 
  createClusterIcon,
  getMarkerSize,
  getCategoryDisplayName 
} from '@/lib/mapMarkers'

interface SocialActivityMarkersProps {
  map: google.maps.Map | null
  selectedCategories: string[]
  onMarkerClick?: (activity: SocialActivity) => void
  onClusterClick?: (activities: SocialActivity[]) => void
  userLocation?: { lat: number; lng: number }
  maxDistance?: number
}

interface MarkerCluster {
  position: { lat: number; lng: number }
  activities: SocialActivity[]
  marker: google.maps.Marker
}

export default function SocialActivityMarkers({
  map,
  selectedCategories,
  onMarkerClick,
  onClusterClick,
  userLocation,
  maxDistance = 10
}: SocialActivityMarkersProps) {
  console.log('🔥 SocialActivityMarkers component initialized!', { map: !!map, selectedCategories })
  
  const [activities, setActivities] = useState<SocialActivity[]>([])
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])
  const [clusters, setClusters] = useState<MarkerCluster[]>([])
  const [loading, setLoading] = useState(false)

  // 社会活動データを取得
  const fetchActivities = useCallback(async () => {
    if (!map) {
      console.log('🚫 SocialActivityMarkers: map is null, skipping fetch')
      return
    }

    console.log('🔍 SocialActivityMarkers: fetching activities with filters:', {
      categories: selectedCategories,
      userLocation,
      maxDistance
    })

    setLoading(true)
    try {
      const filters = {
        categories: selectedCategories.length > 0 ? selectedCategories : undefined,
        location: userLocation,
        maxDistance: userLocation ? maxDistance : undefined,
        hasAvailableSlots: true
      }

      const data = await getSocialActivities(filters)
      console.log('✅ SocialActivityMarkers: fetched activities:', data.length, 'items', data)
      setActivities(data)
    } catch (error) {
      console.error('社会活動データの取得に失敗しました:', error)
    } finally {
      setLoading(false)
    }
  }, [map, selectedCategories, userLocation])

  // マーカーをクリア
  const clearMarkers = useCallback(() => {
    markers.forEach(marker => marker.setMap(null))
    setMarkers([])
    
    clusters.forEach(cluster => cluster.marker.setMap(null))
    setClusters([])
  }, [])

  // マーカーをクラスタリング
  const clusterMarkers = useCallback((activities: SocialActivity[], zoomLevel: number) => {
    if (zoomLevel >= 15) {
      // 高ズームレベルでは個別マーカーを表示
      return activities.map(activity => ({ activities: [activity], position: activity.location.coordinates! }))
    }

    const clusters: { activities: SocialActivity[]; position: { lat: number; lng: number } }[] = []
    const clusterRadius = zoomLevel >= 12 ? 0.01 : 0.02 // クラスタリング半径

    activities.forEach(activity => {
      if (!activity.location.coordinates) return

      const existingCluster = clusters.find(cluster => {
        const distance = Math.sqrt(
          Math.pow(cluster.position.lat - activity.location.coordinates!.lat, 2) +
          Math.pow(cluster.position.lng - activity.location.coordinates!.lng, 2)
        )
        return distance < clusterRadius
      })

      if (existingCluster) {
        existingCluster.activities.push(activity)
      } else {
        clusters.push({
          activities: [activity],
          position: activity.location.coordinates
        })
      }
    })

    return clusters
  }, [])

  // マーカーを作成・更新
  const updateMarkers = useCallback(() => {
    if (!map) return

    clearMarkers()

    const validActivities = activities.filter(activity => 
      activity.location.coordinates && 
      activity.location.coordinates.lat && 
      activity.location.coordinates.lng
    )

    if (validActivities.length === 0) return

    const zoomLevel = map.getZoom() || 12
    const clusteredData = clusterMarkers(validActivities, zoomLevel)
    const markerSize = getMarkerSize(zoomLevel)

    const newMarkers: google.maps.Marker[] = []
    const newClusters: MarkerCluster[] = []

    clusteredData.forEach(cluster => {
      if (cluster.activities.length === 1) {
        // 単一マーカー
        const activity = cluster.activities[0]
        const config = getMarkerConfig(activity.category)
        const icon = createMarkerIcon(config, markerSize)

        const marker = new google.maps.Marker({
          position: cluster.position,
          map: map,
          title: activity.title,
          icon: {
            url: icon,
            scaledSize: new google.maps.Size(markerSize, markerSize + 10),
            anchor: new google.maps.Point(markerSize / 2, markerSize + 10)
          },
          zIndex: 1000
        })

        marker.addListener('click', () => {
          onMarkerClick?.(activity)
        })

        newMarkers.push(marker)
      } else {
        // クラスターマーカー
        const clusterIcon = createClusterIcon(cluster.activities.length, markerSize + 10)

        const marker = new google.maps.Marker({
          position: cluster.position,
          map: map,
          title: `${cluster.activities.length}件の活動`,
          icon: {
            url: clusterIcon,
            scaledSize: new google.maps.Size(markerSize + 10, markerSize + 10),
            anchor: new google.maps.Point((markerSize + 10) / 2, (markerSize + 10) / 2)
          },
          zIndex: 2000
        })

        marker.addListener('click', () => {
          if (map.getZoom()! < 16) {
            // ズームイン
            map.setZoom(map.getZoom()! + 2)
            map.setCenter(cluster.position)
          } else {
            // クラスター詳細を表示
            onClusterClick?.(cluster.activities)
          }
        })

        const clusterData: MarkerCluster = {
          position: cluster.position,
          activities: cluster.activities,
          marker
        }

        newMarkers.push(marker)
        newClusters.push(clusterData)
      }
    })

    setMarkers(newMarkers)
    setClusters(newClusters)
  }, [map, activities, onMarkerClick, onClusterClick])

  // データ取得
  useEffect(() => {
    console.log('📊 SocialActivityMarkers: useEffect for fetchActivities triggered')
    fetchActivities()
  }, [fetchActivities])

  // マーカー更新
  useEffect(() => {
    console.log('📍 SocialActivityMarkers: useEffect for updateMarkers triggered, activities count:', activities.length)
    updateMarkers()
  }, [updateMarkers])

  // ズーム変更時のマーカー更新
  useEffect(() => {
    if (!map) return

    const zoomListener = map.addListener('zoom_changed', () => {
      setTimeout(updateMarkers, 100) // 少し遅延させてズーム完了を待つ
    })

    return () => {
      google.maps.event.removeListener(zoomListener)
    }
  }, [map, updateMarkers])

  // クリーンアップ
  useEffect(() => {
    return () => {
      clearMarkers()
    }
  }, [clearMarkers])

  return null // このコンポーネントは描画要素を持たない
}

/**
 * カテゴリフィルターコンポーネント
 */
interface CategoryFilterProps {
  selectedCategories: string[]
  onCategoryChange: (categories: string[]) => void
  className?: string
}

export function CategoryFilter({ 
  selectedCategories, 
  onCategoryChange, 
  className = '' 
}: CategoryFilterProps) {
  const socialCategories = [
    'work', 'help', 'volunteer', 'seminar', 'event', 'meeting'
  ]

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category))
    } else {
      onCategoryChange([...selectedCategories, category])
    }
  }

  const toggleAll = () => {
    if (selectedCategories.length === socialCategories.length) {
      onCategoryChange([])
    } else {
      onCategoryChange(socialCategories)
    }
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">活動カテゴリ</h3>
        <button
          onClick={toggleAll}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {selectedCategories.length === socialCategories.length ? 'すべて解除' : 'すべて選択'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {socialCategories.map(category => {
          const config = getMarkerConfig(category)
          const isSelected = selectedCategories.includes(category)

          return (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`
                flex items-center space-x-2 p-3 rounded-lg border-2 transition-all
                ${isSelected 
                  ? `border-[${config.color}] bg-[${config.bgColor}] text-[${config.textColor}]`
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }
              `}
              style={isSelected ? {
                borderColor: config.color,
                backgroundColor: config.bgColor,
                color: config.textColor
              } : {}}
            >
              <span className="text-xl">{config.emoji}</span>
              <span className="text-sm font-medium">
                {getCategoryDisplayName(category)}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
