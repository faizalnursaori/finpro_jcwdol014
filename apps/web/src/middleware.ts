'use server';

import { protectRoute } from '@/actions/token';
import { NextRequest } from 'next/server';

export const config = {
  matcher: [
    '/admin-management',
    '/admin-management/create',
    '/enduser-management',
    '/products-management',
    '/products-management/edit',
    '/products-management/create',
    '/cat-management',
  ],
};

export async function middleware(req: NextRequest) {
  return await protectRoute(req);
}
