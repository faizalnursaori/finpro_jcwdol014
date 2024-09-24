'use server';

import axios from 'axios';

const API_URL = process.env.BASE_API_STOCK_TRANSFER;
export const createStockRequest = async (
  productId: number,
  stockRequest: number,
  destinationWarehouseId: number,
  note: string,
) => {
  try {
    const res = await axios.post(`${API_URL}`, {
      productId,
      stockRequest,
      destinationWarehouseId,
      note,
    });
  } catch (error) {
    console.error('Error creating stock request:', error);
    throw error;
  }
};

export const updateStock = async (
  productId: number,
  warehouseId: number,
  newStock: number,
) => {
  try {
    const response = await axios.put(`${API_URL}/update-stock`, {
      productId,
      warehouseId,
      newStock,
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to update stock');
  }
};
