/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
    // Remove these:
    // trailingSlash: true,  // Can cause path issues
    // assetPrefix: '',      // Not needed for root deployment
};

export default nextConfig;