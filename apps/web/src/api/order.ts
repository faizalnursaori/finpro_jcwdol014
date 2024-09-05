import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const checkout = async (userId: number, cartItems: any[]) => {
  const response = await axios.post(`${API_URL}/orders/checkout`, {
    userId,
    cartItems,
  });
  return response.data;
};

export const cancelOrder = async (
  userId: number,
  orderId: number,
  source: string,
) => {
  const response = await axios.post(`${API_URL}/orders/cancel`, {
    userId,
    orderId,
    source,
  });
  return response.data;
};

export const uploadPaymentProof = async (
  userId: number,
  orderId: number,
  file: File,
) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', userId.toString());
  formData.append('orderId', orderId.toString());

  const response = await axios.post(
    `${API_URL}/orders/upload-proof`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};

export const checkStock = async (
  warehouseId: number,
  products: any[],
  latitude: number,
  longitude: number,
) => {
  const response = await axios.post(`${API_URL}/orders/check-stock`, {
    warehouseId,
    products,
    latitude,
    longitude,
  });
  return response.data;
};
