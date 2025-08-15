/**
 * 地図マーカーのカテゴリ別設定とユーティリティ
 */

export interface MarkerConfig {
  icon: string
  color: string
  bgColor: string
  borderColor: string
  textColor: string
  emoji: string
}

// カテゴリ別マーカー設定
export const MARKER_CONFIGS: Record<string, MarkerConfig> = {
  work: {
    icon: 'briefcase',
    color: '#2563eb',
    bgColor: '#dbeafe',
    borderColor: '#2563eb',
    textColor: '#1e40af',
    emoji: '🔨'
  },
  help: {
    icon: 'helping-hand',
    color: '#16a34a',
    bgColor: '#dcfce7',
    borderColor: '#16a34a',
    textColor: '#15803d',
    emoji: '🤝'
  },
  volunteer: {
    icon: 'heart-handshake',
    color: '#dc2626',
    bgColor: '#fee2e2',
    borderColor: '#dc2626',
    textColor: '#dc2626',
    emoji: '❤️'
  },
  seminar: {
    icon: 'presentation',
    color: '#eab308',
    bgColor: '#fef3c7',
    borderColor: '#eab308',
    textColor: '#d97706',
    emoji: '🎤'
  },
  event: {
    icon: 'calendar-star',
    color: '#ea580c',
    bgColor: '#fed7aa',
    borderColor: '#ea580c',
    textColor: '#ea580c',
    emoji: '🎉'
  },
  meeting: {
    icon: 'users',
    color: '#7c3aed',
    bgColor: '#ede9fe',
    borderColor: '#7c3aed',
    textColor: '#7c3aed',
    emoji: '📣'
  },
  // 既存のスキルカテゴリ
  cooking: {
    icon: 'chef-hat',
    color: '#f97316',
    bgColor: '#fed7aa',
    borderColor: '#f97316',
    textColor: '#ea580c',
    emoji: '👨‍🍳'
  },
  gardening: {
    icon: 'flower',
    color: '#22c55e',
    bgColor: '#dcfce7',
    borderColor: '#22c55e',
    textColor: '#16a34a',
    emoji: '🌸'
  }
}

// デフォルトマーカー設定
export const DEFAULT_MARKER_CONFIG: MarkerConfig = {
  icon: 'map-pin',
  color: '#6b7280',
  bgColor: '#f3f4f6',
  borderColor: '#6b7280',
  textColor: '#4b5563',
  emoji: '📍'
}

/**
 * カテゴリに基づいてマーカー設定を取得
 */
export function getMarkerConfig(category: string): MarkerConfig {
  return MARKER_CONFIGS[category] || DEFAULT_MARKER_CONFIG
}

/**
 * SVGマーカーアイコンを生成
 */
export function createMarkerIcon(config: MarkerConfig, size: number = 40): string {
  const { emoji, color, bgColor, borderColor } = config
  
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg width="${size}" height="${size + 10}" viewBox="0 0 ${size} ${size + 10}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.3"/>
        </filter>
      </defs>
      
      <!-- マーカーの背景 -->
      <circle 
        cx="${size / 2}" 
        cy="${size / 2}" 
        r="${size / 2 - 2}" 
        fill="${bgColor}" 
        stroke="${borderColor}" 
        stroke-width="3"
        filter="url(#shadow)"
      />
      
      <!-- 絵文字 -->
      <text 
        x="${size / 2}" 
        y="${size / 2 + 6}" 
        text-anchor="middle" 
        font-size="${size * 0.5}" 
        font-family="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif"
      >${emoji}</text>
      
      <!-- 下部の三角形（ピン形状） -->
      <polygon 
        points="${size / 2},${size - 2} ${size / 2 - 6},${size - 12} ${size / 2 + 6},${size - 12}" 
        fill="${color}" 
        filter="url(#shadow)"
      />
    </svg>
  `)}`
}

/**
 * クラスター用のマーカーアイコンを生成
 */
export function createClusterIcon(count: number, size: number = 50): string {
  const bgColor = count > 10 ? '#dc2626' : count > 5 ? '#f59e0b' : '#10b981'
  const textColor = '#ffffff'
  
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.4"/>
        </filter>
      </defs>
      
      <!-- クラスターの背景 -->
      <circle 
        cx="${size / 2}" 
        cy="${size / 2}" 
        r="${size / 2 - 2}" 
        fill="${bgColor}" 
        stroke="#ffffff" 
        stroke-width="3"
        filter="url(#shadow)"
      />
      
      <!-- カウント数 -->
      <text 
        x="${size / 2}" 
        y="${size / 2 + 6}" 
        text-anchor="middle" 
        font-size="${size * 0.4}" 
        font-weight="bold"
        fill="${textColor}"
        font-family="Arial, sans-serif"
      >${count}</text>
    </svg>
  `)}`
}

/**
 * 距離に基づいてマーカーサイズを調整
 */
export function getMarkerSize(zoomLevel: number): number {
  if (zoomLevel >= 16) return 50  // 詳細レベル
  if (zoomLevel >= 14) return 45  // 中レベル
  if (zoomLevel >= 12) return 40  // 標準レベル
  return 35  // 広域レベル
}

/**
 * カテゴリ名を日本語に変換
 */
export function getCategoryDisplayName(category: string): string {
  const categoryNames: Record<string, string> = {
    work: '仕事',
    help: 'お手伝い',
    volunteer: 'ボランティア',
    seminar: '講演会・セミナー',
    event: 'イベント',
    meeting: '集会',
    cooking: '料理・お菓子作り',
    gardening: '園芸・ガーデニング',
    handicraft: '手芸・裁縫',
    music: '楽器演奏',
    technology: 'パソコン・スマホ',
    language: '語学',
    art: '書道・絵画',
    health: '健康・体操'
  }
  
  return categoryNames[category] || category
}
