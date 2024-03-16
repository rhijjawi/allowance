import { authMiddleware } from '@clerk/nextjs/server'
// ```js
// const sessions = await clerk.user.getSessions();
// sessions.map((session)=>session.revoke());
// ```
export default authMiddleware({
    publicRoutes: [
        '/',
        '/api/(.*)',
        '/report/(.*)/(.+)',
        '/trpc(.*)',
        '/faq',
        '/debt/calculator',
        '/legal/privacy-policy',
        '/legal/terms-of-service',
        '/.well-known(.*)',
        '/pricing(.*)',
    ],
})

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
