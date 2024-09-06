'use server';

import axios from 'axios';
import { cookies } from 'next/headers';

const API_URL = process.env.BASE_API_URL;

export async function getAllUser(page: number, limit: number) {
  const token = cookies().get('token')?.value;
  if (!token) {
    return { ok: false, message: 'Unauthenticated' };
  }
  try {
    const res = await axios.get(
      `${API_URL}admins/users?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return {
      ok: true,
      data: res.data,
    };
  } catch (error) {
    console.error('Error getting user data:', error);
    return {
      ok: false,
      message: 'Failed to get user',
    };
  }
}

export const searchUser = async (query: string) => {
  const token = cookies().get('token')?.value;
  if (!token) {
    return { ok: false, message: 'Unauthenticated' };
  }
  try {
    const res = await axios.get(`${API_URL}admins/search/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { query },
    });
    return { ok: true, data: res.data };
  } catch (error) {
    return { ok: false, message: 'Failed to search user' };
  }
};
