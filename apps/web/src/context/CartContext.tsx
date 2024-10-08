'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { Cart } from '@/types/cart';
import { useCartOperations } from '../hooks/useCartOperations';
import { toast } from 'react-hot-toast';

interface CartContextType {
  cart: Cart | null;
  setCart: (cart: Cart | null) => void;
  fetchCart: () => Promise<void>;
  updateItemQuantity: (itemId: number, newQuantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  addToCart: (
    productId: number,
    quantity: number,
    availableStock: number,
  ) => Promise<void>;
  clearCart: () => void; // Tambahkan clearCart ke dalam context type
  cartItemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const {
    createNewCart,
    fetchCartData,
    updateCartItem,
    removeCartItem,
    addItemToCart,
  } = useCartOperations();

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    updateCartItemCount(cart);
  }, [cart]);

  const updateCartItemCount = (cart: Cart | null) => {
    if (cart) {
      const itemCount = cart.items.reduce(
        (total, item) => total + item.quantity,
        0,
      );
      setCartItemCount(itemCount);
    } else {
      setCartItemCount(0);
    }
  };

  const fetchCart = async () => {
    try {
      const fetchedCart = await fetchCartData();
      setCart(fetchedCart);
      updateCartItemCount(fetchedCart);
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
          toast.error('Not enough stock available');
          return;
        }
        await updateItemQuantity(existingItem.id, newQuantity);
      } else {
        if (quantity > availableStock) {
          toast.error('Not enough stock available');
          return;
        }
        await addItemToCart(currentCart.id, productId, quantity);
      }

      await fetchCart();
      toast.success('Item added to cart');
    } catch (err) {
      console.error('Failed to add item to cart:', err);
      toast.error('Failed to add item to cart');
      throw err;
    }
  };

  // Fungsi untuk mengosongkan cart
  const clearCart = () => {
    setCart(null);
    setCartItemCount(0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        fetchCart,
        updateItemQuantity,
        removeItem,
        addToCart,
        clearCart, // Pastikan clearCart ada di sini
        cartItemCount,
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
