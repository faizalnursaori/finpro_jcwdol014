import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const getStockTransfer = async (req: Request, res: Response) => {
  try {
    const stockTransfers = await prisma.stockTransfer.findMany({
      include: {
        product: true,
        sourceWarehouse: true,
        destinationWarehouse: true,
      },
    });
    res.status(200).json(stockTransfers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stock transfers' });
  }
};

export const getStockTransferByDestinationWarehouseId = async (
  req: Request,
  res: Response,
) => {
  const { warehouseId } = req.params;
  try {
    const stockTransfers = await prisma.stockTransfer.findMany({
      where: { destinationWarehouseId: Number(warehouseId) },
      include: {
        product: true,
        sourceWarehouse: true,
        destinationWarehouse: true,
      },
    });
    res.status(200).json(stockTransfers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stock transfers' });
  }
};

export const createStockTransfer = async (req: Request, res: Response) => {
  const { stockRequest, note, productId, destinationWarehouseId } = req.body;

  try {
    const newStockTransfer = await prisma.stockTransfer.create({
      data: {
        stockRequest,
        destinationWarehouseId,
        stockProcess: 0,
        note,
        productId,
        status: 'PENDING',
      },
    });
    res.status(201).json(newStockTransfer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create stock transfer.' });
  }
};

export const approveStockTransfer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { destinationWarehouseId, stockProcess, sourceWarehouseId } = req.body;

  try {
    const stockTransfer = await prisma.stockTransfer.findUnique({
      where: { id: Number(id) },
      include: {
        product: true,
        destinationWarehouse: true,
        sourceWarehouse: true,
      },
    });

    if (!stockTransfer) {
      return res.status(404).json({ error: 'Stock transfer not found' });
    }

    if (stockTransfer.status !== 'PENDING') {
      return res
        .status(400)
        .json({ error: 'Only pending transfers can be approved' });
    }

    const updatedStockTransfer = await prisma.stockTransfer.update({
      where: { id: Number(id) },
      data: {
        stockProcess: Number(stockProcess),
        sourceWarehouseId: Number(sourceWarehouseId),
        status: 'COMPLETED',
        updatedAt: new Date(),
      },
    });

    await prisma.productStock.upsert({
      where: {
        productId_warehouseId: {
          productId: stockTransfer.productId,
          warehouseId: Number(destinationWarehouseId),
        },
      },
      update: {
        stock: {
          increment: Number(stockProcess),
        },
      },
      create: {
        productId: stockTransfer.productId,
        warehouseId: Number(destinationWarehouseId),
        stock: Number(stockProcess),
      },
    });

    await prisma.productStock.update({
      where: {
        productId_warehouseId: {
          productId: stockTransfer.productId,
          warehouseId: Number(sourceWarehouseId),
        },
      },
      data: {
        stock: {
          decrement: Number(stockProcess),
        },
      },
    });

    await prisma.stockTransferLog.create({
      data: {
        quantity: Number(stockProcess),
        transactionType: 'IN',
        description: `Approved transfer of ${stockProcess} units from warehouse ID ${sourceWarehouseId} to warehouse ID ${destinationWarehouseId}`,
        productStockId: stockTransfer.productId,
        warehouseId: Number(destinationWarehouseId),
      },
    });

    return res.status(200).json(updatedStockTransfer);
  } catch (error) {
    console.error('Error approving stock transfer:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const rejectStockTransfer = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const transfer = await prisma.stockTransfer.update({
      where: { id: Number(id) },
      data: { status: 'CANCELLED' },
    });
    res.status(200).json(transfer);
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting the transfer' });
  }
};
