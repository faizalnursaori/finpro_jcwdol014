'use server';

import axios from 'axios';

const API_URL = process.env.BASE_API_URL;

export async function getAllUser(page: number, limit: number) {
  try {
    const res = await axios.get(
      `${API_URL}admin/user/getUsers?page=${page}&limit=${limit}`,
      {},
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
  try {
    const res = await axios.get(`${API_URL}admin/user/search/end-user`, {
      params: { query },
    });
    return { ok: true, data: res.data };
  } catch (error) {
    return { ok: false, message: 'Failed to search user' };
  }
};
