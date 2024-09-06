'use server';

import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

const secret = new TextEncoder().encode('SECRET_KEY');

export const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const protectRoute = async (req: NextRequest) => {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect('http://localhost:3000/login');
  }

  try {
    const payload = await verifyToken(token);

    if (payload.role !== 'SUPER_ADMIN' && payload.role !== 'ADMIN') {
      return NextResponse.redirect('http://localhost:3000');
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect('http://localhost:3000/login');
  }
};
