import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  images: { formats: ['image/avif', 'image/webp'] },
  // Tailwind v4 is wired through a Turbopack loader in this Next version (create-next-app default).
  turbopack: {
    rules: {
      '*.css': { loaders: ['@tailwindcss/turbopack'], as: '*.css' },
    },
  },
};

export default nextConfig;
