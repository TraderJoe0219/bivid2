import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  User
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { signUpWithEmail, signInWithEmail, signInWithGoogle, signOutUser } from '../auth'

// Mock Firebase modules
jest.mock('firebase/auth')
jest.mock('firebase/firestore')
jest.mock('../firebase', () => ({
  auth: {},
  db: {},
}))

const mockSignInWithEmailAndPassword = signInWithEmailAndPassword as jest.MockedFunction<typeof signInWithEmailAndPassword>
const mockCreateUserWithEmailAndPassword = createUserWithEmailAndPassword as jest.MockedFunction<typeof createUserWithEmailAndPassword>
const mockSignInWithPopup = signInWithPopup as jest.MockedFunction<typeof signInWithPopup>
const mockSignOut = signOut as jest.MockedFunction<typeof signOut>
const mockUpdateProfile = updateProfile as jest.MockedFunction<typeof updateProfile>
const mockSetDoc = setDoc as jest.MockedFunction<typeof setDoc>
const mockGetDoc = getDoc as jest.MockedFunction<typeof getDoc>
const mockDoc = doc as jest.MockedFunction<typeof doc>

const mockUser = {
  uid: 'test-uid',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: null,
} as User

describe('Auth Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('signUpWithEmail', () => {
    it('新規登録が成功する場合', async () => {
      mockCreateUserWithEmailAndPassword.mockResolvedValue({
        user: mockUser,
      } as any)
      mockUpdateProfile.mockResolvedValue()
      mockSetDoc.mockResolvedValue()
      mockDoc.mockReturnValue({} as any)

      const result = await signUpWithEmail('test@example.com', 'password123', 'Test User')

      expect(result.user).toEqual(mockUser)
      expect(result.error).toBeNull()
      expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(
        {},
        'test@example.com',
        'password123'
      )
      expect(mockUpdateProfile).toHaveBeenCalledWith(mockUser, { displayName: 'Test User' })
      expect(mockSetDoc).toHaveBeenCalled()
    })

    it('メールアドレスが既に使用されている場合のエラー処理', async () => {
      const mockError = { code: 'auth/email-already-in-use', message: 'Email already in use' }
      mockCreateUserWithEmailAndPassword.mockRejectedValue(mockError)

      const result = await signUpWithEmail('test@example.com', 'password123', 'Test User')

      expect(result.user).toBeNull()
      expect(result.error).toBe('このメールアドレスは既に使用されています。')
    })

    it('パスワードが弱すぎる場合のエラー処理', async () => {
      const mockError = { code: 'auth/weak-password', message: 'Weak password' }
      mockCreateUserWithEmailAndPassword.mockRejectedValue(mockError)

      const result = await signUpWithEmail('test@example.com', '123', 'Test User')

      expect(result.user).toBeNull()
      expect(result.error).toBe('パスワードが弱すぎます。より強力なパスワードを入力してください。')
    })

    it('無効なメールアドレスの場合のエラー処理', async () => {
      const mockError = { code: 'auth/invalid-email', message: 'Invalid email' }
      mockCreateUserWithEmailAndPassword.mockRejectedValue(mockError)

      const result = await signUpWithEmail('invalid-email', 'password123', 'Test User')

      expect(result.user).toBeNull()
      expect(result.error).toBe('無効なメールアドレスです。')
    })
  })

  describe('signInWithEmail', () => {
    it('ログインが成功する場合', async () => {
      mockSignInWithEmailAndPassword.mockResolvedValue({
        user: mockUser,
      } as any)

      const result = await signInWithEmail('test@example.com', 'password123')

      expect(result.user).toEqual(mockUser)
      expect(result.error).toBeNull()
      expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
        {},
        'test@example.com',
        'password123'
      )
    })

    it('ユーザーが見つからない場合のエラー処理', async () => {
      const mockError = { code: 'auth/user-not-found', message: 'User not found' }
      mockSignInWithEmailAndPassword.mockRejectedValue(mockError)

      const result = await signInWithEmail('test@example.com', 'password123')

      expect(result.user).toBeNull()
      expect(result.error).toBe('このメールアドレスは登録されていません。')
    })

    it('パスワードが間違っている場合のエラー処理', async () => {
      const mockError = { code: 'auth/wrong-password', message: 'Wrong password' }
      mockSignInWithEmailAndPassword.mockRejectedValue(mockError)

      const result = await signInWithEmail('test@example.com', 'wrongpassword')

      expect(result.user).toBeNull()
      expect(result.error).toBe('パスワードが間違っています。')
    })

    it('アカウントが無効な場合のエラー処理', async () => {
      const mockError = { code: 'auth/user-disabled', message: 'User disabled' }
      mockSignInWithEmailAndPassword.mockRejectedValue(mockError)

      const result = await signInWithEmail('test@example.com', 'password123')

      expect(result.user).toBeNull()
      expect(result.error).toBe('このアカウントは無効になっています。')
    })
  })

  describe('signInWithGoogle', () => {
    it('Googleログインが成功する場合（新規ユーザー）', async () => {
      mockSignInWithPopup.mockResolvedValue({
        user: mockUser,
      } as any)
      mockGetDoc.mockResolvedValue({
        exists: () => false,
      } as any)
      mockSetDoc.mockResolvedValue()
      mockDoc.mockReturnValue({} as any)

      const result = await signInWithGoogle()

      expect(result.user).toEqual(mockUser)
      expect(result.error).toBeNull()
      expect(mockSignInWithPopup).toHaveBeenCalledWith({}, expect.any(GoogleAuthProvider))
      expect(mockSetDoc).toHaveBeenCalled()
    })

    it('Googleログインが成功する場合（既存ユーザー）', async () => {
      mockSignInWithPopup.mockResolvedValue({
        user: mockUser,
      } as any)
      mockGetDoc.mockResolvedValue({
        exists: () => true,
      } as any)
      mockDoc.mockReturnValue({} as any)

      const result = await signInWithGoogle()

      expect(result.user).toEqual(mockUser)
      expect(result.error).toBeNull()
      expect(mockSignInWithPopup).toHaveBeenCalledWith({}, expect.any(GoogleAuthProvider))
      expect(mockSetDoc).not.toHaveBeenCalled()
    })

    it('ポップアップがキャンセルされた場合のエラー処理', async () => {
      const mockError = { code: 'auth/popup-closed-by-user', message: 'Popup closed' }
      mockSignInWithPopup.mockRejectedValue(mockError)

      const result = await signInWithGoogle()

      expect(result.user).toBeNull()
      expect(result.error).toBe('ログインがキャンセルされました。')
    })

    it('ポップアップがブロックされた場合のエラー処理', async () => {
      const mockError = { code: 'auth/popup-blocked', message: 'Popup blocked' }
      mockSignInWithPopup.mockRejectedValue(mockError)

      const result = await signInWithGoogle()

      expect(result.user).toBeNull()
      expect(result.error).toBe('ポップアップがブロックされました。ブラウザの設定を確認してください。')
    })
  })

  describe('signOutUser', () => {
    it('ログアウトが成功する場合', async () => {
      mockSignOut.mockResolvedValue()

      const result = await signOutUser()

      expect(result.error).toBeNull()
      expect(mockSignOut).toHaveBeenCalledWith({})
    })

    it('ログアウトが失敗する場合', async () => {
      const mockError = new Error('Sign out failed')
      mockSignOut.mockRejectedValue(mockError)

      const result = await signOutUser()

      expect(result.error).toBe('ログアウトに失敗しました。')
    })
  })
})