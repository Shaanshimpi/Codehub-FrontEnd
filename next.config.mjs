/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
    },
    typescript: {
      ignoreBuildErrors: true, // ⚠️ Ignores TS errors during build
    },
    env:{
      NEXT_PUBLIC_STRAPI_API_URL: process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://codehub-exercise-2-production.up.railway.app/api/',
    },
    webpack: (config, { isServer }) => {
        // Fix for Mermaid dynamic imports
        config.module.rules.push({
            test: /\.mjs$/,
            include: /node_modules/,
            type: 'javascript/auto',
        });

        // Optimize Mermaid chunks
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                path: false,
                crypto: false,
            };
        }

        return config;
    },
    // Remove these:
    // trailingSlash: true,  // Can cause path issues
    // assetPrefix: '',      // Not needed for root deployment
};

export default nextConfig;
