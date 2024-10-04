import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const salesReport = async (req: Request, res: Response) => {
  const { month, warehouseId } = req.query;

  if (typeof month !== 'string' || typeof warehouseId !== 'string') {
    return res
      .status(400)
      .json({ error: 'Month and warehouseId must be strings.' });
  }

  try {
    const startDate = new Date(month);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: {
          warehouseId: parseInt(warehouseId),
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },
      },
      select: {
        price: true,
        quantity: true,
      },
    });

    const totalSales = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const totalQuantity = orderItems.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    res.json({ totalSales, totalQuantity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch sales data.' });
  }
};

export const topProducts = async (req: Request, res: Response) => {
  const { month, warehouseId } = req.query;

  if (typeof month !== 'string' || typeof warehouseId !== 'string') {
    return res
      .status(400)
      .json({ error: 'Month and warehouseId must be strings.' });
  }

  try {
    const startDate = new Date(month);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        total: true,
      },
      where: {
        order: {
          warehouseId: parseInt(warehouseId),
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },
      },
      orderBy: {
        _sum: {
          total: 'desc',
        },
      },
      take: 5,
    });

    const productDetails = await prisma.product.findMany({
      where: {
        id: { in: topProducts.map((item) => item.productId) },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const topProductsWithDetails = topProducts.map((item) => {
      const productDetail = productDetails.find(
        (product) => product.id === item.productId,
      );
      return {
        ...productDetail,
        totalSales: item._sum.total || 0,
      };
    });

    res.json({ topProducts: topProductsWithDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const topCategories = async (req: Request, res: Response) => {
  const { month, warehouseId } = req.query;

  if (typeof month !== 'string' || typeof warehouseId !== 'string') {
    return res
      .status(400)
      .json({ error: 'Month and warehouseId must be strings.' });
  }

  try {
    const startDate = new Date(month);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const topCategories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        products: {
          select: {
            orderItems: {
              where: {
                order: {
                  warehouseId: parseInt(warehouseId),
                },
                createdAt: {
                  gte: startDate,
                  lte: endDate,
                },
              },
              select: {
                total: true,
              },
            },
          },
        },
      },
    });

    const categorySales = topCategories.map((category) => {
      const totalSales = category.products.reduce((acc, product) => {
        const productSales = product.orderItems.reduce(
          (sum, orderItem) => sum + orderItem.total,
          0,
        );
        return acc + productSales;
      }, 0);
      return { id: category.id, name: category.name, totalSales };
    });

    const top3Categories = categorySales
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 3);

    res.json({ topCategories: top3Categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export async function getStockSummaryByMonth(
  warehouseId: number,
  month: number,
  year: number,
) {
  const startDate = new Date(`${year}-${month}-01`);
  const endDate = new Date(`${year}-${month + 1}-01`);

  const transferLogs = await prisma.stockTransferLog.findMany({
    where: {
      warehouseId,
      createdAt: {
        gte: startDate,
        lt: endDate,
      },
    },
    select: {
      quantity: true,
      transactionType: true,
      productStock: {
        select: {
          product: {
            select: {
              id: true,
              name: true,
            },
          },
          stock: true,
          deleted: true,
        },
      },
    },
  });

  const summary = transferLogs.reduce(
    (acc, log) => {
      const productId = log.productStock.product.id;
      const productName = log.productStock.product.name;
      const currentStock = log.productStock.deleted
        ? 0
        : log.productStock.stock;

      if (!acc[productId]) {
        acc[productId] = {
          productId,
          productName,
          totalIn: 0,
          totalOut: 0,
          finalStock: currentStock,
        };
      }

      if (log.transactionType === 'IN' || log.transactionType === 'REFUND') {
        acc[productId].totalIn += log.quantity;
      } else if (
        log.transactionType === 'OUT' ||
        log.transactionType === 'PURCHASE'
      ) {
        acc[productId].totalOut += log.quantity;
      }

      return acc;
    },
    {} as Record<
      number,
      {
        productId: number;
        productName: string;
        totalIn: number;
        totalOut: number;
        finalStock: number;
      }
    >,
  );

  return Object.values(summary);
}

export async function getStockDetailsByMonth(
  warehouseId: number,
  month: number,
  year: number,
) {
  const stockDetails = await prisma.stockTransferLog.findMany({
    where: {
      warehouseId: warehouseId,
      createdAt: {
        gte: new Date(`${year}-${month}-01`),
        lte: new Date(`${year}-${month + 1}-01`),
      },
    },
    select: {
      transactionType: true,
      quantity: true,
      description: true,
      createdAt: true,
      warehouse: true,
      productStock: {
        select: {
          product: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return stockDetails.map((log) => ({
    ...log,
    product: log.productStock?.product,
  }));
}
