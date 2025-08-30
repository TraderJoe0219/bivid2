import { renderHook, waitFor } from '@testing-library/react'
import { onAuthStateChanged } from 'firebase/auth'
import { useAuth } from '../useAuth'

jest.mock('firebase/auth')
jest.mock('@/lib/firebase', () => ({
  auth: {},
}))

const mockOnAuthStateChanged = onAuthStateChanged as jest.MockedFunction<typeof onAuthStateChanged>

const mockUser = {
  uid: 'test-uid',
  email: 'test@example.com',
  displayName: 'Test User',
}

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('初期状態ではloadingがtrueである', () => {
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      return jest.fn() // unsubscribe function
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.loading).toBe(true)
    expect(result.current.user).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('ユーザーがログインしている場合', async () => {
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      setTimeout(() => callback(mockUser as any), 0)
      return jest.fn() // unsubscribe function
    })

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.error).toBeNull()
  })

  it('ユーザーがログアウトしている場合', async () => {
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      setTimeout(() => callback(null), 0)
      return jest.fn() // unsubscribe function
    })

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.user).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('認証エラーが発生した場合', async () => {
    const mockError = new Error('Authentication error')
    
    mockOnAuthStateChanged.mockImplementation((auth, successCallback, errorCallback) => {
      setTimeout(() => errorCallback?.(mockError), 0)
      return jest.fn() // unsubscribe function
    })

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.user).toBeNull()
    expect(result.current.error).toBe('Authentication error')
  })

  it('コンポーネントがアンマウントされた時にリスナーがクリーンアップされる', () => {
    const mockUnsubscribe = jest.fn()
    mockOnAuthStateChanged.mockReturnValue(mockUnsubscribe)

    const { unmount } = renderHook(() => useAuth())

    unmount()

    expect(mockUnsubscribe).toHaveBeenCalled()
  })
})