import { Skill, User } from '@/types'
import { generateToyonakaSampleSkills, getToyonakaTeachers } from './sampleDataToyonaka'

// 豊中市のサンプルデータを含む全スキルデータ
export function getAllSampleSkills(): Skill[] {
  const toyonakaSkills = generateToyonakaSampleSkills()

  // 他の地域のサンプルデータもここに追加可能
  // const osakaSkills = generateOsakaSampleSkills()
  // const kyotoSkills = generateKyotoSampleSkills()

  return [
    ...toyonakaSkills
    // ...osakaSkills,
    // ...kyotoSkills
  ]
}

// 全講師データ
export function getAllSampleTeachers(): User[] {
  const toyonakaTeachers = getToyonakaTeachers()

  return [
    ...toyonakaTeachers
  ]
}

// 特定の地域のスキルを取得
export function getSkillsByLocation(city: string): Skill[] {
  const allSkills = getAllSampleSkills()

  switch (city) {
    case '豊中市':
    case 'toyonaka':
      return generateToyonakaSampleSkills()
    default:
      return allSkills
  }
}

// カテゴリ別スキル取得
export function getSkillsByCategory(category: string): Skill[] {
  const allSkills = getAllSampleSkills()
  return allSkills.filter(skill => skill.category === category)
}

// 評価が高いスキルを取得
export function getTopRatedSkills(limit: number = 10): Skill[] {
  const allSkills = getAllSampleSkills()
  return allSkills
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
}

// 新しいスキルを取得
export function getNewestSkills(limit: number = 10): Skill[] {
  const allSkills = getAllSampleSkills()
  return allSkills
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
}

// 人気のスキルを取得（予約数順）
export function getPopularSkills(limit: number = 10): Skill[] {
  const allSkills = getAllSampleSkills()
  return allSkills
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, limit)
}

// デモ用のスキル検索
export function searchSkills(
  keyword?: string,
  category?: string,
  maxPrice?: number,
  isOnlineOnly?: boolean
): Skill[] {
  let skills = getAllSampleSkills()

  // キーワード検索
  if (keyword) {
    const searchTerm = keyword.toLowerCase()
    skills = skills.filter(skill =>
      skill.title.toLowerCase().includes(searchTerm) ||
      skill.description.toLowerCase().includes(searchTerm) ||
      skill.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      skill.teacher.displayName.toLowerCase().includes(searchTerm)
    )
  }

  // カテゴリフィルター
  if (category) {
    skills = skills.filter(skill => skill.category === category)
  }

  // 価格フィルター
  if (maxPrice !== undefined) {
    skills = skills.filter(skill => skill.price <= maxPrice)
  }

  // オンラインフィルター
  if (isOnlineOnly) {
    skills = skills.filter(skill => skill.isOnline)
  }

  return skills
}

// スキルの統計情報を取得
export function getSkillStats() {
  const skills = getAllSampleSkills()
  const teachers = getAllSampleTeachers()

  const categories = [...new Set(skills.map(skill => skill.category))]
  const avgPrice = skills.reduce((sum, skill) => sum + skill.price, 0) / skills.length
  const avgRating = skills.reduce((sum, skill) => sum + skill.rating, 0) / skills.length
  const totalReviews = skills.reduce((sum, skill) => sum + skill.reviewCount, 0)

  return {
    totalSkills: skills.length,
    totalTeachers: teachers.length,
    categories: categories.length,
    avgPrice: Math.round(avgPrice),
    avgRating: Math.round(avgRating * 10) / 10,
    totalReviews,
    onlineSkills: skills.filter(skill => skill.isOnline).length,
    offlineSkills: skills.filter(skill => !skill.isOnline).length
  }
}