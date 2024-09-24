'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import axios from 'axios';
import { useCart } from './CartContext';
import { Order } from '@/types/order';
import Cookies from 'js-cookie';

// interface Order {
//   id: number;
//   // Add other order properties here
// }

interface OrderContextType {
  currentOrder: Order | null;
  setCurrentOrder: (order: Order | null) => void;
  checkout: (data: any) => Promise<{ orderId: number }>;
  cancelOrder: (orderId: number, source: string) => Promise<void>;
  uploadProof: (orderId: number, file: File) => Promise<void>;
  checkStock: (data: any) => Promise<void>;
  fetchOrder: (orderId: number) => Promise<void>;
  confirmOrderReceived: (orderId: number) => Promise<void>;
  confirmOrderPayment: (orderId: number) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const baseApi =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  const { setCart } = useCart();

  // useEffect(() => {}, []);

  const getHeaders = () => ({
    Authorization: `Bearer ${Cookies.get('token')}`,
  });

  const checkout = async (data: any) => {
    try {
      let response;
      if (data.id) {
        // If the order already exists, update it
        response = await axios.put(`${baseApi}/orders/${data.id}`, data, {
          headers: getHeaders(),
        });
      } else {
        // If it's a new order, create it
        response = await axios.post(`${baseApi}/orders/checkout`, data, {
          headers: getHeaders(),
        });
      }
      setCurrentOrder(response.data);

      // Reset the cart after successful checkout
      setCart(null);

      return { orderId: response.data.id };
    } catch (error) {
      console.error('Checkout failed', error);
      throw error;
    }
  };

  const confirmOrderPayment = async (orderId: number) => {
    try {
      const response = await axios.post(
        `${baseApi}/orders/confirm-payment`,
        { orderId },
        { headers: getHeaders() },
      );
      setCurrentOrder(response.data);
    } catch (error) {
      console.error('Order payment confirmation failed', error);
      throw error;
    }
  };

  const confirmOrderReceived = async (orderId: number) => {
    try {
      const response = await axios.post(
        `${baseApi}/orders/confirm-receipt`,
        { orderId },
        { headers: getHeaders() },
      );
      setCurrentOrder(response.data);
    } catch (error) {
      console.error('Order received confirmation failed', error);
      throw error;
    }
  };

  const cancelOrder = async (orderId: number, source: string) => {
    try {
      const response = await axios.post(
        `${baseApi}/orders/cancel`,
        { orderId, source },
        { headers: getHeaders() },
      );
      setCurrentOrder(null);
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
        `${baseApi}/orders/payment-proof`,
        formData,
        {
          headers: {
            ...getHeaders(),
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      await fetchOrder(orderId);
    } catch (error) {
      console.error('Proof upload failed', error);
      throw error;
    }
  };

  const checkStock = async (data: any) => {
    try {
      const response = await axios.post(`${baseApi}/orders/check-stock`, data);
      return response.data;
    } catch (error) {
      console.error('Stock check failed', error);
      throw error;
    }
  };

  const fetchOrder = async (orderId: number) => {
    try {
      const response = await axios.get(`${baseApi}/orders/${orderId}`, {
        headers: getHeaders(),
      });
      setCurrentOrder(response.data);
    } catch (error) {
      console.error('Failed to fetch order', error);
      throw error;
    }
  };

  return (
    <OrderContext.Provider
      value={{
        currentOrder,
        setCurrentOrder,
        checkout,
        cancelOrder,
        uploadProof,
        checkStock,
        fetchOrder,
        confirmOrderReceived,
        confirmOrderPayment,
      }}
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
