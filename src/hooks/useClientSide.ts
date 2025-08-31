import { useEffect, useState } from 'react'

/**
 * クライアントサイド実行のみを判定するフック
 * SSRエラーを避けるために使用
 * @returns {boolean} クライアントサイドかどうか
 */
export function useClientSide(): boolean {
  const [isClientSide, setIsClientSide] = useState(false)

  useEffect(() => {
    setIsClientSide(true)
  }, [])

  return isClientSide
}

/**
 * SSR安全なlocation取得フック
 * @returns {Location | null} locationオブジェクトまたはnull（SSR中）
 */
export function useLocation(): Location | null {
  const isClientSide = useClientSide()
  return isClientSide ? window.location : null
}