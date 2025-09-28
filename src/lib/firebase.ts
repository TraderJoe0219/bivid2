import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getFunctions } from 'firebase/functions'

// 環境変数の取得とバリデーション
const getFirebaseConfig = () => {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  }

  // 本番環境での設定確認（エラーではなく警告に変更）
  if (process.env.NODE_ENV === 'production') {
    const requiredEnvVars = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
      'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      'NEXT_PUBLIC_FIREBASE_APP_ID'
    ]

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
    
    if (missingVars.length > 0) {
      console.warn('⚠️ Firebase設定警告:', {
        message: 'Firebase環境変数が設定されていません。デモモードで動作します。',
        missingVars,
        currentEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV || 'not-set'
      })
      // エラーを投げずにデモ設定を返す
      return {
        apiKey: 'AIzaSyDemoKey123456789abcdefghijklmnop',
        authDomain: 'bivid-demo.firebaseapp.com',
        projectId: 'bivid-demo',
        storageBucket: 'bivid-demo.appspot.com',
        messagingSenderId: '123456789012',
        appId: '1:123456789012:web:abcdef123456789'
      }
    }

    // 設定値の妥当性確認（警告のみ）
    if (!config.apiKey || config.apiKey.includes('Demo') || config.apiKey.length < 20) {
      console.warn('⚠️ Firebase API Key 警告:', {
        hasApiKey: !!config.apiKey,
        isDemo: config.apiKey?.includes('Demo'),
        keyLength: config.apiKey?.length || 0,
        message: 'デモキーが使用されています'
      })
    }
  }

  // 開発環境での設定確認（警告のみ）
  if (process.env.NODE_ENV === 'development') {
    console.log('🔥 Firebase Config:', {
      ...config,
      apiKey: config.apiKey ? (config.apiKey.includes('Demo') ? '[DEMOキー - 実際のキーが必要]' : '[設定済み]') : '[未設定]'
    })

    const hasValidConfig = config.apiKey &&
      config.authDomain &&
      config.projectId &&
      !config.apiKey.includes('Demo')

    if (!hasValidConfig) {
      console.warn('⚠️ Firebase設定が不完全です。.env.localファイルを確認してください。')
    }
  }

  // Vercel環境での診断情報
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    console.log('🔥 Vercel Firebase診断:', {
      currentDomain: window.location.hostname,
      authDomain: config.authDomain,
      projectId: config.projectId,
      hasApiKey: !!config.apiKey,
      isVercel: window.location.hostname.includes('vercel.app')
    })
  }

  return config
}

const firebaseConfig = getFirebaseConfig()

// Firebase初期化（エラーハンドリング付き）
let app
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
  if (process.env.NODE_ENV === 'development') {
    console.log('✅ Firebase初期化成功')
  }
} catch (error) {
  console.warn('⚠️ Firebase初期化警告:', error)
  // 本番環境でもダミーアプリで継続（エラーを投げない）
  app = getApps().length === 0 ? initializeApp({
    apiKey: 'AIzaSyDemoKey123456789abcdefghijklmnop',
    authDomain: 'bivid-demo.firebaseapp.com',
    projectId: 'bivid-demo',
    storageBucket: 'bivid-demo.appspot.com',
    messagingSenderId: '123456789012',
    appId: '1:123456789012:web:abcdef123456789'
  }) : getApps()[0]
}

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const functions = getFunctions(app)

export default app
