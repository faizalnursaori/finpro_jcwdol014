'use server';

import axios from 'axios';
import { cookies } from 'next/headers';

const API_URL = process.env.BASE_API_CATEGORY;

export interface Category {
  id: number;
  name: string;
  slug: string;
  createdAt?: Date;
}

export const getCategoriesByPage = async (page: number, limit: number) => {
  const token = cookies().get('next-auth.session-token')?.value;
  try {
    const res = await axios.get(`${API_URL}`, {
      params: { page, limit },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      ok: true,
      data: res.data,
    };
  } catch (error) {
    return {
      ok: false,
      message: (error as Error).message,
    };
  }
};

export const getCategories = async () => {
  const token = cookies().get('next-auth.session-token')?.value;
  try {
    const res = await axios.get(`${API_URL}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      ok: true,
      data: res.data.categories,
    };
  } catch (error) {
    return {
      ok: false,
      message: (error as Error).message,
    };
  }
};

export const updateCategory = async (
  id: number,
  categoryData: Partial<Omit<Category, 'id' | 'createdAt'>>,
) => {
  const token = cookies().get('next-auth.session-token')?.value;
  try {
    const res = await axios.put(`${API_URL}/${id}`, categoryData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      ok: true,
      data: res.data,
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error.response?.data?.message || (error as Error).message,
    };
  }
};

export const createCategory = async (
  categoryData: Omit<Category, 'id' | 'createdAt'>,
) => {
  const token = cookies().get('next-auth.session-token')?.value;
  try {
    const res = await axios.post(`${API_URL}`, categoryData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      ok: true,
      data: res.data,
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error.response?.data?.message || (error as Error).message,
    };
  }
};

export const deleteCategory = async (id: number) => {
  try {
    const token = cookies().get('next-auth.session-token')?.value;
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      ok: true,
      data: response.data,
    };
  } catch (error) {
    return {
      ok: false,
      message: (error as Error).message,
    };
  }
};

export const searchCategory = async (query: string) => {
  const token = cookies().get('next-auth.session-token')?.value;
  try {
    const response = await axios.get(`${API_URL}?search=${query}`, {
      params: { query },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      ok: true,
      data: response.data,
    };
  } catch (error) {
    return {
      ok: false,
      message: (error as Error).message,
    };
  }
};
