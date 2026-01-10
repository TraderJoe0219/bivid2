import { NextResponse } from 'next/server'

/**
 * Vercel環境変数診断API
 *
 * このエンドポイントは、Vercel環境でのFirebase設定を確認するために使用します。
 *
 * 使用方法:
 * https://your-vercel-url.vercel.app/api/deploy-check
 */
export async function GET() {
  // 環境変数の存在確認
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  }

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  // 各環境変数の状態確認
  const envStatus = {
    NEXT_PUBLIC_FIREBASE_API_KEY: !!firebaseConfig.apiKey,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: !!firebaseConfig.authDomain,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: !!firebaseConfig.projectId,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: !!firebaseConfig.storageBucket,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: !!firebaseConfig.messagingSenderId,
    NEXT_PUBLIC_FIREBASE_APP_ID: !!firebaseConfig.appId,
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: !!firebaseConfig.measurementId,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: !!googleMapsApiKey,
  }

  // 全て設定されているかチェック
  const allConfigured = Object.values(envStatus).every(status => status === true)

  // Firebase APIキーの妥当性チェック
  const apiKeyValid =
    firebaseConfig.apiKey &&
    !firebaseConfig.apiKey.includes('Demo') &&
    !firebaseConfig.apiKey.includes('your_') &&
    firebaseConfig.apiKey.length > 30 // Firebase APIキーは通常39文字

  // 詳細情報（セキュリティのため一部マスク）
  const configDetails = {
    apiKey: firebaseConfig.apiKey
      ? (apiKeyValid
          ? `${firebaseConfig.apiKey.substring(0, 10)}...${firebaseConfig.apiKey.substring(firebaseConfig.apiKey.length - 4)}`
          : '[無効なAPIキー]')
      : '[未設定]',
    authDomain: firebaseConfig.authDomain || '[未設定]',
    projectId: firebaseConfig.projectId || '[未設定]',
    storageBucket: firebaseConfig.storageBucket || '[未設定]',
    messagingSenderId: firebaseConfig.messagingSenderId || '[未設定]',
    appId: firebaseConfig.appId
      ? `${firebaseConfig.appId.substring(0, 20)}...`
      : '[未設定]',
    measurementId: firebaseConfig.measurementId || '[未設定]',
    googleMapsApiKey: googleMapsApiKey
      ? `${googleMapsApiKey.substring(0, 10)}...${googleMapsApiKey.substring(googleMapsApiKey.length - 4)}`
      : '[未設定]',
  }

  // レスポンス
  return NextResponse.json({
    status: allConfigured && apiKeyValid ? 'OK' : 'ERROR',
    message: allConfigured && apiKeyValid
      ? 'すべての環境変数が正しく設定されています'
      : '環境変数の設定に問題があります',
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV || 'not-vercel',
      VERCEL_URL: process.env.VERCEL_URL || 'localhost',
    },
    checks: {
      allConfigured,
      apiKeyValid,
      envStatus,
    },
    config: configDetails,
    recommendations: !allConfigured || !apiKeyValid ? [
      !firebaseConfig.apiKey && 'NEXT_PUBLIC_FIREBASE_API_KEY を設定してください',
      !firebaseConfig.authDomain && 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN を設定してください',
      !firebaseConfig.projectId && 'NEXT_PUBLIC_FIREBASE_PROJECT_ID を設定してください',
      !apiKeyValid && firebaseConfig.apiKey && 'Firebase APIキーが無効です。正しいキーを設定してください',
      !googleMapsApiKey && 'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY を設定してください',
    ].filter(Boolean) : [],
  }, {
    status: allConfigured && apiKeyValid ? 200 : 500,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}
