/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin'],
    outputFileTracingIncludes: {
      '/api/**/*': ['./node_modules/**/*.wasm', './node_modules/**/*.node'],
    },
  },
  // 画像最適化の設定
  images: {
    domains: [
      'images.unsplash.com',
      'lh3.googleusercontent.com',
      'firebasestorage.googleapis.com'
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Vercel向けの最適化
  experimental: {
    outputFileTracingIncludes: {
      '/api/**/*': ['./node_modules/**/*.wasm', './node_modules/**/*.node'],
    },
  },

  // webpack設定のカスタマイズ
  webpack: (config, { dev, isServer }) => {
    // 本番ビルド時の環境変数チェック
    if (!dev && process.env.NODE_ENV === 'production') {
      console.log('🔍 Vercelデプロイメント環境変数チェック...')
      
      const requiredEnvVars = [
        'NEXT_PUBLIC_FIREBASE_API_KEY',
        'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
        'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
        'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
        'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
        'NEXT_PUBLIC_FIREBASE_APP_ID'
      ]

      const missingVars = requiredEnvVars.filter(varName => {
        const value = process.env[varName]
        return !value || value.includes('Demo') || value.length < 10
      })

      if (missingVars.length > 0) {
        console.error('❌ 必須環境変数が設定されていません:')
        missingVars.forEach(varName => {
          console.error(`   - ${varName}: ${process.env[varName] || '[未設定]'}`)
        })
        console.error('\n📋 Vercelの環境変数設定を確認してください:')
        console.error('   1. Vercelダッシュボード → プロジェクト → Settings → Environment Variables')
        console.error('   2. 各環境変数をProduction/Preview/Development用に設定')
        console.error('   3. 再デプロイを実行')
        console.error('')
        
        // 本番ビルドは継続（警告のみ）
        console.warn('⚠️ 環境変数が不足していますが、ビルドを継続します。')
        console.warn('   アプリケーション実行時にFirebase認証エラーが発生する可能性があります。')
      } else {
        console.log('✅ 環境変数チェック完了')
      }
    }

    // サーバーサイドでの大きな依存関係の外部化
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push({
        'utf-8-validate': 'commonjs utf-8-validate',
        'bufferutil': 'commonjs bufferutil',
        '@next/swc-linux-x64-musl': 'commonjs @next/swc-linux-x64-musl',
        '@next/swc-linux-x64-gnu': 'commonjs @next/swc-linux-x64-gnu',
        're2': 'commonjs re2',
        '@electric-sql/pglite': 'commonjs @electric-sql/pglite',
      })
    }

    // SVG処理の設定
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    })

    return config
  },

  // セキュリティヘッダー
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
