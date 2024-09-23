'use server';

import axios from 'axios';

const API_URL = process.env.BASE_API_STOCK;

export const getProductStockByWarehouseId = async (warehouseId: number) => {
  try {
    const res = await axios.get(`${API_URL}/${warehouseId}`);
    return res.data;
  } catch (error) {
    throw new Error('Failed to fetch product stock');
  }
};

export const getProductStock = async () => {
  try {
    const res = await axios.get(`${API_URL}`);
    return res.data;
  } catch (error) {
    throw new Error('Failed to fetch product stocks');
  }
};

export const createStock = async (
  productId: number,
  warehouseId: number,
  stock: number,
) => {
  try {
    const res = await axios.post(`${API_URL}`, {
      productId,
      warehouseId,
      stock,
    });
  } catch (error) {
    console.error('Error creating stock :', error);
    throw error;
  }
};

export const deleteProductStock = async (
  stockId: number,
  warehouseId: number,
  productId: number,
  stock: number,
) => {
  try {
    await axios.delete(`${API_URL}/${stockId}`, {
      params: {
        warehouseId,
        productId,
        stock,
      },
    });
  } catch (error) {
    throw new Error('Failed to delete product stock');
  }
};
