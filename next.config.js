/** @type {import('next').NextConfig} */
const nextConfig = {
    
    generateEtags: true,
    images: {
        remotePatterns : [{
            protocol: 'https',
            hostname: 's.gravatar.com',
            port: '',
            pathname: '/avatar/**'
        }
        ],   
    }
}

module.exports = nextConfig
