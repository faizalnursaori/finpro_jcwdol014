import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProductStock = async (req: Request, res: Response) => {
  try {
    console.log('Fetching all products with stock information...');
    const products = await prisma.product.findMany({
      include: {
        category: true,
        productImages: true,
        productStocks: {
          where: {
            deleted: false,
          },
          include: {
            warehouse: true,
          },
        },
      },
    });
    console.log('Products fetched:', products.length);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error fetching products' });
  }
};

export const getProductStockByWarehouseId = async (
  req: Request,
  res: Response,
) => {
  const { warehouseId } = req.params;

  try {
    const productStock = await prisma.productStock.findMany({
      where: { warehouseId: Number(warehouseId), deleted: false },
      include: {
        product: true,
      },
    });
    res
      .status(200)
      .json({ message: 'Success Getting All Product Stock.', productStock });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const updateProductStock = async (req: Request, res: Response) => {
  const { productId, warehouseId, newStock } = req.body;

  try {
    const existingStock = await prisma.productStock.findUnique({
      where: {
        productId_warehouseId: {
          productId: productId,
          warehouseId: warehouseId,
        },
      },
    });

    if (!existingStock) {
      return res
        .status(404)
        .json({ error: 'Product stock not found for the specified warehouse' });
    }

    const updatedStock = await prisma.productStock.update({
      where: {
        productId_warehouseId: {
          productId: productId,
          warehouseId: warehouseId,
        },
      },
      data: {
        stock: newStock,
      },
    });

    res
      .status(200)
      .json({ message: 'Stock updated successfully', updatedStock });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createStock = async (req: Request, res: Response) => {
  const { productId, warehouseId, stock } = req.body;

  try {
    const existingStock = await prisma.productStock.findFirst({
      where: {
        productId,
        warehouseId,
      },
    });

    if (existingStock) {
      if (existingStock.deleted) {
        // If the stock is deleted, restore it and update the stock
        const updatedStock = await prisma.productStock.update({
          where: { id: existingStock.id },
          data: {
            stock: Number(stock), // Restore the stock with the new value
            deleted: false,
          },
        });

        await prisma.stockTransferLog.create({
          data: {
            quantity: Number(stock),
            transactionType: 'IN',
            description: `Restored and added ${stock} units to warehouse ID ${warehouseId}`,
            productStockId: updatedStock.id,
            warehouseId: Number(warehouseId),
          },
        });

        return res
          .status(200)
          .json({ message: 'Stock restored successfully.', updatedStock });
      } else {
        // If the stock is not deleted, add the new stock to the existing stock
        const updatedStock = await prisma.productStock.update({
          where: { id: existingStock.id },
          data: {
            stock: {
              increment: Number(stock),
            },
          },
        });

        await prisma.stockTransferLog.create({
          data: {
            quantity: Number(stock),
            transactionType: 'IN',
            description: `Added ${stock} units to existing stock in warehouse ID ${warehouseId}`,
            productStockId: updatedStock.id,
            warehouseId: Number(warehouseId),
          },
        });

        return res
          .status(200)
          .json({ message: 'Stock updated successfully.', updatedStock });
      }
    }

    // If no stock exists, create a new entry
    const newStock = await prisma.productStock.create({
      data: {
        productId,
        warehouseId,
        stock: Number(stock),
      },
    });

    await prisma.stockTransferLog.create({
      data: {
        quantity: Number(stock),
        transactionType: 'IN',
        description: `New stock of ${stock} units added to warehouse ID ${warehouseId}`,
        productStockId: newStock.id,
        warehouseId: Number(warehouseId),
      },
    });

    res.status(201).json({ message: 'Stock created successfully.', newStock });
  } catch (error) {
    console.error('Failed to create or update stock:', error);
    res.status(500).json({ error: 'Failed to create or update stock.' });
  }
};

export const deleteProductStock = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { warehouseId, productId, stock } = req.query;
  try {
    await prisma.productStock.update({
      where: { id: parseInt(id) },
      data: {
        deleted: true,
      },
    });

    await prisma.stockTransferLog.create({
      data: {
        quantity: Number(stock),
        transactionType: 'OUT',
        description: `Deleted stock of ${stock} units from warehouse ID ${warehouseId}`,
        productStockId: parseInt(id),
        warehouseId: Number(warehouseId),
      },
    });

    return res
      .status(200)
      .json({ message: 'Product stock deleted successfully.' });
  } catch (error) {
    console.error('Error deleting product stock:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
