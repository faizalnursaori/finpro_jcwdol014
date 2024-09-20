export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/profile/:path*/:path*',
    '/cart/:path*/:path*',
    '/admin-management/:path*',
    '/enduser-management',
    '/products-management/:path*',
    '/cat-management',
    '/order-management',
  ],
};
