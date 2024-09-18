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

export const getWarehouse = async (req: Request, res: Response) => {
    try {
        const {id} = req.params
        const warehouse = await prisma.warehouse.findUnique({
            where:{
                id: Number(id)
            }
        })
        res.status(200).json({message: 'Success getting the warehouse datas', warehouse})
    } catch (error) {
        res.status(500).json({message: 'Internal server error', error})
    }
};

export const createWarehouse = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const warehouse = await prisma.warehouse.create({
      data,
      include: {
        user: true,
        city: true,
        province: true,
      },
    });

    res
      .status(200)
      .json({ message: 'Success creating the warehouse.', warehouse });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.', error });
  }
};

export const updateWarehouse = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const { id } = req.params;

    const warehouse = await prisma.warehouse.update({
      where: {
        id: Number(id),
      },
      data,
    });

    res
      .status(200)
      .json({ message: 'Success updating the warehouse.', warehouse });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.', error });
  }
};

export const deleteWarehouse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const warehouse = await prisma.warehouse.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({ message: 'Success deleting the warehouse.' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.', error });
  }
};
