/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com', 'images.unsplash.com', 'maps.googleapis.com', 'maps.gstatic.com'],
  },
  webpack: (config, { isServer }) => {
    // undiciパッケージの問題を回避
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
  // Node.js v22との互換性のためにswcMinifyを無効化
  swcMinify: false,
  // WebSocketとHMRの設定
  experimental: {
    forceSwcTransforms: false,
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://js.stripe.com https://maps.googleapis.com https://maps.gstatic.com https://www.google.com https://www.gstatic.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://maps.googleapis.com https://maps.gstatic.com",
      "img-src 'self' data: blob: https: https://maps.gstatic.com https://maps.googleapis.com https://streetviewpixels-pa.googleapis.com https://maps.google.com https://khms0.googleapis.com https://khms1.googleapis.com https://khms2.googleapis.com https://khms3.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com https://maps.gstatic.com",
      "connect-src 'self' https://api.stripe.com https://firestore.googleapis.com https://firebasestorage.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.googleapis.com https://firebase.googleapis.com https://maps.googleapis.com https://maps.gstatic.com wss: ws: wss://localhost:* ws://localhost:* wss://127.0.0.1:* ws://127.0.0.1:*",
      "worker-src 'self' blob:",
      "child-src 'self' blob:",
      "frame-ancestors 'none'",
      "frame-src 'self' https://js.stripe.com https://maps.google.com",
      "object-src 'none'",
      "media-src 'self' blob: data:",
    ].join('; ')

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(self), microphone=(), camera=()' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
