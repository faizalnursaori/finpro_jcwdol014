'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

interface CheckoutResponse {
  orderId: number;
  // Add other fields as needed from your API response
}

interface OrderContextType {
  checkout: (data: any) => Promise<{ orderId: number }>;
  cancelOrder: (orderId: number, source: string) => Promise<void>;
  uploadProof: (orderId: number, file: File) => Promise<void>;
  checkStock: (data: any) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const baseApi = 'http://localhost:8000/api';

  const checkout = async (data: any) => {
    try {
      const response = await axios.post(`${baseApi}/orders/checkout`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log('Checkout successful', response.data);
      return { orderId: response.data.id };
    } catch (error) {
      console.error('Checkout failed', error);
      throw error;
    }
  };

  const cancelOrder = async (orderId: number, source: string) => {
    try {
      const response = await axios.post(
        `${baseApi}/orders/cancel`,
        { orderId, source },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      );
      console.log('Order canceled', response.data);
    } catch (error) {
      console.error('Order cancellation failed', error);
      throw error;
    }
  };

  const uploadProof = async (orderId: number, file: File) => {
    const formData = new FormData();
    formData.append('orderId', orderId.toString());
    formData.append('file', file);

    try {
      const response = await axios.post(
        `${baseApi}/orders/upload-proof`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      console.log('Proof uploaded', response.data);
    } catch (error) {
      console.error('Proof upload failed', error);
      throw error;
    }
  };

  const checkStock = async (data: any) => {
    try {
      const response = await axios.post(`${baseApi}/orders/check-stock`, data);
      console.log('Stock checked', response.data);
    } catch (error) {
      console.error('Stock check failed', error);
      throw error;
    }
  };

  return (
    <OrderContext.Provider
      value={{ checkout, cancelOrder, uploadProof, checkStock }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
