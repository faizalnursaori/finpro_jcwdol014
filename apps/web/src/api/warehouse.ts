'use server';
import axios from 'axios';
import { haversineDistance } from '@/utils/getClosestStore';
import { getUserCurrentLocation } from '@/utils/getUserCurrentLocation';
import { cookies } from 'next/headers';

export const getClosestWarehouse = async () => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}warehouses/`,
    );
    const data = res.data.warehouses;
    const userLoc = getUserCurrentLocation();

    let closestDistance = Infinity; // Atur jarak default ke yang sangat besar
    let closestWarehouseId = null; // Default warehouse null sampai ditemukan yang terdekat

    data?.forEach((warehouse: any) => {
      const distance = haversineDistance(
        [userLoc?.lon as number, userLoc?.lat as number],
        [warehouse.longitude, warehouse.latitude],
      );

      // Simpan gudang yang memiliki jarak terdekat
      if (distance < closestDistance) {
        closestDistance = distance;
        closestWarehouseId = warehouse.id;
      }
    });

    return closestWarehouseId; // Mengembalikan ID gudang terdekat
  } catch (error) {
    console.error('Error getting closest warehouse:', error);
  }
};

export const getWarehouses = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/warehouses`,
    );
    return response.data.warehouses;
  } catch (error) {
    throw new Error('Failed to fetch stores');
  }
};

export const getWarehouseByUserId = async (userId: number) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/warehouses/user/${userId}`,
    );
    return response.data.warehouse;
  } catch (error) {
    console.error('Error fetching warehouse by user ID:', error);
    throw error;
  }
};

export const getWarehouseId = async (userId: number): Promise<number> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/warehouses/user/${userId}`,
    );
    return response.data.warehouse;
  } catch (error) {
    console.error('Error fetching warehouseId:', error);
    throw new Error('Failed to fetch warehouseId');
  }
};

export const createWarehouse = async (data: any) => {
  const token = cookies().get('next-auth.session-token')?.value;
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/warehouses/create`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create store');
  }
};

export const getWarehouse = async (id: string) => {
  const token = cookies().get('next-auth.session-token')?.value;
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/warehouses/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to get store data',
    );
  }
};

export const editWarehouse = async (data: any, id: string) => {
  const token = cookies().get('next-auth.session-token')?.value;
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/warehouses/update/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to update store data',
    );
  }
};

export const deleteWarehouse = async (id: number) => {
  const token = cookies().get('next-auth.session-token')?.value;
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/warehouses/delete/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to delete store data',
    );
  }
};

export const getWarehouseByPage = async (page: number, limit: number) => {
  const token = cookies().get('next-auth.session-token')?.value;
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/warehouses/page`,
      {
        params: { page, limit },
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
    console.error('Error getting store data:', error);
    return {
      ok: false,
      message: 'Failed to get store data',
    };
  }
};

export const searchWarehouse = async (query: string) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/warehouses/page?search=${query}`,
      {
        params: { query },
      },
    );
    return { ok: true, data: res.data };
  } catch (error) {
    return { ok: false, message: 'Failed to search products' };
  }
};
