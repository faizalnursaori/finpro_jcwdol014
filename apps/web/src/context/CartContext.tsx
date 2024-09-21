'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';
import { Cart } from '@/types/cart';
import { useCartOperations } from '../hooks/useCartOperations';

interface CartContextType {
  cart: Cart | null;
  cartItemCount: number;
  fetchCart: () => Promise<void>;
  updateItemQuantity: (itemId: number, newQuantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  addToCart: (
    productId: number,
    quantity: number,
    availableStock: number,
  ) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const {
    createNewCart,
    fetchCartData,
    updateCartItem,
    removeCartItem,
    addItemToCart,
  } = useCartOperations();

  const calculateCartItemCount = useCallback(
    (currentCart: Cart | null): number => {
      return (
        currentCart?.items?.reduce((total, item) => total + item.quantity, 0) ||
        0
      );
    },
    [],
  );

  const [cartItemCount, setCartItemCount] = useState<number>(0);

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    const newCartItemCount = calculateCartItemCount(cart);
    setCartItemCount(newCartItemCount);
    console.log('Cart updated:', cart);
    console.log('Cart item count in context:', newCartItemCount);
  }, [cart, calculateCartItemCount]);

  const fetchCart = async () => {
    try {
      const fetchedCart = await fetchCartData();
      setCart(fetchedCart);
    } catch (err) {
      console.error('Failed to load cart:', err);
    }
  };

  const updateItemQuantity = async (itemId: number, newQuantity: number) => {
    if (!cart) {
      console.error('Cart is not loaded');
      return;
    }

    try {
      await updateCartItem(cart.id, itemId, newQuantity);
      await fetchCart();
    } catch (err) {
      console.error('Failed to update item:', err);
    }
  };

  const removeItem = async (itemId: number) => {
    if (!cart) {
      console.error('Cart is not loaded');
      return;
    }

    try {
      await removeCartItem(cart.id, itemId);
      await fetchCart();
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  const addToCart = async (
    productId: number,
    quantity: number,
    availableStock: number,
  ) => {
    try {
      let currentCart = cart;
      if (!currentCart) {
        currentCart = await createNewCart();
        setCart(currentCart);
      }

      if (!currentCart || !currentCart.id) {
        throw new Error('Failed to create or retrieve cart');
      }

      const existingItem = currentCart.items.find(
        (item) => item.product.id === productId,
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > availableStock) {
          console.error('Not enough stock available');
          return;
        }
        await updateItemQuantity(existingItem.id, newQuantity);
      } else {
        if (quantity > availableStock) {
          console.error('Not enough stock available');
          return;
        }
        await addItemToCart(currentCart.id, productId, quantity);
      }

      await fetchCart();
    } catch (err) {
      console.error('Failed to add item to cart:', err);
      throw err;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItemCount,
        fetchCart,
        updateItemQuantity,
        removeItem,
        addToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
