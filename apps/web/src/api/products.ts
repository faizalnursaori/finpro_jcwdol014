import axios from 'axios';
import { Product } from '../types/product';

const baseUrl = 'http://localhost:8000/api/products';

export const getProducts = async (warehouseId?: number) => {
  const response = await axios.get<Product[]>(baseUrl, {
    params: {
      warehouseId,
    },
  });
  return response.data;
};
