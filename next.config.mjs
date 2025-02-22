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
    }
    // Remove these:
    // trailingSlash: true,  // Can cause path issues
    // assetPrefix: '',      // Not needed for root deployment
};

export default nextConfig;
