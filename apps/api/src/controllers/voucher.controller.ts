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
