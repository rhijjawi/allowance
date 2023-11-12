import { authMiddleware } from "@clerk/nextjs";
 
//https://clerk.com/docs/references/nextjs/auth-middleware
export default authMiddleware({
    publicRoutes: ['/', '/api(.*)', '/trpc(.*)', '/faq', '/debt/calculator', '/privacy-policy', '/terms-of-service', '/.well-known(.*)'],
});
 
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
 