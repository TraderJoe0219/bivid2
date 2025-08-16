/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
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
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://apis.google.com https://js.stripe.com https://maps.googleapis.com https://maps.gstatic.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https: https://maps.gstatic.com https://maps.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://api.stripe.com https://firestore.googleapis.com https://firebasestorage.googleapis.com https://maps.googleapis.com wss:",
      "frame-ancestors 'none'",
      "frame-src https://js.stripe.com",
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
