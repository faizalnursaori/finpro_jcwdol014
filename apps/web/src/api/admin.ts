'use server';

import axios from 'axios';

const API_URL = process.env.BASE_API_URL;

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  avatarUrl: string;
  location: string;
  isVerified: boolean;
  gender: string;
  mobile: number;
}

export const getAllAdmin = async (page: number, limit: number) => {
  try {
    const res = await axios.get(
      `${API_URL}admin/user/getAdmins?page=${page}&limit=${limit}`,
      {},
    );
    return {
      ok: true,
      data: res.data,
    };
  } catch (error) {
    console.error('Error getting Admins data:', error);
    return {
      ok: false,
      message: 'Failed to get Admin',
    };
  }
};

export const updateUser = async (id: number, user: Partial<User>) => {
  try {
    const res = await axios.patch(`${API_URL}admin/user/update/${id}`, user, {
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    });
    return { ok: true, data: res.data };
  } catch (error: any) {
    let errorMessage = 'Failed to update User';

    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }

    return {
      ok: false,
      message: errorMessage,
      error: error.message,
    };
  }
};

export const deleteAdmin = async (id: number) => {
  try {
    const res = await axios.delete(`${API_URL}admin/user/delete/${id}`);
    return { ok: true, data: res.data };
  } catch (error) {
    return { ok: false, message: 'Failed to delete user' };
  }
};

export const searchUser = async (query: string) => {
  try {
    const res = await axios.get(`${API_URL}admin/user/search/admin`, {
      params: { query },
    });
    return { ok: true, data: res.data };
  } catch (error) {
    return { ok: false, message: 'Failed to search user' };
  }
};
