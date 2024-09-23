'use server';

import axios from 'axios';

const API_URL = process.env.BASE_API_REPORTS;

export async function getStockSummaryByMonth(
  warehouseId: number,
  month: number,
  year: number,
) {
  const response = await axios.get(`${API_URL}/stock-summary`, {
    params: {
      warehouseId,
      month,
      year,
    },
  });

  return response.data;
}

interface StockLog {
  id: number;
  createdAt: string;
  warehouse: { name: string };
  quantity: number;
  transactionType: string;
}

export const fetchStockDetails = async (
  warehouseId: number,
  year: string,
  month: string,
): Promise<StockLog[]> => {
  try {
    const response = await axios.get(`${API_URL}/stock-details`, {
      params: { warehouseId, year, month },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching stock details:', error);
    throw error;
  }
};

export const fetchSalesData = async (month: string, warehouseId: string) => {
  try {
    const response = await axios.get(`${API_URL}`, {
      params: { month, warehouseId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching sales data:', error);
    throw error;
  }
};

export const fetchTopProducts = async (month: string, warehouseId: string) => {
  try {
    const response = await axios.get(`${API_URL}/products`, {
      params: { month, warehouseId },
    });
    return response.data.topProducts;
  } catch (error) {
    console.error('Error fetching top products:', error);
    throw error;
  }
};

export const fetchTopCategories = async (
  month: string,
  warehouseId: string,
) => {
  try {
    const response = await axios.get(`${API_URL}/categories`, {
      params: { month, warehouseId },
    });
    return response.data.topCategories;
  } catch (error) {
    console.error('Error fetching top categories:', error);
    throw error;
  }
};
