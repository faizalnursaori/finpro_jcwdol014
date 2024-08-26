import prisma from '@/prisma';
import { calculateCartTotal, validateCartItem } from '@/utils/cart.utils';

export const createNewCart = async (userId: number) => {
  return prisma.cart.create({
    data: { userId },
    include: { items: true },
  });
};

export const fetchCart = async (cartId: number) => {
  return prisma.cart.findUnique({
    where: { id: cartId },
    include: { items: { include: { product: true } } },
  });
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

  const newCartItem = await prisma.cartItem.create({
    data: {
      quantity,
      productId,
      cartId,
    },
    include: { product: true },
  });

  const updatedCartTotal = await calculateCartTotal(cartId);

  return { cartItem: newCartItem, cartTotal: updatedCartTotal };
};

export const updateItem = async (itemId: number, newQuantity: number) => {
  const updatedCartItem = await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity: newQuantity },
    include: { product: true, cart: true },
  });

  const updatedCartTotal = await calculateCartTotal(updatedCartItem.cartId);

  return { updatedItem: updatedCartItem, cartTotal: updatedCartTotal };
};

export const removeItem = async (itemId: number) => {
  const removedCartItem = await prisma.cartItem.delete({
    where: { id: itemId },
    include: { cart: true },
  });

  const updatedCartTotal = await calculateCartTotal(removedCartItem.cartId);

  return { cartTotal: updatedCartTotal };
};
