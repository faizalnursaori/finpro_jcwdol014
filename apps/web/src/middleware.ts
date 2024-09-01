'use server';

import { protectRoute } from '@/actions/token';
import { NextRequest } from 'next/server';

export const config = {
  matcher: ['/dashboard'],
};

export async function middleware(req: NextRequest) {
  return await protectRoute(req);
}
