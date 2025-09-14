import { Skill, SearchFilters, GeoPoint } from '@/types'
import { calculateDistance, sortByDistance, isValidGeoPoint } from '@/lib/distance'

/**
 * スキル検索結果に距離を追加し、指定された条件でソート
 */
export function processSkillSearchResults(
  skills: Skill[],
  filters: SearchFilters,
  userLocation?: GeoPoint
): Skill[] {
  let processedSkills = [...skills]

  // 距離を計算
  if (userLocation && isValidGeoPoint(userLocation)) {
    processedSkills = processedSkills.map(skill => {
      const distance = skill.coordinates && isValidGeoPoint(skill.coordinates)
        ? calculateDistance(userLocation, skill.coordinates)
        : skill.teacher?.coordinates && isValidGeoPoint(skill.teacher.coordinates)
        ? calculateDistance(userLocation, skill.teacher.coordinates)
        : Infinity

      return {
        ...skill,
        distance
      }
    })
  }

  // 半径内のフィルタリング
  if (userLocation && filters.radius) {
    processedSkills = processedSkills.filter(skill => {
      const distance = skill.distance
      return distance !== undefined && distance !== Infinity && distance <= filters.radius!
    })
  }

  // ソート処理
  if (filters.sortBy) {
    processedSkills = sortSkills(processedSkills, filters.sortBy, userLocation)
  }

  return processedSkills
}

/**
 * スキルのソート処理
 */
export function sortSkills(
  skills: Skill[],
  sortBy: NonNullable<SearchFilters['sortBy']>,
  userLocation?: GeoPoint
): Skill[] {
  const sortedSkills = [...skills]

  switch (sortBy) {
    case 'distance':
      if (userLocation && isValidGeoPoint(userLocation)) {
        return sortByDistance(sortedSkills, userLocation)
      }
      // 距離ソートが無効な場合は評価順にフォールバック
      return sortedSkills.sort((a, b) => b.rating - a.rating)

    case 'rating':
      return sortedSkills.sort((a, b) => {
        // 評価数も考慮した重み付きソート
        const aScore = a.rating * Math.log(a.reviewCount + 1)
        const bScore = b.rating * Math.log(b.reviewCount + 1)
        return bScore - aScore
      })

    case 'price':
      return sortedSkills.sort((a, b) => a.price - b.price)

    case 'newest':
      return sortedSkills.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )

    default:
      return sortedSkills
  }
}

/**
 * 検索フィルターの適用
 */
export function applySkillFilters(skills: Skill[], filters: SearchFilters): Skill[] {
  let filteredSkills = [...skills]

  // カテゴリフィルター
  if (filters.category) {
    filteredSkills = filteredSkills.filter(skill =>
      skill.category === filters.category
    )
  }

  // 価格フィルター
  if (filters.priceRange) {
    filteredSkills = filteredSkills.filter(skill => {
      const price = skill.price
      const min = filters.priceRange!.min
      const max = filters.priceRange!.max

      if (min !== undefined && price < min) return false
      if (max !== undefined && price > max) return false
      return true
    })
  }

  // 難易度フィルター
  if (filters.difficulty) {
    filteredSkills = filteredSkills.filter(skill =>
      skill.difficulty === filters.difficulty
    )
  }

  // オンライン/オフラインフィルター
  if (filters.isOnline !== undefined) {
    filteredSkills = filteredSkills.filter(skill =>
      skill.isOnline === filters.isOnline
    )
  }

  // 評価フィルター
  if (filters.rating !== undefined) {
    filteredSkills = filteredSkills.filter(skill =>
      skill.rating >= filters.rating!
    )
  }

  return filteredSkills
}

/**
 * 検索キーワードによるマッチング
 */
export function searchSkillsByKeyword(skills: Skill[], keyword: string): Skill[] {
  if (!keyword.trim()) return skills

  const searchTerm = keyword.toLowerCase().trim()
  const terms = searchTerm.split(/\s+/)

  return skills.filter(skill => {
    const searchableText = [
      skill.title,
      skill.description,
      skill.teacher.displayName,
      skill.location,
      ...skill.tags
    ].join(' ').toLowerCase()

    return terms.every(term => searchableText.includes(term))
  })
}

/**
 * おすすめスキルの取得（ユーザーの位置情報と好みを考慮）
 */
export function getRecommendedSkills(
  skills: Skill[],
  userLocation?: GeoPoint,
  userInterests?: string[],
  limit: number = 10
): Skill[] {
  let scoredSkills = skills.map(skill => {
    let score = 0

    // 基本的な品質スコア
    score += skill.rating * 10
    score += Math.log(skill.reviewCount + 1) * 5

    // 距離による加点（近いほど高得点）
    if (userLocation && skill.distance !== undefined && skill.distance !== Infinity) {
      const distanceScore = Math.max(0, 50 - skill.distance * 2)
      score += distanceScore
    }

    // ユーザーの興味関心との合致
    if (userInterests) {
      const matchCount = userInterests.filter(interest =>
        skill.tags.includes(interest) ||
        skill.category.includes(interest) ||
        skill.title.toLowerCase().includes(interest.toLowerCase())
      ).length
      score += matchCount * 15
    }

    // アクティブさ（最近の活動）
    const daysSinceUpdate = (Date.now() - new Date(skill.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
    const activityScore = Math.max(0, 30 - daysSinceUpdate)
    score += activityScore

    return { skill, score }
  })

  return scoredSkills
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.skill)
}

/**
 * 位置情報に基づく検索クエリの生成
 */
export function generateLocationQuery(
  coordinates: GeoPoint,
  radius: number
): { center: GeoPoint; bounds: { north: number; south: number; east: number; west: number } } {
  // 概算: 1度 ≈ 111km
  const latDiff = radius / 111
  const lngDiff = radius / (111 * Math.cos(coordinates.latitude * Math.PI / 180))

  return {
    center: coordinates,
    bounds: {
      north: coordinates.latitude + latDiff,
      south: coordinates.latitude - latDiff,
      east: coordinates.longitude + lngDiff,
      west: coordinates.longitude - lngDiff
    }
  }
}