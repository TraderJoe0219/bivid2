/**
 * 開発・デモ用のサンプルデータ
 * 実際のFirestoreデータが利用できない場合のフォールバック
 */

import { Skill, User } from '@/types'
import { generateToyonakaSampleSkills, getToyonakaTeachers, TOYONAKA_CENTER } from './sampleDataToyonaka'
import { calculateDistance } from './distance'

// 全サンプルデータのキャッシュ
let skillsCache: Skill[] | null = null
let teachersCache: User[] | null = null

// サンプルスキルデータを取得
export function getSampleSkills(): Skill[] {
  if (!skillsCache) {
    skillsCache = generateToyonakaSampleSkills()
  }
  return skillsCache
}

// サンプル講師データを取得
export function getSampleTeachers(): User[] {
  if (!teachersCache) {
    teachersCache = getToyonakaTeachers()
  }
  return teachersCache
}

// IDでスキルを取得
export function getSkillById(id: string): Skill | null {
  const skills = getSampleSkills()
  return skills.find(skill => skill.id === id) || null
}

// IDで講師を取得
export function getTeacherById(id: string): User | null {
  const teachers = getSampleTeachers()
  return teachers.find(teacher => teacher.id === id) || null
}

// 位置情報付きでスキルを検索
export function searchSkillsWithDistance(params: {
  keyword?: string
  category?: string
  userLocation?: { latitude: number; longitude: number }
  radius?: number // km
  maxPrice?: number
  sortBy?: 'distance' | 'rating' | 'price' | 'newest'
  limit?: number
}): Skill[] {
  let skills = getSampleSkills()

  // キーワード検索
  if (params.keyword) {
    const searchTerm = params.keyword.toLowerCase()
    skills = skills.filter(skill =>
      skill.title.toLowerCase().includes(searchTerm) ||
      skill.description.toLowerCase().includes(searchTerm) ||
      skill.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      skill.teacher.displayName.toLowerCase().includes(searchTerm)
    )
  }

  // カテゴリフィルター
  if (params.category) {
    skills = skills.filter(skill => skill.category === params.category)
  }

  // 価格フィルター
  if (params.maxPrice !== undefined) {
    skills = skills.filter(skill => skill.price <= params.maxPrice)
  }

  // 距離を計算
  if (params.userLocation) {
    skills = skills.map(skill => {
      const distance = skill.coordinates
        ? calculateDistance(params.userLocation!, skill.coordinates)
        : Infinity

      return {
        ...skill,
        distance
      }
    })

    // 半径フィルター
    if (params.radius) {
      skills = skills.filter(skill =>
        skill.distance !== undefined &&
        skill.distance !== Infinity &&
        skill.distance <= params.radius!
      )
    }
  }

  // ソート
  if (params.sortBy) {
    switch (params.sortBy) {
      case 'distance':
        skills.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity))
        break
      case 'rating':
        skills.sort((a, b) => b.rating - a.rating)
        break
      case 'price':
        skills.sort((a, b) => a.price - b.price)
        break
      case 'newest':
        skills.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }
  }

  // リミット
  if (params.limit) {
    skills = skills.slice(0, params.limit)
  }

  return skills
}

// カテゴリ別スキル数を取得
export function getSkillCountByCategory(): Record<string, number> {
  const skills = getSampleSkills()
  const counts: Record<string, number> = {}

  skills.forEach(skill => {
    counts[skill.category] = (counts[skill.category] || 0) + 1
  })

  return counts
}

// 人気の講師を取得（評価順）
export function getPopularTeachers(limit: number = 10): User[] {
  const teachers = getSampleTeachers()
  return teachers
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
}

// 近くのスキルを取得
export function getNearbySkills(
  userLocation: { latitude: number; longitude: number },
  radius: number = 5,
  limit: number = 10
): Skill[] {
  return searchSkillsWithDistance({
    userLocation,
    radius,
    sortBy: 'distance',
    limit
  })
}

// おすすめスキルを取得
export function getRecommendedSkills(
  userInterests?: string[],
  userLocation?: { latitude: number; longitude: number },
  limit: number = 10
): Skill[] {
  let skills = getSampleSkills()

  // 興味関心でスコアリング
  if (userInterests) {
    skills = skills.map(skill => {
      let score = skill.rating * 10 // 基本スコア

      // 興味関心マッチ
      const matchCount = userInterests.filter(interest =>
        skill.tags.some(tag => tag.toLowerCase().includes(interest.toLowerCase())) ||
        skill.category.toLowerCase().includes(interest.toLowerCase())
      ).length
      score += matchCount * 20

      return { ...skill, score }
    })

    skills.sort((a, b) => (b as any).score - (a as any).score)
  }

  // 距離でさらにソート
  if (userLocation) {
    skills = searchSkillsWithDistance({
      userLocation,
      sortBy: 'distance',
      limit: limit * 2 // 多めに取得してからフィルタ
    })
  }

  return skills.slice(0, limit)
}

// デモ用の統計データ
export function getDemoStats() {
  const skills = getSampleSkills()
  const teachers = getSampleTeachers()

  return {
    totalSkills: skills.length,
    totalTeachers: teachers.length,
    totalReviews: skills.reduce((sum, skill) => sum + skill.reviewCount, 0),
    avgRating: Math.round((skills.reduce((sum, skill) => sum + skill.rating, 0) / skills.length) * 10) / 10,
    avgPrice: Math.round(skills.reduce((sum, skill) => sum + skill.price, 0) / skills.length),
    categories: [...new Set(skills.map(skill => skill.category))].length,
    onlineSkills: skills.filter(skill => skill.isOnline).length,
    areas: ['豊中市本町', '豊中市岡町', '豊中市曽根南町', '豊中市服部元町', '豊中市庄内東町']
  }
}

// 開発用：ランダムなスキルを取得
export function getRandomSkills(count: number = 5): Skill[] {
  const skills = getSampleSkills()
  const shuffled = [...skills].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

// 開発用：テスト用の検索
export function testSearch() {
  console.log('=== サンプルデータ テスト ===')

  const stats = getDemoStats()
  console.log('統計:', stats)

  const computerSkills = searchSkillsWithDistance({
    keyword: 'パソコン',
    limit: 3
  })
  console.log('パソコン関連スキル:', computerSkills.map(s => s.title))

  const nearbySkills = searchSkillsWithDistance({
    userLocation: TOYONAKA_CENTER,
    radius: 2,
    sortBy: 'distance',
    limit: 5
  })
  console.log('近くのスキル:', nearbySkills.map(s => `${s.title} (${s.distance?.toFixed(1)}km)`))

  const topRated = searchSkillsWithDistance({
    sortBy: 'rating',
    limit: 3
  })
  console.log('高評価スキル:', topRated.map(s => `${s.title} (${s.rating}⭐)`))
}