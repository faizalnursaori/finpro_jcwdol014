import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const createStockTransferLog = async (req: Request, res: Response) => {
  try {
    const {
      quantity,
      transactionType,
      description,
      productStockId,
      warehouseId,
    } = req.body;

    const newLog = await prisma.stockTransferLog.create({
      data: {
        quantity,
        transactionType,
        description,
        productStockId,
        warehouseId,
      },
    });

    res.status(201).json(newLog);
  } catch (error) {
    res.status(500).json({ error: 'Error creating stock transfer log' });
  }
};
