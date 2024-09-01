import prisma from '@/prisma';

export const CartModel = {
  create: async (userId: number) => {
    return prisma.cart.create({
      data: {
        userId,
        isActive: true,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  },

  findById: async (cartId: number) => {
    return prisma.cart.findUnique({
      where: {
        id: cartId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  },

  findActiveByUserId: async (userId: number) => {
    return prisma.cart.findFirst({
      where: {
        userId: userId,
        isActive: true,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  },

  deactivate: async (cartId: number) => {
    return prisma.cart.update({
      where: { id: cartId },
      data: { isActive: false },
    });
  },

  findAll: async () => {
    return prisma.cart.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  },

  addItem: async (cartId: number, productId: number, quantity: number) => {
    return prisma.cartItem.create({
      data: {
        quantity,
        productId,
        cartId,
      },
      include: { product: true },
    });
  },

  updateItem: async (itemId: number, quantity: number) => {
    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: { product: true, cart: true },
    });
  },

  removeItem: async (itemId: number) => {
    return prisma.cartItem.delete({
      where: { id: itemId },
      include: { cart: true },
    });
  },
};
