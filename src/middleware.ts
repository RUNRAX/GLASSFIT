import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/train(.*)',
  '/profile(.*)',
  '/coach(.*)',
  '/progress(.*)',
  '/api/(.*)'
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req) && !req.nextUrl.pathname.startsWith('/api/chat')) {
    auth().protect();
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
