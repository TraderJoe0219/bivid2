import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  updateProfile,
  User,
  sendPasswordResetEmail
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from './firebase'

export type CurrentUser =
  | ({ id?: string; email?: string | null; name?: string | null } & Record<string, unknown>)
  | null;

export interface AuthResult {
  user: User | null
  error: string | null
}

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<AuthResult> {
  try {
    console.log('新規登録を開始:', { email, displayName })
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    console.log('Firebase Auth 新規登録成功:', user.uid)

    // プロフィール更新
    await updateProfile(user, { displayName })
    console.log('プロフィール更新完了')

    // Firestoreにユーザー情報を保存
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    console.log('Firestore保存完了')

    return { user, error: null }
  } catch (error: any) {
    console.error('Sign up error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    })
    
    let errorMessage = '新規登録に失敗しました。'
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'このメールアドレスは既に使用されています。'
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'パスワードが弱すぎます。より強力なパスワードを入力してください。'
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = '無効なメールアドレスです。'
    } else if (error.code === 'auth/invalid-api-key') {
      errorMessage = 'Firebase設定エラー: APIキーが無効です。'
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'ネットワークエラー: インターネット接続を確認してください。'
    } else {
      errorMessage = `新規登録エラー: ${error.message}`
    }
    
    return { user: null, error: errorMessage }
  }
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return { user: userCredential.user, error: null }
  } catch (error: any) {
    console.error('Sign in error:', error)
    
    let errorMessage = 'ログインに失敗しました。'
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'このメールアドレスは登録されていません。'
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'パスワードが間違っています。'
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = '無効なメールアドレスです。'
    } else if (error.code === 'auth/user-disabled') {
      errorMessage = 'このアカウントは無効になっています。'
    }
    
    return { user: null, error: errorMessage }
  }
}

export async function signInWithGoogle(): Promise<AuthResult> {
  try {
    console.log('Googleログインを開始')
    
    const provider = new GoogleAuthProvider()
    const userCredential = await signInWithPopup(auth, provider)
    const user = userCredential.user
    console.log('Google Auth 成功:', user.uid)

    // Firestoreにユーザー情報が存在するかチェック
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    
    if (!userDoc.exists()) {
      console.log('新規Googleユーザー - Firestoreに保存')
      // 新規ユーザーの場合、Firestoreに保存
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    } else {
      console.log('既存Googleユーザー')
    }

    return { user, error: null }
  } catch (error: any) {
    console.error('Google sign in error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    })
    
    let errorMessage = 'Googleログインに失敗しました。'
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'ログインがキャンセルされました。'
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'ポップアップがブロックされました。ブラウザの設定を確認してください。'
    } else if (error.code === 'auth/invalid-api-key') {
      errorMessage = 'Firebase設定エラー: APIキーが無効です。'
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'ネットワークエラー: インターネット接続を確認してください。'
    } else {
      errorMessage = `Googleログインエラー: ${error.message}`
    }
    
    return { user: null, error: errorMessage }
  }
}

export async function signOutUser(): Promise<{ error: string | null }> {
  try {
    await signOut(auth)
    return { error: null }
  } catch (error: any) {
    console.error('Sign out error:', error)
    return { error: 'ログアウトに失敗しました。' }
  }
}

export async function getCurrentUser(): Promise<CurrentUser> {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe()
      if (user) {
        resolve({
          id: user.uid,
          email: user.email,
          name: user.displayName
        })
      } else {
        resolve(null)
      }
    })
  })
}

export async function resetPassword(email: string): Promise<{ error: string | null }> {
  try {
    await sendPasswordResetEmail(auth, email)
    return { error: null }
  } catch (error: any) {
    console.error('Password reset error:', error)
    
    let errorMessage = 'パスワードリセットに失敗しました。'
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'このメールアドレスは登録されていません。'
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = '無効なメールアドレスです。'
    }
    
    return { error: errorMessage }
  }
}

export async function updateUserProfile(userId: string, profileData: any): Promise<{ error: string | null }> {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      ...profileData,
      updatedAt: new Date()
    })
    return { error: null }
  } catch (error: any) {
    console.error('Profile update error:', error)
    return { error: 'プロフィールの更新に失敗しました。' }
  }
}

export async function saveDocumentInfo(userId: string, documentData: any): Promise<{ error: string | null }> {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      documents: documentData,
      updatedAt: new Date()
    })
    return { error: null }
  } catch (error: any) {
    console.error('Document save error:', error)
    return { error: '書類情報の保存に失敗しました。' }
  }
}

export async function saveEmergencyContacts(userId: string, emergencyContacts: any): Promise<{ error: string | null }> {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      emergencyContacts,
      updatedAt: new Date()
    })
    return { error: null }
  } catch (error: any) {
    console.error('Emergency contacts save error:', error)
    return { error: '緊急連絡先の保存に失敗しました。' }
  }
}
