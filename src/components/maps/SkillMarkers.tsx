'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Skill, SkillMarker, SkillCluster, SkillCategory, SKILL_CATEGORIES } from '@/types/skill'
import { MarkerClusterer } from '@googlemaps/markerclusterer'
import { createAdvancedMarker } from '@/lib/maps'

interface SkillMarkersProps {
  map: google.maps.Map | null
  skills?: Skill[]
  selectedCategories?: SkillCategory[]
  onMarkerClick?: (skill: Skill) => void
  onClusterClick?: (skills: Skill[]) => void
  userLocation?: google.maps.LatLngLiteral
  maxDistance?: number
  showClusters?: boolean
  minZoomForClusters?: number
}

// カテゴリー別マーカーアイコン設定
const getCategoryIcon = (category: SkillCategory, isSelected: boolean = false): google.maps.Icon => {
  const categoryConfig = SKILL_CATEGORIES.find(cat => cat.value === category)
  const iconColor = isSelected ? '#FF6B35' : getCategoryColor(category)
  
  return {
    url: `data:image/svg+xml,${encodeURIComponent(`
      <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 16 16 24 16 24s16-8 16-24C32 7.163 24.837 0 16 0z" 
              fill="${iconColor}" stroke="#fff" stroke-width="2"/>
        <circle cx="16" cy="16" r="8" fill="#fff"/>
        <text x="16" y="20" text-anchor="middle" font-size="12" fill="${iconColor}">
          ${categoryConfig?.icon || '📍'}
        </text>
      </svg>
    `)}`,
    scaledSize: new google.maps.Size(32, 40),
    anchor: new google.maps.Point(16, 40)
  }
}

// カテゴリー別色設定
function getCategoryColor(category: SkillCategory): string {
  const colorMap: Record<SkillCategory, string> = {
    [SkillCategory.COOKING]: '#FF6B35',
    [SkillCategory.GARDENING]: '#4CAF50',
    [SkillCategory.HANDICRAFT]: '#E91E63',
    [SkillCategory.MUSIC]: '#9C27B0',
    [SkillCategory.TECHNOLOGY]: '#2196F3',
    [SkillCategory.LANGUAGE]: '#3F51B5',
    [SkillCategory.ART]: '#F44336',
    [SkillCategory.HEALTH]: '#009688',
    [SkillCategory.OTHER]: '#607D8B'
  }
  return colorMap[category] || '#607D8B'
}

// クラスターアイコン作成
const createClusterIcon = (count: number, averageRating: number): google.maps.Icon => {
  const size = Math.min(60, Math.max(40, 30 + count * 2))
  const color = averageRating >= 4.5 ? '#4CAF50' : averageRating >= 4.0 ? '#FF9800' : '#2196F3'
  
  return {
    url: `data:image/svg+xml,${encodeURIComponent(`
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${size/2}" cy="${size/2}" r="${size/2-2}" fill="${color}" stroke="#fff" stroke-width="3"/>
        <text x="${size/2}" y="${size/2-4}" text-anchor="middle" font-size="14" font-weight="bold" fill="#fff">
          ${count}
        </text>
        <text x="${size/2}" y="${size/2+8}" text-anchor="middle" font-size="10" fill="#fff">
          ★${averageRating.toFixed(1)}
        </text>
      </svg>
    `)}`,
    scaledSize: new google.maps.Size(size, size),
    anchor: new google.maps.Point(size/2, size/2)
  }
}

// 距離計算（ハーバーサイン公式）
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // 地球の半径（km）
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export default function SkillMarkers({
  map,
  skills = [],
  selectedCategories = [],
  onMarkerClick,
  onClusterClick,
  userLocation,
  maxDistance,
  showClusters = true,
  minZoomForClusters = 12
}: SkillMarkersProps) {
  const [markers, setMarkers] = useState<google.maps.marker.AdvancedMarkerElement[]>([])
  const [markerClusterer, setMarkerClusterer] = useState<MarkerClusterer | null>(null)
  const [selectedMarker, setSelectedMarker] = useState<google.maps.marker.AdvancedMarkerElement | null>(null)
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null)

  // フィルタリングされたスキル
  const filteredSkills = useMemo(() => {
    let filtered = skills.filter(skill => {
      // カテゴリフィルター
      if (selectedCategories.length > 0 && !selectedCategories.includes(skill.category)) {
        return false
      }
      
      // 位置情報が必要
      if (!skill.location.coordinates) {
        return false
      }
      
      // 距離フィルター
      if (userLocation && maxDistance && skill.location.coordinates) {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          skill.location.coordinates.lat,
          skill.location.coordinates.lng
        )
        if (distance > maxDistance) {
          return false
        }
      }
      
      return skill.isActive && skill.isApproved
    })
    
    // 距離でソート
    if (userLocation) {
      filtered = filtered.sort((a, b) => {
        if (!a.location.coordinates || !b.location.coordinates) return 0
        
        const distanceA = calculateDistance(
          userLocation.lat, userLocation.lng,
          a.location.coordinates.lat, a.location.coordinates.lng
        )
        const distanceB = calculateDistance(
          userLocation.lat, userLocation.lng,
          b.location.coordinates.lat, b.location.coordinates.lng
        )
        
        return distanceA - distanceB
      })
    }
    
    return filtered
  }, [skills, selectedCategories, userLocation, maxDistance])

  // InfoWindow作成
  const createInfoWindow = useCallback(() => {
    if (!map) return null
    
    return new google.maps.InfoWindow({
      maxWidth: 300,
      pixelOffset: new google.maps.Size(0, -10)
    })
  }, [map])

  // マーカークリック処理
  const handleMarkerClick = useCallback((skill: Skill, marker: google.maps.marker.AdvancedMarkerElement) => {
    // 前のマーカーの選択状態をリセット
    if (selectedMarker && selectedMarker !== marker) {
      // Advanced Markerの場合はcontentを更新
      if (selectedMarker.content && selectedMarker.content instanceof HTMLElement) {
        const categoryConfig = SKILL_CATEGORIES.find(cat => cat.value === (selectedMarker as any).category)
        const iconColor = getCategoryColor((selectedMarker as any).category)
        selectedMarker.content.innerHTML = `
          <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.163 0 0 7.163 0 16c0 16 16 24 16 24s16-8 16-24C32 7.163 24.837 0 16 0z" 
                  fill="${iconColor}" stroke="#fff" stroke-width="2"/>
            <circle cx="16" cy="16" r="8" fill="#fff"/>
            <text x="16" y="20" text-anchor="middle" font-size="12" fill="${iconColor}">
              ${categoryConfig?.icon || '📍'}
            </text>
          </svg>
        `
      }
    }
    
    // 新しいマーカーを選択状態に
    if (marker.content && marker.content instanceof HTMLElement) {
      const categoryConfig = SKILL_CATEGORIES.find(cat => cat.value === skill.category)
      const iconColor = '#FF6B35' // 選択時の色
      marker.content.innerHTML = `
        <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 16 16 24 16 24s16-8 16-24C32 7.163 24.837 0 16 0z" 
                fill="${iconColor}" stroke="#fff" stroke-width="2"/>
          <circle cx="16" cy="16" r="8" fill="#fff"/>
          <text x="16" y="20" text-anchor="middle" font-size="12" fill="${iconColor}">
            ${categoryConfig?.icon || '📍'}
          </text>
        </svg>
      `
    }
    setSelectedMarker(marker)
    
    // InfoWindow表示
    if (!infoWindow) {
      const newInfoWindow = createInfoWindow()
      if (newInfoWindow) {
        setInfoWindow(newInfoWindow)
        showSkillInfoWindow(skill, marker, newInfoWindow)
      }
    } else {
      showSkillInfoWindow(skill, marker, infoWindow)
    }
    
    // 外部ハンドラー呼び出し
    onMarkerClick?.(skill)
  }, [selectedMarker, infoWindow, createInfoWindow, onMarkerClick])

  // InfoWindow内容作成
  const showSkillInfoWindow = useCallback((
    skill: Skill, 
    marker: google.maps.marker.AdvancedMarkerElement, 
    infoWindow: google.maps.InfoWindow
  ) => {
    const distance = userLocation && skill.location.coordinates
      ? calculateDistance(
          userLocation.lat, userLocation.lng,
          skill.location.coordinates.lat, skill.location.coordinates.lng
        )
      : null
    
    const content = `
      <div class="skill-info-window" style="padding: 12px; max-width: 280px;">
        <div style="display: flex; align-items: start; gap: 12px; margin-bottom: 8px;">
          <span style="font-size: 24px;">${SKILL_CATEGORIES.find(cat => cat.value === skill.category)?.icon || '📍'}</span>
          <div style="flex: 1;">
            <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #1f2937; line-height: 1.3;">
              ${skill.title}
            </h3>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <span style="color: #f59e0b; font-size: 14px;">★ ${skill.rating.average.toFixed(1)}</span>
              <span style="color: #6b7280; font-size: 12px;">(${skill.rating.count}件)</span>
              ${distance ? `<span style="color: #6b7280; font-size: 12px;">• ${distance.toFixed(1)}km</span>` : ''}
            </div>
          </div>
        </div>
        
        <p style="margin: 0 0 8px 0; color: #4b5563; font-size: 13px; line-height: 1.4;">
          ${skill.shortDescription || skill.description.slice(0, 80)}${skill.description.length > 80 ? '...' : ''}
        </p>
        
        <div style="display: flex; align-items: center; justify-between; margin-bottom: 8px;">
          <div>
            <span style="color: #1f2937; font-weight: 600; font-size: 14px;">
              ${skill.pricing.amount === 0 ? '無料' : `¥${skill.pricing.amount.toLocaleString()}`}
            </span>
            ${skill.pricing.amount > 0 ? `<span style="color: #6b7280; font-size: 12px;">/${skill.pricing.unit}</span>` : ''}
          </div>
          <span style="background: #dbeafe; color: #1d4ed8; padding: 2px 6px; border-radius: 4px; font-size: 11px;">
            ${skill.location.type === 'online' ? 'オンライン' : skill.location.type === 'offline' ? '対面' : 'ハイブリッド'}
          </span>
        </div>
        
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
          <span style="color: #6b7280; font-size: 12px;">講師:</span>
          <span style="color: #1f2937; font-size: 13px; font-weight: 500;">${skill.teacher.name}</span>
        </div>
        
        <button 
          onclick="if (typeof window !== 'undefined') { window.dispatchEvent(new CustomEvent('skillInfoWindowClick', { detail: '${skill.id}' })) }"
          style="width: 100%; background: #f97316; color: white; border: none; padding: 8px 12px; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; transition: background-color 0.2s;"
          onmouseover="this.style.background='#ea580c'"
          onmouseout="this.style.background='#f97316'"
        >
          詳細を見る
        </button>
      </div>
    `
    
    infoWindow.setContent(content)
    infoWindow.open(map, marker)
  }, [map, userLocation])

  // マーカー作成と管理
  useEffect(() => {
    const createMarkers = async () => {
      if (!map || !filteredSkills.length) {
        return
      }

      // 既存マーカーをクリア
      markers.forEach(marker => {
        if (marker.map) {
          marker.map = null
        }
      })
      if (markerClusterer) {
        markerClusterer.clearMarkers()
      }

      const newMarkers: google.maps.marker.AdvancedMarkerElement[] = []

      // 各スキルにAdvanced Markerを作成
      for (const skill of filteredSkills) {
        if (!skill.location.coordinates) continue

        try {
        // カスタムマーカーコンテンツを作成
        const categoryConfig = SKILL_CATEGORIES.find(cat => cat.value === skill.category)
        const iconColor = getCategoryColor(skill.category)
        
        const markerElement = document.createElement('div')
        markerElement.innerHTML = `
          <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.163 0 0 7.163 0 16c0 16 16 24 16 24s16-8 16-24C32 7.163 24.837 0 16 0z" 
                  fill="${iconColor}" stroke="#fff" stroke-width="2"/>
            <circle cx="16" cy="16" r="8" fill="#fff"/>
            <text x="16" y="20" text-anchor="middle" font-size="12" fill="${iconColor}">
              ${categoryConfig?.icon || '📍'}
            </text>
          </svg>
        `
        markerElement.style.cursor = 'pointer'
        markerElement.style.zIndex = skill.isFeatured ? '1000' : '100'

        const marker = await createAdvancedMarker(
          skill.location.coordinates,
          showClusters ? null as any : map!,
          {
            title: skill.title,
            content: markerElement
          }
        )

        // カスタムプロパティ設定
        ;(marker as any).skillId = skill.id
        ;(marker as any).category = skill.category
        ;(marker as any).skill = skill

        // クリックイベント
        marker.addListener('click', () => {
          handleMarkerClick(skill, marker)
        })

        newMarkers.push(marker)
      } catch (error) {
        console.error('Advanced Markerの作成に失敗しました:', error)
        
        // フォールバックとして従来のMarkerを使用
        const fallbackMarker = new google.maps.Marker({
          position: skill.location.coordinates,
          map: showClusters ? null : map,
          title: skill.title,
          icon: getCategoryIcon(skill.category),
          zIndex: skill.isFeatured ? 1000 : 100
        })

        fallbackMarker.set('skillId', skill.id)
        fallbackMarker.set('category', skill.category)
        fallbackMarker.set('skill', skill)

        fallbackMarker.addListener('click', () => {
          handleMarkerClick(skill, fallbackMarker as any)
        })

        newMarkers.push(fallbackMarker as any)
      }
    }

    setMarkers(newMarkers)

    // クラスター設定
    if (showClusters && newMarkers.length > 0) {
      const clusterer = new MarkerClusterer({
        map,
        markers: newMarkers,
        algorithm: new MarkerClusterer.GridAlgorithm({
          gridSize: 60,
          maxDistance: 20000
        }),
        renderer: {
          render: ({ count, position, markers }) => {
            const skills = markers.map(marker => marker.get('skill')).filter(Boolean)
            const averageRating = skills.reduce((sum, skill) => sum + skill.rating.average, 0) / skills.length || 0
            
            const clusterMarker = new google.maps.Marker({
              position,
              icon: createClusterIcon(count, averageRating),
              zIndex: 10000
            })

            // クラスタークリックイベント
            clusterMarker.addListener('click', () => {
              onClusterClick?.(skills)
              
              // 地図をクラスター位置に移動
              map.panTo(position)
              if (map.getZoom()! < minZoomForClusters) {
                map.setZoom(minZoomForClusters)
              }
            })

            return clusterMarker
          }
        }
      })

      setMarkerClusterer(clusterer)
    }
    }

    createMarkers()
  }, [map, filteredSkills, showClusters, handleMarkerClick, onClusterClick, minZoomForClusters])

  // InfoWindowカスタムイベントリスナー
  useEffect(() => {
    const handleSkillInfoWindowClick = (event: CustomEvent) => {
      const skillId = event.detail
      const skill = filteredSkills.find(s => s.id === skillId)
      if (skill) {
        onMarkerClick?.(skill)
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('skillInfoWindowClick', handleSkillInfoWindowClick as EventListener)
      
      return () => {
        window.removeEventListener('skillInfoWindowClick', handleSkillInfoWindowClick as EventListener)
      }
    }
  }, [filteredSkills, onMarkerClick])

  // ズームレベルによるクラスター制御
  useEffect(() => {
    if (!map || !markerClusterer) return

    const handleZoomChange = () => {
      const zoom = map.getZoom() || 10
      
      if (zoom >= minZoomForClusters) {
        // 高ズームレベルではマーカーを個別表示
        markerClusterer.clearMarkers()
        markers.forEach(marker => marker.setMap(map))
      } else {
        // 低ズームレベルではクラスター表示
        markers.forEach(marker => marker.setMap(null))
        markerClusterer.addMarkers(markers)
      }
    }

    map.addListener('zoom_changed', handleZoomChange)
    
    return () => {
      google.maps.event.clearListeners(map, 'zoom_changed')
    }
  }, [map, markerClusterer, markers, minZoomForClusters])

  // クリーンアップ
  useEffect(() => {
    return () => {
      markers.forEach(marker => marker.setMap(null))
      if (markerClusterer) {
        markerClusterer.clearMarkers()
      }
      if (infoWindow) {
        infoWindow.close()
      }
    }
  }, [])

  return null // このコンポーネントはレンダリングしない
}