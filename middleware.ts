import { authMiddleware } from "@clerk/nextjs";
 
//https://clerk.com/docs/references/nextjs/auth-middleware
export default authMiddleware({
    publicRoutes: ['/', '/api(.*)', '/trpc(.*)', '/faq', '/debt/calculator', '/legal/privacy-policy', '/legal/terms-of-service', '/.well-known(.*)', '/pricing(.*)'],
});
 
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
 