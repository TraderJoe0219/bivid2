import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  AuthError,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './firebase'
import type { UserProfile } from '@/types'
import type { UserProfile as ExtendedUserProfile, EmergencyContact } from '@/types/auth'

// Google認証プロバイダー
const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account', // アカウント選択を強制
})

// エラーメッセージの日本語化
export const getAuthErrorMessage = (error: AuthError): string => {
  switch (error.code) {
    case 'auth/user-not-found':
      return 'このメールアドレスは登録されていません。'
    case 'auth/wrong-password':
      return 'パスワードが正しくありません。'
    case 'auth/email-already-in-use':
      return 'このメールアドレスは既に使用されています。'
    case 'auth/weak-password':
      return 'パスワードは6文字以上で入力してください。'
    case 'auth/invalid-email':
      return 'メールアドレスの形式が正しくありません。'
    case 'auth/too-many-requests':
      return 'しばらく時間をおいてから再度お試しください。'
    case 'auth/network-request-failed':
      return 'ネットワークエラーが発生しました。インターネット接続を確認してください。'
    case 'auth/popup-closed-by-user':
      return 'ログインがキャンセルされました。'
    case 'auth/popup-blocked':
      return 'ポップアップがブロックされました。ブラウザの設定を確認してください。'
    default:
      return 'エラーが発生しました。しばらく時間をおいてから再度お試しください。'
  }
}

// メール/パスワードでログイン
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return { user: result.user, error: null }
  } catch (error) {
    return { user: null, error: getAuthErrorMessage(error as AuthError) }
  }
}

// メール/パスワードでユーザー登録
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string
) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    
    // プロフィールを更新
    await updateProfile(result.user, { displayName })
    
    // Firestoreにユーザープロフィールを作成
    await createUserProfile(result.user, { displayName })
    
    return { user: result.user, error: null }
  } catch (error) {
    return { user: null, error: getAuthErrorMessage(error as AuthError) }
  }
}

// Googleでログイン
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    
    // 新規ユーザーの場合、Firestoreにプロフィールを作成
    const userDoc = await getDoc(doc(db, 'users', result.user.uid))
    if (!userDoc.exists()) {
      await createUserProfile(result.user)
    }
    
    return { user: result.user, error: null }
  } catch (error) {
    return { user: null, error: getAuthErrorMessage(error as AuthError) }
  }
}

// ログアウト
export const signOutUser = async () => {
  try {
    await signOut(auth)
    return { error: null }
  } catch (error) {
    return { error: getAuthErrorMessage(error as AuthError) }
  }
}

// パスワードリセット
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email, {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
      handleCodeInApp: false,
    })
    return { error: null }
  } catch (error) {
    return { error: getAuthErrorMessage(error as AuthError) }
  }
}

// Firestoreにユーザープロフィールを作成
export const createUserProfile = async (
  user: User,
  additionalData?: { displayName?: string }
) => {
  const userProfile: Partial<UserProfile> = {
    id: user.uid,
    email: user.email!,
    displayName: additionalData?.displayName || user.displayName || '',
    photoURL: user.photoURL,
    phoneNumber: user.phoneNumber,
    bio: '',
    location: {
      prefecture: '',
      city: '',
      area: '',
    },
    teachingSkills: [],
    learningInterests: [],
    rating: {
      average: 0,
      count: 0,
      asTeacher: 0,
      asStudent: 0,
    },
    preferences: {
      isOnlineAvailable: false,
      maxTravelDistance: 10,
      preferredTimeSlots: [],
      notifications: {
        email: true,
        push: true,
      },
    },
    isActive: true,
    lastLoginAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }

  await setDoc(doc(db, 'users', user.uid), userProfile)
  return userProfile
}

// ユーザープロフィールを取得
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile
    }
    return null
  } catch (error) {
    console.error('ユーザープロフィール取得エラー:', error)
    return null
  }
}

// ユーザープロフィールを更新
export const updateUserProfile = async (
  userId: string,
  updates: Partial<UserProfile>
) => {
  try {
    await setDoc(
      doc(db, 'users', userId),
      {
        ...updates,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    )
    return { error: null }
  } catch (error) {
    return { error: 'プロフィールの更新に失敗しました。' }
  }
}

// 拡張ユーザープロフィールを更新
export const updateExtendedUserProfile = async (
  userId: string,
  updates: Partial<ExtendedUserProfile>
) => {
  try {
    await setDoc(
      doc(db, 'users', userId),
      {
        ...updates,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    )
    return { error: null }
  } catch (error) {
    return { error: 'プロフィールの更新に失敗しました。' }
  }
}

// 電話番号認証の設定
export const setupPhoneVerification = async (phoneNumber: string) => {
  try {
    // TODO: Firebase Phone Authの実装
    // const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
    //   size: 'invisible',
    //   callback: (response: any) => {
    //     // reCAPTCHA solved
    //   }
    // }, auth)
    
    // const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
    // return { confirmationResult, error: null }
    
    // 一時的なモック処理
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { confirmationResult: { confirm: () => Promise.resolve() }, error: null }
  } catch (error) {
    return { confirmationResult: null, error: '電話番号認証の設定に失敗しました。' }
  }
}

// 認証コードの確認
export const verifyPhoneCode = async (verificationCode: string, confirmationResult: any) => {
  try {
    // TODO: Firebase Phone Authの認証コード確認
    // await confirmationResult.confirm(verificationCode)
    
    // 一時的なモック処理
    if (verificationCode !== '123456') {
      throw new Error('Invalid verification code')
    }
    
    return { error: null }
  } catch (error) {
    return { error: '認証コードが正しくありません。' }
  }
}

// 身分証明書の情報を保存
export const saveDocumentInfo = async (
  userId: string,
  documentType: string,
  documentURL: string
) => {
  try {
    await setDoc(
      doc(db, 'users', userId),
      {
        documentType,
        documentURL,
        isDocumentVerified: false,
        documentUploadedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    )
    return { error: null }
  } catch (error) {
    return { error: '書類情報の保存に失敗しました。' }
  }
}

// 緊急連絡先を保存
export const saveEmergencyContacts = async (
  userId: string,
  contacts: EmergencyContact[]
) => {
  try {
    await setDoc(
      doc(db, 'users', userId),
      {
        emergencyContacts: contacts.map(contact => ({
          ...contact,
          createdAt: serverTimestamp(),
          isVerified: false
        })),
        registrationCompleted: true,
        registrationCompletedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    )
    return { error: null }
  } catch (error) {
    return { error: '緊急連絡先の保存に失敗しました。' }
  }
}

// ユーザー登録の完了状態を確認
export const checkRegistrationStatus = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (userDoc.exists()) {
      const userData = userDoc.data() as ExtendedUserProfile
      return {
        isPhoneVerified: userData.isPhoneVerified || false,
        isDocumentVerified: userData.isDocumentVerified || false,
        hasEmergencyContacts: (userData.emergencyContacts?.length || 0) > 0,
        registrationCompleted: userData.registrationCompleted || false,
        error: null
      }
    }
    return { 
      isPhoneVerified: false,
      isDocumentVerified: false,
      hasEmergencyContacts: false,
      registrationCompleted: false,
      error: null 
    }
  } catch (error) {
    return { 
      isPhoneVerified: false,
      isDocumentVerified: false,
      hasEmergencyContacts: false,
      registrationCompleted: false,
      error: '登録状況の確認に失敗しました。' 
    }
  }
}
