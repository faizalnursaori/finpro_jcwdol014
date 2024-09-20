import prisma from '@/prisma';

export const checkStockAvailability = async (cartItems: any[]) => {
  for (const item of cartItems) {
    const totalStock = await prisma.productStock.aggregate({
      _sum: {
        stock: true,
      },
      where: {
        productId: item.productId,
        deleted: false,
      },
    });

    if ((totalStock._sum.stock || 0) < item.quantity) {
      return false;
    }
  }

  return true;
};
