import { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Cart } from '@/types/cart';
import axios from 'axios';

export const useCartOperations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createNewCart = async (): Promise<Cart> => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      // Set the token in the Authorization header
      const response = await axiosInstance.post<{ cart: Cart }>(
        '/carts',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      localStorage.setItem('cartId', response.data.cart.id.toString());
      return response.data.cart;
    } catch (err) {
      setError('Failed to create new cart');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCartData = async (): Promise<Cart> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get<{ cart: Cart }>('/carts');
      localStorage.setItem('cartId', response.data.cart.id.toString());
      return response.data.cart;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        const invalidateResponse = await axiosInstance.post<{ cart: Cart }>(
          '/carts/invalidate',
          {
            cartId: localStorage.getItem('cartId'),
          },
        );
        localStorage.setItem(
          'cartId',
          invalidateResponse.data.cart.id.toString(),
        );
        return invalidateResponse.data.cart;
      }
      setError('Failed to fetch cart');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItem = async (
    cartId: number,
    itemId: number,
    newQuantity: number,
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await axiosInstance.put(`/carts/${cartId}/items/${itemId}`, {
        quantity: newQuantity,
      });
    } catch (err) {
      setError('Failed to update item');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeCartItem = async (
    cartId: number,
    itemId: number,
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/carts/${cartId}/items/${itemId}`);
    } catch (err) {
      setError('Failed to remove item');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addItemToCart = async (
    cartId: number,
    productId: number,
    quantity: number,
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await axiosInstance.post(`/carts/${cartId}/items`, {
        productId,
        quantity,
      });
    } catch (err) {
      console.log('error server', err);
      setError('Failed to add item to cart');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createNewCart,
    fetchCartData,
    updateCartItem,
    removeCartItem,
    addItemToCart,
    isLoading,
    error,
  };
};
