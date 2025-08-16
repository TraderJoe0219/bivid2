import { NextRequest, NextResponse } from 'next/server'
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  getDocs, 
  QueryConstraint,
  QueryDocumentSnapshot,
  DocumentData 
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { SkillSearchParams, SkillSearchResult } from '@/types/skill'
import { skillSearchParamsSchema } from '@/lib/validations/search'

function buildFirestoreQuery(params: SkillSearchParams) {
  const constraints: QueryConstraint[] = []
  
  // カテゴリフィルタ
  if (params.categories && params.categories.length > 0) {
    constraints.push(where('category', 'in', params.categories))
  }
  
  // 場所タイプフィルタ
  if (params.locationType && params.locationType.length > 0) {
    if (params.locationType.includes('online') && params.locationType.includes('offline')) {
      // オンライン・オフライン両方の場合はフィルタしない
    } else if (params.locationType.includes('online')) {
      constraints.push(where('isOnlineAvailable', '==', true))
    } else if (params.locationType.includes('offline')) {
      constraints.push(where('isOnlineAvailable', '==', false))
    }
  }
  
  // 難易度フィルタ
  if (params.difficulty && params.difficulty.length > 0) {
    constraints.push(where('difficulty', 'in', params.difficulty))
  }
  
  // 価格範囲フィルタ
  if (params.priceRange) {
    if (params.priceRange.min !== undefined) {
      constraints.push(where('pricePerHour', '>=', params.priceRange.min))
    }
    if (params.priceRange.max !== undefined) {
      constraints.push(where('pricePerHour', '<=', params.priceRange.max))
    }
  }
  
  // 評価フィルタ
  if (params.rating && params.rating > 0) {
    constraints.push(where('rating', '>=', params.rating))
  }
  
  // アクティブなスキルのみ
  constraints.push(where('isActive', '==', true))
  
  // ソート順
  switch (params.sortBy) {
    case 'priceAsc':
      constraints.push(orderBy('pricePerHour', 'asc'))
      break
    case 'priceDesc':
      constraints.push(orderBy('pricePerHour', 'desc'))
      break
    case 'rating':
      constraints.push(orderBy('rating', 'desc'))
      break
    case 'newest':
      constraints.push(orderBy('createdAt', 'desc'))
      break
    case 'distance':
      // 距離ソートは位置情報が必要、別途実装
      constraints.push(orderBy('createdAt', 'desc'))
      break
    default: // relevance
      constraints.push(orderBy('viewCount', 'desc'))
      break
  }
  
  // ページネーション
  const limitCount = Math.min(params.limit || 20, 50) // 最大50件
  constraints.push(limit(limitCount))
  
  return query(collection(db, 'skills'), ...constraints)
}

function buildTextSearchQuery(keyword: string, otherParams: SkillSearchParams) {
  // Firestoreの制限により、フルテキスト検索は簡単な実装
  // 実際のプロダクションではElasticsearchやAlgoliaを使用
  const constraints: QueryConstraint[] = []
  
  // アクティブなスキルのみ
  constraints.push(where('isActive', '==', true))
  
  // カテゴリフィルタ（テキスト検索と併用可能）
  if (otherParams.categories && otherParams.categories.length > 0) {
    constraints.push(where('category', 'in', otherParams.categories))
  }
  
  // 簡単なソート
  constraints.push(orderBy('viewCount', 'desc'))
  constraints.push(limit(Math.min(otherParams.limit || 20, 50)))
  
  return query(collection(db, 'skills'), ...constraints)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams: urlParams } = new URL(request.url)
    
    // パラメータの解析
    const rawParams = {
      keyword: urlParams.get('keyword') || '',
      categories: urlParams.get('categories')?.split(',').filter(Boolean) || [],
      locationType: urlParams.get('locationType')?.split(',').filter(Boolean) || [],
      difficulty: urlParams.get('difficulty')?.split(',').filter(Boolean) || [],
      priceRange: urlParams.get('priceMin') || urlParams.get('priceMax') ? {
        min: urlParams.get('priceMin') ? parseInt(urlParams.get('priceMin')!) : undefined,
        max: urlParams.get('priceMax') ? parseInt(urlParams.get('priceMax')!) : undefined,
      } : undefined,
      rating: urlParams.get('rating') ? parseFloat(urlParams.get('rating')!) : undefined,
      availability: urlParams.get('availability') || 'any',
      sortBy: urlParams.get('sortBy') || 'relevance',
      page: parseInt(urlParams.get('page') || '1'),
      limit: parseInt(urlParams.get('limit') || '20'),
    }
    
    // バリデーション
    const validatedParams = skillSearchParamsSchema.parse(rawParams)
    
    // クエリ構築と実行
    let skillsQuery
    if (validatedParams.keyword && validatedParams.keyword.trim()) {
      skillsQuery = buildTextSearchQuery(validatedParams.keyword.trim(), validatedParams)
    } else {
      skillsQuery = buildFirestoreQuery(validatedParams)
    }
    
    const querySnapshot = await getDocs(skillsQuery)
    const skills = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    // テキスト検索の場合は追加フィルタリング
    let filteredSkills = skills
    if (validatedParams.keyword && validatedParams.keyword.trim()) {
      const keyword = validatedParams.keyword.toLowerCase()
      filteredSkills = skills.filter(skill => 
        skill.title?.toLowerCase().includes(keyword) ||
        skill.description?.toLowerCase().includes(keyword) ||
        skill.teacherName?.toLowerCase().includes(keyword)
      )
    }
    
    // ページネーション計算
    const page = validatedParams.page || 1
    const limitCount = validatedParams.limit || 20
    const startIndex = (page - 1) * limitCount
    const endIndex = startIndex + limitCount
    const paginatedSkills = filteredSkills.slice(startIndex, endIndex)
    
    // 結果の構築
    const result: SkillSearchResult = {
      skills: paginatedSkills,
      total: filteredSkills.length,
      page,
      limit: limitCount,
      hasMore: endIndex < filteredSkills.length,
      facets: {
        categories: [], // TODO: カテゴリ集計の実装
        priceRanges: [], // TODO: 価格帯集計の実装
        ratings: [], // TODO: 評価分布の実装
        locations: [] // TODO: 場所集計の実装
      }
    }
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Skill search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}