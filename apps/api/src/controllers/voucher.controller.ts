import { Request, Response } from 'express';
import prisma from '@/prisma';

export const createVoucher = async (req: Request, res: Response) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minPurchase,
      maxDiscount,
      productId,
      isShippingVoucher,
      expiryDate,
    } = req.body;

    const newVoucher = await prisma.voucher.create({
      data: {
        code,
        discountType,
        discountValue,
        minPurchase,
        maxDiscount,
        productId: productId ? parseInt(productId, 10) : null,
        isShippingVoucher,
        expiryDate: new Date(expiryDate),
      },
    });

    res
      .status(201)
      .json({ message: 'Voucher created successfully', voucher: newVoucher });
  } catch (error) {
    res.status(500).json({ message: 'Error creating voucher', error });
  }
};

export const updateVoucher = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    code,
    discountType,
    discountValue,
    minPurchase,
    maxDiscount,
    productId,
    isShippingVoucher,
    expiryDate,
  } = req.body;

  try {
    const updatedVoucher = await prisma.voucher.update({
      where: { id: parseInt(id) },
      data: {
        code,
        discountType,
        discountValue,
        minPurchase,
        maxDiscount,
        productId,
        isShippingVoucher,
        expiryDate: new Date(expiryDate),
      },
    });

    res.status(200).json({
      message: 'Voucher updated successfully',
      voucher: updatedVoucher,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating voucher', error });
  }
};

export const deleteVoucher = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.voucher.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: 'Voucher deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting voucher', error });
  }
};

export const getAllVouchers = async (req: Request, res: Response) => {
  try {
    const vouchers = await prisma.voucher.findMany({
      include: { product: true },
    });
    res.status(200).json(vouchers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vouchers', error });
  }
};

export const applyVoucher = async (req: Request, res: Response) => {
  try {
    const { voucherCode, cartId } = req.body;

    const voucher = await prisma.voucher.findUnique({
      where: { code: voucherCode },
    });

    if (!voucher) {
      return res.status(404).json({ message: 'Voucher not found' });
    }

    const currentDate = new Date();
    if (voucher.expiryDate < currentDate) {
      return res.status(400).json({ message: 'Voucher has expired' });
    }

    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: true },
    });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    let cartTotal = 0;
    for (const item of cart.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return res
          .status(404)
          .json({ message: `Product with ID ${item.productId} not found` });
      }

      cartTotal += product.price * item.quantity;
    }

    if (voucher.minPurchase && cartTotal < voucher.minPurchase) {
      return res.status(400).json({
        message: `Minimum purchase of ${voucher.minPurchase} is required to apply this voucher`,
      });
    }

    if (voucher.productId) {
      const hasEligibleProduct = cart.items.some(
        (item) => item.productId === voucher.productId,
      );
      if (!hasEligibleProduct) {
        return res.status(400).json({
          message: 'Voucher is not applicable to any products in the cart',
        });
      }
    }

    let discount = 0;
    if (voucher.discountType === 'PERCENTAGE') {
      discount = (voucher.discountValue / 100) * cartTotal;
      if (voucher.maxDiscount && discount > voucher.maxDiscount) {
        discount = voucher.maxDiscount;
      }
    } else if (voucher.discountType === 'FIXED') {
      discount = voucher.discountValue;
    }

    const finalTotal = cartTotal - discount;

    const userVoucher = await prisma.userVoucher.findFirst({
      where: { voucherId: voucher.id, userId: cart.userId },
    });

    if (userVoucher && !userVoucher.isUsed) {
      await prisma.userVoucher.update({
        where: { id: userVoucher.id },
        data: { isUsed: true },
      });
    }

    return res.status(200).json({
      message: 'Voucher applied successfully',
      discount,
      finalTotal,
    });
  } catch (error) {
    console.error('Error applying voucher:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
