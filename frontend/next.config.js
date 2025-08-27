const withPWA = require("next-pwa");
const path = require('path');

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true // 빌드 시 린트 오류로 fail 안 함
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname, 'src'),
    };
    return config;
  },
};

// next-pwa와 Next.js 15 타입 충돌 임시 해결을 위한 as any 캐스팅
module.exports = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "offlineCache",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 24 * 60 * 60,
        },
      },
    },
  ],
  buildExcludes: [/middleware-manifest\.json$/],
})(nextConfig);