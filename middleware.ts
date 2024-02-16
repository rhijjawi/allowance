import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
    publicRoutes: ['/', '/api(.*)', '/monitoring(.*)', '/report/(.*)/(.+)', '/trpc(.*)', '/faq', '/debt/calculator', '/legal/privacy-policy', '/legal/terms-of-service', '/.well-known(.*)', '/pricing(.*)'],
});
 
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
 