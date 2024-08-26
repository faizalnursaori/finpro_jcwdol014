import prisma from '@/prisma';

export const calculateCartTotal = async (cartId: number): Promise<number> => {
  const cartItems = await prisma.cartItem.findMany({
    where: { cartId },
    include: { product: true },
  });

  return cartItems.reduce((total, item) => {
    return total + item.quantity * item.product.price;
  }, 0);
};

export const validateCartItem = async (
  productId: number,
  quantity: number,
): Promise<boolean> => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { productStocks: true },
  });

  if (!product) {
    return false;
  }

  const totalStock = product.productStocks.reduce(
    (sum, stock) => sum + stock.stock,
    0,
  );
  return quantity <= totalStock;
};
