'use server';

import axios from 'axios';

const API_URL = process.env.BASE_API_LOGS;

export const createStockTransferLog = async (data: {
  fromStoreId: number;
  toStoreId: number;
  productId: number;
  quantity: number;
  note: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}`, data);
    return response.data;
  } catch (error) {
    console.error('Failed to create stock transfer log:', error);
    throw error;
  }
};
