import { CartModel } from '../models/cart.model';
import { calculateCartTotal, validateCartItem } from '@/utils/cart.utils';

export const createNewCart = async (userId: number) => {
  return CartModel.create(userId);
};

export const fetchCart = async (cartId: number) => {
  return CartModel.findById(cartId);
};

export const addItem = async (
  cartId: number,
  productId: number,
  quantity: number,
) => {
  const isValidItem = await validateCartItem(productId, quantity);
  if (!isValidItem) {
    throw new Error('Invalid product or insufficient stock');
  }

  const newCartItem = await CartModel.addItem(cartId, productId, quantity);
  const updatedCartTotal = await calculateCartTotal(cartId);

  return { cartItem: newCartItem, cartTotal: updatedCartTotal };
};

export const updateItem = async (itemId: number, newQuantity: number) => {
  const updatedCartItem = await CartModel.updateItem(itemId, newQuantity);
  const updatedCartTotal = await calculateCartTotal(updatedCartItem.cartId);

  return { updatedItem: updatedCartItem, cartTotal: updatedCartTotal };
};

export const removeItem = async (itemId: number) => {
  const removedCartItem = await CartModel.removeItem(itemId);
  const updatedCartTotal = await calculateCartTotal(removedCartItem.cartId);

  return { cartTotal: updatedCartTotal };
};
