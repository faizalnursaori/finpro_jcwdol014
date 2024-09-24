'use server';
import axios from 'axios';
import { haversineDistance } from '@/utils/getClosestStore';
import { getUserCurrentLocation } from '@/utils/getUserCurrentLocation';
import 'dotenv/config';
import { cookies } from 'next/headers';

const token = cookies().get('next-auth.session-token')?.value;

export const getClosestWarehouse = async () => {
  try {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/warehouses/`);
  const data = res.data.warehouses;
  const userLoc = getUserCurrentLocation();
  let distance = 0;
  let wareId = 1; //default store
  data?.forEach(async (warehouse: any) => {
    const result = haversineDistance(
      [userLoc.lon, userLoc.lat],
      [warehouse.longitude, warehouse.latitude],
    );
    const data = res.data.warehouses;
    const userLoc = await getUserCurrentLocation();
    let distance = 0;
    let wareId = 1; //default store
    data?.forEach((warehouse: any) => {
      const result = haversineDistance(
        [userLoc?.lon as number, userLoc?.lat as number],
        [warehouse.longitude, warehouse.latitude],
      );
      if (distance < result) {
        distance = result;
        wareId = warehouse.id;
      }
    });

    return wareId;
  })} catch (error) {
    console.log(error);
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
    console.error('Error getting warehouses data:', error);
    return {
      ok: false,
      message: 'Failed to get warehouses data',
    };
  }
};

export const getWarehouse = async (id: string) => {
  if (!token) {
    return { ok: false, message: 'Unauthenticated' };
  }

  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/warehouses/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data;
  } catch (error) {
    console.error('Error getting Warehouse data:', error);
    return {
      ok: false,
      message: 'Fail to get Warehouse data ',
    };
  }
};

export const createWarehouse = async (data: any) => {
  if (!token) {
    return { ok: false, message: 'Unauthenticated' };
  }

  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/warehouses/create`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log('Success creating new warehouse');

    return res.data;
  } catch (error) {
    console.error('Error creating new Warehouse:', error);
    return {
      ok: false,
      message: 'Fail to create a new Warehouse.',
    };
  }
};

export const editWarehouse = async (data: any, id: string) => {
  if (!token) {
    return { ok: false, message: 'Unauthenticated' };
  }

  try {
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/warehouses/update/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log('Success updating the warehouse data.');

    return res.data;
  } catch (error) {
    console.error('Error updating the Warehouse data:', error);
    return {
      ok: false,
      message: 'Fail to update the Warehouse.',
    };
  }
};

export const deleteWarehouse = async (id: number) => {
  if (!token) {
    return { ok: false, message: 'Unauthenticated' };
  }

  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/warehouses/delete/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log('Success deleting the warehouse.');

    return res.data;
  } catch (error) {
    console.error('Error deleting the Warehouse:', error);
    return {
      ok: false,
      message: 'Fail to delete the Warehouse.',
    };
  }
};

export const searchWarehouse = async (query: string) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/warehouses?search=${query}`,
      {
        params: { query },
      },
    );
    return { ok: true, data: res.data };
  } catch (error) {
    return { ok: false, message: 'Warehouse not found.' };
  }
};

export const getWarehouses = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}warehouses`,
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

export const getWarehouseId = async (userId: string): Promise<number> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}warehouses/user/${userId}`,
    );
    console.log(response.data.warehouse);

    return response.data.warehouse;
  } catch (error) {
    console.error('Error fetching warehouseId:', error);
    throw new Error('Failed to fetch warehouseId');
  }
};
