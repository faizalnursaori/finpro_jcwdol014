'use server';
import axios from 'axios';
import { cookies } from 'next/headers';

const base_api = process.env.BASE_API_USER;



export const editUser = async (id: string, data: {}) => {
  const token = cookies().get('next-auth.session-token')?.value;
  const res = await axios.put(`${base_api}/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${token}` },
  });
};

export const editUserByToken = async (idToken: any, data: {}) => {
  const res = await axios.put(`${base_api}/register/${idToken}`, data);
};

export const editUserPassword = async (id: string, data: {}) => {
  const token = cookies().get('next-auth.session-token')?.value;
  const res = await axios.put(`${base_api}/password/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const resetUserPassword = async (id: any, data: {}) => {
  const res = await axios.put(`${base_api}/reset-password/${id}`, data);
};

export const getUserByEmail = async (email: string) => {
  const res = await axios.get(`${base_api}/${email}`);
  return res.data;
};

export const createUser = async (data: any) => {
  const res = await axios.post(`${base_api}/`, data);
  return res.data;
};

export const verifyUser = async (data: { email: any }) => {
  const res = await axios.post(`${base_api}/verify`, data);
  return res.data;
};

const API_URL = process.env.BASE_API_ADMIN;

export async function getAllUser(page: number, limit: number) {
  const token = cookies().get('next-auth.session-token')?.value;
  try {
    const res = await axios.get(
      `${API_URL}/users?page=${page}&limit=${limit}`,
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
  const token = cookies().get('next-auth.session-token')?.value;
  try {
    const res = await axios.get(`${API_URL}/users?search=${query}`, {
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
