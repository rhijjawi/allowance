/** @type {import('next').NextConfig} */
const nextConfig = {
    i18n: {
        locales: ['en'],
        defaultLocale: 'en',
    },
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
