/** @type {import('next').NextConfig} */
const nextConfig = {
    
    generateEtags: true,
    images: {
        remotePatterns : [{
            protocol: 'https',
            hostname: 's.gravatar.com',
            pathname: '/avatar/**'
        },
        {
            protocol: 'https',
            hostname: 'img.clerk.com',
        }
        ],   
    }
}

module.exports = nextConfig
