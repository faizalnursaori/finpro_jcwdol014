'use server';

import { cookies } from 'next/headers';

export async function setCookies(cookieName: string, value: any) {
  cookies().set(cookieName, value);
}

export async function getCookie(cookieName: string) {
  return await cookies().get(cookieName)?.value;
}

export async function deleteCookie(cookieName: string) {
  return await cookies().delete(cookieName);
}
