import { useState, useCallback, useMemo, useEffect } from 'react'
import { useDebounce } from 'use-debounce'
import { Skill, SkillSearchParams, SkillSearchResult, DEFAULT_SEARCH_PARAMS } from '@/types/skill'
import { skillSearchParamsSchema } from '@/lib/validations/search'

interface UseSkillSearchOptions {
  initialParams?: Partial<SkillSearchParams>
  autoSearch?: boolean
  debounceMs?: number
  cacheKey?: string
}

interface UseSkillSearchReturn {
  // 検索パラメータ
  searchParams: SkillSearchParams
  updateSearchParam: <K extends keyof SkillSearchParams>(key: K, value: SkillSearchParams[K]) => void
  resetSearchParams: () => void
  
  // 検索実行
  search: () => Promise<void>
  searchWithParams: (params: Partial<SkillSearchParams>) => Promise<void>
  
  // 検索結果
  results: SkillSearchResult | null
  skills: Skill[]
  totalCount: number
  hasMore: boolean
  
  // ページネーション
  currentPage: number
  totalPages: number
  goToPage: (page: number) => void
  loadMore: () => Promise<void>
  
  // 状態
  isLoading: boolean
  isSearching: boolean
  error: string | null
  
  // フィルター情報
  activeFilterCount: number
  isFiltering: boolean
  clearFilters: () => void
  
  // 便利メソッド
  searchByKeyword: (keyword: string) => Promise<void>
  searchByCategory: (category: string) => Promise<void>
  searchNearby: (lat: number, lng: number, radius?: number) => Promise<void>
}

// 検索APIの呼び出し（モック実装）
async function searchSkillsAPI(params: SkillSearchParams): Promise<SkillSearchResult> {
  // TODO: 実際のAPI呼び出しに置き換え
  const mockDelay = Math.random() * 500 + 300 // 300-800ms のランダム遅延
  await new Promise(resolve => setTimeout(resolve, mockDelay))
  
  // モックデータ
  const mockSkills: Skill[] = []
  const totalCount = Math.floor(Math.random() * 200) + 50
  
  return {
    skills: mockSkills,
    total: totalCount,
    page: params.page || 1,
    limit: params.limit || 20,
    hasMore: (params.page || 1) * (params.limit || 20) < totalCount,
    facets: {
      categories: [],
      priceRanges: [],
      ratings: [],
      locations: []
    }
  }
}

export function useSkillSearch(options: UseSkillSearchOptions = {}): UseSkillSearchReturn {
  const {
    initialParams = {},
    autoSearch = false,
    debounceMs = 300,
    cacheKey = 'default'
  } = options

  // 状態管理
  const [searchParams, setSearchParams] = useState<SkillSearchParams>({
    ...DEFAULT_SEARCH_PARAMS,
    ...initialParams
  })
  
  const [results, setResults] = useState<SkillSearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // キーワードのデバウンス
  const [debouncedKeyword] = useDebounce(searchParams.keyword, debounceMs)

  // 検索パラメータ更新
  const updateSearchParam = useCallback(<K extends keyof SkillSearchParams>(
    key: K,
    value: SkillSearchParams[K]
  ) => {
    setSearchParams(prev => {
      const updated = { ...prev, [key]: value }
      
      // ページリセット（ページネーション以外の変更時）
      if (key !== 'page') {
        updated.page = 1
      }
      
      return updated
    })
  }, [])

  // 検索パラメータリセット
  const resetSearchParams = useCallback(() => {
    setSearchParams({ ...DEFAULT_SEARCH_PARAMS, ...initialParams })
  }, [initialParams])

  // 検索実行
  const search = useCallback(async () => {
    try {
      // バリデーション
      const validatedParams = skillSearchParamsSchema.parse(searchParams)
      
      setIsSearching(true)
      setError(null)
      
      // API呼び出し
      const result = await searchSkillsAPI(validatedParams)
      
      setResults(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '検索エラーが発生しました'
      setError(errorMessage)
      console.error('Skill search error:', err)
    } finally {
      setIsSearching(false)
    }
  }, [searchParams])

  // パラメータ指定検索
  const searchWithParams = useCallback(async (params: Partial<SkillSearchParams>) => {
    const updatedParams = { ...searchParams, ...params, page: 1 }
    setSearchParams(updatedParams)
    
    try {
      const validatedParams = skillSearchParamsSchema.parse(updatedParams)
      setIsSearching(true)
      setError(null)
      
      const result = await searchSkillsAPI(validatedParams)
      setResults(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '検索エラーが発生しました'
      setError(errorMessage)
    } finally {
      setIsSearching(false)
    }
  }, [searchParams])

  // ページネーション
  const goToPage = useCallback((page: number) => {
    updateSearchParam('page', page)
  }, [updateSearchParam])

  // 追加読み込み
  const loadMore = useCallback(async () => {
    if (!results || !results.hasMore || isSearching) return
    
    const nextPage = results.page + 1
    const loadMoreParams = { ...searchParams, page: nextPage }
    
    try {
      setIsLoading(true)
      const validatedParams = skillSearchParamsSchema.parse(loadMoreParams)
      const result = await searchSkillsAPI(validatedParams)
      
      // 結果をマージ
      setResults(prev => prev ? {
        ...result,
        skills: [...prev.skills, ...result.skills]
      } : result)
      
      setSearchParams(loadMoreParams)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '追加読み込みエラーが発生しました'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [results, isSearching, searchParams])

  // 便利メソッド
  const searchByKeyword = useCallback(async (keyword: string) => {
    await searchWithParams({ keyword })
  }, [searchWithParams])

  const searchByCategory = useCallback(async (category: string) => {
    await searchWithParams({ categories: [category as any] })
  }, [searchWithParams])

  const searchNearby = useCallback(async (lat: number, lng: number, radius = 5) => {
    await searchWithParams({
      location: { lat, lng, radius },
      sortBy: 'distance'
    })
  }, [searchWithParams])

  // フィルター状態
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (searchParams.keyword?.trim()) count++
    if (searchParams.categories?.length) count++
    if (searchParams.location) count++
    if (searchParams.priceRange) count++
    if (searchParams.dateRange) count++
    if (searchParams.difficulty?.length) count++
    if (searchParams.locationType?.length) count++
    if (searchParams.rating && searchParams.rating > 0) count++
    if (searchParams.availability !== 'any') count++
    return count
  }, [searchParams])

  const isFiltering = useMemo(() => {
    return activeFilterCount > 0 || searchParams.sortBy !== 'relevance'
  }, [activeFilterCount, searchParams.sortBy])

  const clearFilters = useCallback(() => {
    setSearchParams({
      ...DEFAULT_SEARCH_PARAMS,
      keyword: searchParams.keyword // キーワードは保持
    })
  }, [searchParams.keyword])

  // 計算値
  const skills = results?.skills || []
  const totalCount = results?.total || 0
  const hasMore = results?.hasMore || false
  const currentPage = results?.page || 1
  const totalPages = Math.ceil(totalCount / (searchParams.limit || 20))

  // 自動検索
  useEffect(() => {
    if (autoSearch && debouncedKeyword !== undefined) {
      search()
    }
  }, [debouncedKeyword, searchParams.categories, searchParams.location, autoSearch, search])

  // 初期検索
  useEffect(() => {
    if (autoSearch) {
      search()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    // 検索パラメータ
    searchParams,
    updateSearchParam,
    resetSearchParams,
    
    // 検索実行
    search,
    searchWithParams,
    
    // 検索結果
    results,
    skills,
    totalCount,
    hasMore,
    
    // ページネーション
    currentPage,
    totalPages,
    goToPage,
    loadMore,
    
    // 状態
    isLoading,
    isSearching,
    error,
    
    // フィルター情報
    activeFilterCount,
    isFiltering,
    clearFilters,
    
    // 便利メソッド
    searchByKeyword,
    searchByCategory,
    searchNearby
  }
}