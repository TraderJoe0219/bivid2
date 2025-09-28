// Vercelデプロイメント診断API
export default function handler(req, res) {
  const deploymentInfo = {
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    vercelUrl: process.env.VERCEL_URL,
    firebase: {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?
        `${process.env.NEXT_PUBLIC_FIREBASE_API_KEY.substring(0, 10)}...` :
        'NOT_SET',
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'NOT_SET',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'NOT_SET',
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'NOT_SET',
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'NOT_SET',
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?
        `${process.env.NEXT_PUBLIC_FIREBASE_APP_ID.substring(0, 15)}...` :
        'NOT_SET'
    },
    headers: req.headers
  }

  // 環境変数の検証
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ]

  const missingVars = requiredVars.filter(varName => !process.env[varName])
  const hasValidConfig = missingVars.length === 0

  res.status(200).json({
    status: hasValidConfig ? 'OK' : 'ERROR',
    deployment: deploymentInfo,
    validation: {
      hasValidConfig,
      missingVars,
      recommendations: hasValidConfig ? [] : [
        'Vercelダッシュボードで環境変数を設定してください',
        'Firebase Consoleで認証ドメインにVercelドメインを追加してください',
        '再デプロイを実行してください'
      ]
    }
  })
}