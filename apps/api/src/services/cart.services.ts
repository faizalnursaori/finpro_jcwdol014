import { CartModel } from '../models/cart.model';
import { calculateCartTotal, validateCartItem } from '@/utils/cart.utils';

export const createNewCart = async (userId: number) => {
  if (!userId || typeof userId !== 'number') {
    throw new Error('Invalid userId');
  }
  try {
    return await CartModel.create(userId);
  } catch (error) {
    console.error('Error in createNewCart service:', error);
    throw error;
  }
};

export const getOrCreateCart = async (userId: number) => {
  try {
    let cart = await CartModel.findActiveByUserId(userId);

    if (!cart) {
      cart = await CartModel.create(userId);
    }

    return cart;
  } catch (error) {
    console.error('Error in getOrCreateCart service:', error);
    throw error;
  }
};

export const deactivateCart = async (cartId: number) => {
  try {
    const cart = await CartModel.findById(cartId);
    if (!cart) {
      throw new Error('Cart not found');
    }
    if (!cart.isActive) {
      throw new Error('Cart is already inactive');
    }
    await CartModel.deactivate(cartId);
  } catch (error) {
    console.error('Error in deactivateCart service:', error);
    throw error;
  }
};

export const fetchCart = async (cartId: number) => {
  try {
    return await CartModel.findById(cartId);
  } catch (error) {
    throw new Error('Failed to fetch cart');
  }
};

export const fetchAllCarts = async () => {
  try {
    return await CartModel.findAll();
  } catch (error) {
    throw new Error('Failed to fetch all carts');
  }
};

export const addItem = async (
  cartId: number,
  productId: number,
  quantity: number,
) => {
  try {
    const isValidItem = await validateCartItem(productId, quantity);
    if (!isValidItem) {
      throw new Error('Invalid product or insufficient stock');
    }

    const newCartItem = await CartModel.addItem(cartId, productId, quantity);
    const updatedCartTotal = await calculateCartTotal(cartId);

    return { cartItem: newCartItem, cartTotal: updatedCartTotal };
  } catch (error) {
    throw new Error('Failed to add item to cart');
  }
};

export const updateItem = async (itemId: number, newQuantity: number) => {
  try {
    // You might want to add validation here similar to addItem
    const updatedCartItem = await CartModel.updateItem(itemId, newQuantity);
    const updatedCartTotal = await calculateCartTotal(updatedCartItem.cartId);

    return { updatedItem: updatedCartItem, cartTotal: updatedCartTotal };
  } catch (error) {
    throw new Error('Failed to update cart item');
  }
};

export const removeItem = async (itemId: number) => {
  try {
    const removedCartItem = await CartModel.removeItem(itemId);
    const updatedCartTotal = await calculateCartTotal(removedCartItem.cartId);

    return { cartTotal: updatedCartTotal };
  } catch (error) {
    throw new Error('Failed to remove cart item');
  }
};
