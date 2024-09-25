'use server';

import axios from 'axios';
import { cookies } from 'next/headers';
import { FormData } from '@/app/dashboard/product-management/create/page';

const API_URL = process.env.BASE_API_PRODUCT;

export interface FormDataUpdate {
  productName: string;
  productDescription: string;
  price: number;
  category: number;
  images: File[];
}

export const getProducts = async () => {
  try {
    const res = await axios.get(`${API_URL}`);
    console.log(res.data);
    
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getProductsbyPage = async (page: number, limit: number) => {
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
    console.error('Error getting products data:', error);
    return {
      ok: false,
      message: 'Failed to get products',
    };
  }
};

export const fetchProduct = async (productId: string): Promise<FormData> => {
  try {
    const res = await axios.get(`${API_URL}/${productId}`);
    const data = res.data;
    return {
      productName: data.name,
      productDescription: data.description,
      price: data.price,
      category: data.categoryId,
      images: data.productImages,
    };
  } catch (error) {
    console.error('Failed to fetch product', error);
    throw new Error('Failed to fetch product');
  }
};

export const updateProduct = async (
  productId: string,
  formData: FormDataUpdate,
) => {
  const token = cookies().get('next-auth.session-token')?.value;
  try {
    const res = await axios.put(`${API_URL}/${productId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to update product',
    );
  }
};

export const deleteProduct = async (id: number) => {
  const token = cookies().get('next-auth.session-token')?.value;
  try {
    const res = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { ok: true, data: res.data };
  } catch (error) {
    console.error(error);
    return { ok: false, message: 'Failed to delete product' };
  }
};

export const searchProduct = async (query: string) => {
  try {
    const res = await axios.get(`${API_URL}?search=${query}`, {
      params: { query },
    });
    return { ok: true, data: res.data };
  } catch (error) {
    return { ok: false, message: 'Failed to search products' };
  }
};

export const getProductBySlug = async (slug: string) => {
  try {
    const response = await axios.get(`${API_URL}/slug/${slug}`);
    return { ok: true, data: response.data };
  } catch (error) {
    console.error('Failed to fetch product', error);
    throw new Error('Failed to fetch product');
  }
};

export const createProduct = async (formPayload: FormData) => {
  const token = cookies().get('next-auth.session-token')?.value;
  try {
    const res = await axios.post(`${API_URL}`, formPayload, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Error creating product', error);
    throw error;
  }
};
