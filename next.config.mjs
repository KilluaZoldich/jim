// import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/jim' : '',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Configurazioni per gestire meglio i problemi di rendering
  experimental: {
    optimizePackageImports: ['lucide-react'],
    // Disabilita alcuni controlli che possono causare problemi con React 19
    disableOptimizedLoading: true,
  },
  webpack: (config, { dev, isServer }) => {
    // Gestione migliore degli errori di rendering
    if (!isServer && dev) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    
    // Configurazione per gestire meglio le icone SVG
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })
    
    // Ottimizzazioni per React 19
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks.cacheGroups,
            icons: {
              test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
              name: 'icons',
              chunks: 'all',
              priority: 10,
            },
          },
        },
      }
    }
    
    return config
  },
  // Configurazione per gestire meglio gli errori di rendering
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
}

export default nextConfig;

// Temporarily disabled PWA config due to build issues with static export
// const pwaConfig = withPWA({
//   dest: 'public',
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === 'development',
//   runtimeCaching: [
//     {
//       urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
//       handler: 'CacheFirst',
//       options: {
//         cacheName: 'google-fonts-stylesheets',
//         expiration: {
//           maxEntries: 4,
//           maxAgeSeconds: 365 * 24 * 60 * 60 // 365 days
//         }
//       }
//     },
//     {
//       urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
//       handler: 'CacheFirst',
//       options: {
//         cacheName: 'google-fonts-webfonts',
//         expiration: {
//           maxEntries: 4,
//           maxAgeSeconds: 365 * 24 * 60 * 60 // 365 days
//         }
//       }
//     },
//     {
//       urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
//       handler: 'StaleWhileRevalidate',
//       options: {
//         cacheName: 'static-font-assets',
//         expiration: {
//           maxEntries: 4,
//           maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
//         }
//       }
//     },
//     {
//       urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
//       handler: 'StaleWhileRevalidate',
//       options: {
//         cacheName: 'static-image-assets',
//         expiration: {
//           maxEntries: 64,
//           maxAgeSeconds: 24 * 60 * 60 // 24 hours
//         }
//       }
//     },
//     {
//       urlPattern: /\.(?:js)$/i,
//       handler: 'StaleWhileRevalidate',
//       options: {
//         cacheName: 'static-js-assets',
//         expiration: {
//           maxEntries: 32,
//           maxAgeSeconds: 24 * 60 * 60 // 24 hours
//         }
//       }
//     },
//     {
//       urlPattern: /\.(?:css|less)$/i,
//       handler: 'StaleWhileRevalidate',
//       options: {
//         cacheName: 'static-style-assets',
//         expiration: {
//           maxEntries: 32,
//           maxAgeSeconds: 24 * 60 * 60 // 24 hours
//         }
//       }
//     },
//     {
//       urlPattern: /\/_next\/data\/.+\/.+\.json$/i,
//       handler: 'StaleWhileRevalidate',
//       options: {
//         cacheName: 'next-data',
//         expiration: {
//           maxEntries: 32,
//           maxAgeSeconds: 24 * 60 * 60 // 24 hours
//         }
//       }
//     },
//     {
//       urlPattern: /\.(?:json|xml|csv)$/i,
//       handler: 'NetworkFirst',
//       options: {
//         cacheName: 'static-data-assets',
//         expiration: {
//           maxEntries: 32,
//           maxAgeSeconds: 24 * 60 * 60 // 24 hours
//         }
//       }
//     },
//     {
//       urlPattern: ({ request }) => request.destination === 'document',
//       handler: 'NetworkFirst',
//       options: {
//         cacheName: 'documents',
//         expiration: {
//           maxEntries: 32,
//           maxAgeSeconds: 24 * 60 * 60 // 24 hours
//         }
//       }
//     }
//   ]
// });
// 
// export default pwaConfig(nextConfig);
