'use server';
import axios from 'axios';
import { haversineDistance } from '@/utils/getClosestStore';
import { getUserCurrentLocation } from '@/utils/getUserCurrentLocation';
import 'dotenv/config';
import { cookies } from 'next/headers';

const token = cookies().get('next-auth.session-token')?.value;

export const getClosestWarehouse = async () => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/warehouses/`,
    );
    const data = res.data.warehouses;
    const userLoc = await getUserCurrentLocation();

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

export const getWarehouseId = async (userId: string): Promise<number> => {
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
