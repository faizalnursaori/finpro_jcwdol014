import { Request, Response } from 'express';
import prisma from '@/prisma';

export const getWarehouses = async (req: Request, res: Response) => {
  try {
    const warehouses = await prisma.warehouse.findMany();
    res
      .status(200)
      .json({ message: 'Success Getting All Warehouses.', warehouses });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const getWarehouseByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const warehouse = await prisma.warehouse.findUnique({
      where: {
        userId: parseInt(userId),
      },
    });
    res.status(200).json(warehouse);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching warehouse data' });
  }
};
