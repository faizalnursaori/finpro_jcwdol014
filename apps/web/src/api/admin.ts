'use server';

import axios from 'axios';
import { cookies } from 'next/headers';

const API_URL = process.env.BASE_API_ADMIN;

interface User {
  name: string;
  email: string;
  mobileNumber: string;
  username: string;
  password: string;
  confirmPassword: string;
  role: string;
  isVerified: boolean;
}

export const getAllOrders = async (
  page: number,
  limit: number,
  warehouseId?: number,
) => {
  const token = cookies().get('token')?.value;
  if (!token) {
    return { ok: false, message: 'Unauthenticated' };
  }
  try {
    let url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/orders?page=${page}&limit=${limit}`;
    if (warehouseId) {
      url += `&warehouseId=${warehouseId}`;
    }
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      ok: true,
      data: res.data,
    };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || 'Failed to get orders';
    console.error('Error getting Orders data:', errorMessage);
    return {
      ok: false,
      message: errorMessage,
    };
  }
};

export const updateStatusOrder = async (id: number, status: string) => {
  const token = cookies().get('token')?.value;
  if (!token) {
    return { ok: false, message: 'Unauthenticated' };
  }
  try {
    let user = {
      orderId: id,
      status: status,
    };
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/orders/update_status`,
      user,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return { ok: true, data: res.data };
  } catch (error: any) {
    let errorMessage = 'Failed to update Status';

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

export const getAllAdmin = async (page: number, limit: number) => {
  const token = cookies().get('next-auth.session-token')?.value;
  try {
    const res = await axios.get(
      `${API_URL}/admins?page=${page}&limit=${limit}`,
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
    console.error('Error getting Admins data:', error);
    return {
      ok: false,
      message: 'Failed to get Admin',
    };
  }
};

export const updateUser = async (id: number, user: Partial<User>) => {
  const token = cookies().get('next-auth.session-token')?.value;
  if (!token) {
    return { ok: false, message: 'Unauthenticated' };
  }
  try {
    const res = await axios.patch(`${API_URL}/${id}`, user, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
  const token = cookies().get('next-auth.session-token')?.value;
  if (!token) {
    return { ok: false, message: 'Unauthenticated' };
  }
  try {
    const res = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { ok: true, data: res.data };
  } catch (error) {
    return { ok: false, message: 'Failed to delete user' };
  }
};

export const searchUser = async (query: string) => {
  const token = cookies().get('next-auth.session-token')?.value;
  if (!token) {
    return { ok: false, message: 'Unauthenticated' };
  }
  try {
    const res = await axios.get(`${API_URL}/admins?search=${query}`, {
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

export const createAdmin = async (adminData: User) => {
  const token = cookies().get('next-auth.session-token')?.value;
  try {
    const response = await axios.post(`${API_URL}`, adminData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create user');
  }
};
