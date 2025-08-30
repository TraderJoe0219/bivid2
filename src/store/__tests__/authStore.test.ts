import { renderHook, act } from '@testing-library/react'
import { useAuthStore } from '../authStore'
import { User as FirebaseUser } from 'firebase/auth'
import { User } from '@/types'

const mockFirebaseUser = {
  uid: 'test-uid',
  email: 'test@example.com',
  displayName: 'Test User',
} as FirebaseUser

const mockUserProfile = {
  id: 'test-uid',
  name: 'Test User',
  email: 'test@example.com',
} as User

describe('Auth Store', () => {
  beforeEach(() => {
    // ストアをリセット
    useAuthStore.getState().signOut()
    useAuthStore.getState().setLoading(true)
  })

  it('初期状態が正しく設定されている', () => {
    const { result } = renderHook(() => useAuthStore())
    
    expect(result.current.user).toBeNull()
    expect(result.current.userProfile).toBeNull()
    expect(result.current.isLoading).toBe(true)
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('setUserでユーザーを設定できる', () => {
    const { result } = renderHook(() => useAuthStore())
    
    act(() => {
      result.current.setUser(mockFirebaseUser)
    })

    expect(result.current.user).toEqual(mockFirebaseUser)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('setUserでnullを設定するとログアウト状態になる', () => {
    const { result } = renderHook(() => useAuthStore())
    
    // 最初にユーザーを設定
    act(() => {
      result.current.setUser(mockFirebaseUser)
    })

    // nullを設定してログアウト状態にする
    act(() => {
      result.current.setUser(null)
    })

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('setUserProfileでユーザープロフィールを設定できる', () => {
    const { result } = renderHook(() => useAuthStore())
    
    act(() => {
      result.current.setUserProfile(mockUserProfile)
    })

    expect(result.current.userProfile).toEqual(mockUserProfile)
  })

  it('setLoadingでローディング状態を変更できる', () => {
    const { result } = renderHook(() => useAuthStore())
    
    act(() => {
      result.current.setLoading(false)
    })

    expect(result.current.isLoading).toBe(false)

    act(() => {
      result.current.setLoading(true)
    })

    expect(result.current.isLoading).toBe(true)
  })

  it('signOutで状態がリセットされる', () => {
    const { result } = renderHook(() => useAuthStore())
    
    // 最初にユーザーとプロフィールを設定
    act(() => {
      result.current.setUser(mockFirebaseUser)
      result.current.setUserProfile(mockUserProfile)
    })

    // signOutを実行
    act(() => {
      result.current.signOut()
    })

    expect(result.current.user).toBeNull()
    expect(result.current.userProfile).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.isLoading).toBe(false)
  })

  it('logoutで状態がリセットされる', () => {
    const { result } = renderHook(() => useAuthStore())
    
    // 最初にユーザーとプロフィールを設定
    act(() => {
      result.current.setUser(mockFirebaseUser)
      result.current.setUserProfile(mockUserProfile)
    })

    // logoutを実行
    act(() => {
      result.current.logout()
    })

    expect(result.current.user).toBeNull()
    expect(result.current.userProfile).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.isLoading).toBe(false)
  })

  it('ユーザーとプロフィールの状態が連携して動作する', () => {
    const { result } = renderHook(() => useAuthStore())
    
    // ユーザーとプロフィールを同時に設定
    act(() => {
      result.current.setUser(mockFirebaseUser)
      result.current.setUserProfile(mockUserProfile)
      result.current.setLoading(false)
    })

    expect(result.current.user).toEqual(mockFirebaseUser)
    expect(result.current.userProfile).toEqual(mockUserProfile)
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.isLoading).toBe(false)
  })
})