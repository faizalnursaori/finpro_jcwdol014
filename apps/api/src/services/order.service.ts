import prisma from '@/prisma';
import { CheckoutBody } from '@/types/order.type';
import { findNearestWarehouse } from './warehouse.service';
import { createNewCart } from './cart.services';
import {
  PaymentStatus,
  CancellationSource,
  TransactionType,
  TransferStatus,
  Role,
} from '@prisma/client';
import { calculateDistance } from '@/utils/distance.utils';
import {
  validateCheckoutBody,
  validateFile,
  validateOrderId,
  validateWarehouseId,
} from '../validations/order.validation';

export const updateStatusOrderResolver = async (
  orderId: string, // Ubah tipe data menjadi string
  status: PaymentStatus,
) => {
  const validatedOrderId = validateOrderId.parse(parseInt(orderId, 10));
  const shippedAtLimit = new Date(Date.now() + 2 * 60 * 1000);
  const order = await prisma.order.findFirst({
    where: {
      id: validatedOrderId,
    },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  return await prisma.order.update({
    where: {
      id: validatedOrderId,
    },
    data: {
      paymentStatus: status,
    },
  });
};

export const getOrderListByRole = async (
  userId: number,
  role: Role,
  warehouseId?: number,
  page = 1,
  limit = 10,
  sortBy = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc',
  startDate?: string,
  endDate?: string,
  orderNumber?: string,
) => {
  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const filters: any = {};

  // Date range filter
  if (startDate && endDate) {
    filters.createdAt = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }

  // Order number filter
  if (orderNumber) {
    filters.id = parseInt(orderNumber, 10);
  }

  if (role === Role.SUPER_ADMIN) {
    // Super Admin can see all orders and filter by warehouse
    if (warehouseId) {
      filters.warehouseId = warehouseId;
    }
  } else if (role === Role.ADMIN) {
    // Admin can only see orders for their assigned warehouse
    const admin = await prisma.user.findUnique({
      where: { id: userId },
      include: { warehouse: true },
    });
    if (!admin || !admin.warehouse) {
      throw new Error('Admin is not assigned to a warehouse');
    }
    filters.warehouseId = admin.warehouse.id;
  } else if (role === Role.USER) {
    // Regular users can only see their own orders
    filters.cart = { userId: userId };
  } else {
    throw new Error('Invalid role');
  }

  const validSortFields = ['createdAt', 'total', 'paymentStatus'];
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';

  const totalCount = await prisma.order.count({
    where: filters,
  });

  const orders = await prisma.order.findMany({
    where: filters,
    include: {
      items: {
        include: {
          product: true,
        },
      },
      warehouse: true,
      cart: true,
      address: true,
      voucher: true,
    },
    orderBy: {
      [sortField]: sortOrder,
    },
    skip: (pageNumber - 1) * limitNumber,
    take: limitNumber,
  });

  const warehouses =
    role === Role.SUPER_ADMIN
      ? await prisma.warehouse.findMany({ select: { id: true, name: true } })
      : [];

  return {
    orders,
    warehouses,
    pagination: {
      currentPage: pageNumber,
      totalPages: Math.ceil(totalCount / limitNumber),
      totalItems: totalCount,
      itemsPerPage: limitNumber,
    },
  };
};

export const getOrderDetailById = async (userId: number, orderId: number) => {
  return await prisma.order.findFirst({
    where: {
      id: orderId,
      cart: {
        userId: userId,
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      warehouse: true,
      cart: true,
      address: true,
      voucher: true,
    },
  });
};

export const handleCheckout = async (id: number, body: CheckoutBody) => {
  const {
    name,
    paymentStatus,
    shippingCost,
    total,
    paymentMethod,
    warehouseId,
    cartId,
    addressId,
    orderItems,
    latitude,
    longitude,
    voucherId,
    userId,
  } = body;

  const expirePayment = new Date(Date.now() + 2 * 60 * 1000); // in 2 minutes

  const warehouse = await findNearestWarehouse({ latitude, longitude });
  if (!warehouse) {
    throw new Error('No warehouse found');
  }

  return prisma.$transaction(async (tx) => {
    const cart = await tx.cart.findUnique({
      where: { id: cartId },
    });

    if (!cart || !cart.isActive) {
      throw new Error('Invalid or inactive cart');
    }

    const order = await tx.order.create({
      data: {
        name,
        paymentStatus,
        shippingCost,
        total,
        paymentMethod,
        expirePayment,
        warehouseId,
        addressId,
        voucherId,
        cartId, // Include cartId here
        items: {
          create: orderItems.map((item) => ({
            quantity: item.quantity,
            price: item.price,
            total: item.total,
            productId: item.productId,
          })),
        },
      },
    });

    // Soft delete the old cart
    await tx.cart.update({
      where: { id: cartId },
      data: { isActive: false, deletedAt: new Date() },
    });

    // await tx.orderItem.createMany({
    //   data: orderItems.map((item) => ({
    //     quantity: item.quantity,
    //     price: item.price,
    //     total: item.total,
    //     orderId: order.id,
    //     productId: item.productId,
    //   })),
    // });

    for (const item of orderItems) {
      await tx.productStock.updateMany({
        where: {
          productId: item.productId,
          warehouseId,
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });

      const productInfo = await tx.product.findUnique({
        where: {
          id: item.productId,
        },
        select: { name: true },
      });

      const productStock = await tx.productStock.findFirst({
        where: {
          productId: item.productId,
          warehouseId,
        },
      });

      if (productStock) {
        await tx.stockTransferLog.create({
          data: {
            quantity: item.quantity,
            transactionType: 'OUT',
            description: `Stock OUT ${productInfo?.name} from warehouse for ORDER, qty: ${item.quantity}`,
            productStockId: productStock.id,
            warehouseId,
          },
        });
      }
    }

    await tx.transactionHistory.create({
      data: {
        userId: id,
        orderId: order.id,
        amount: total,
        type: 'PURCHASE',
      },
    });

    return order;
  });
};

export const cancelExpiredOrders = async () => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  return await prisma.$transaction(async (tx) => {
    const expiredOrders = await tx.order.findMany({
      where: {
        paymentStatus: PaymentStatus.PENDING,
        paymentProof: null,
        createdAt: {
          lt: oneHourAgo,
        },
      },
      include: {
        cart: {
          include: {
            user: true,
          },
        },
        items: true,
      },
    });

    const cancelOrderPromises = expiredOrders.map(async (order) => {
      try {
        // Update order status to CANCELED
        await tx.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: PaymentStatus.CANCELED,
            cancellationSource: CancellationSource.SYSTEM,
          },
        });

        // Return stock to warehouse and create stock transfer logs
        const updateStockPromises = order.items.map(async (item) => {
          const productStock = await tx.productStock.update({
            where: {
              productId_warehouseId: {
                productId: item.productId,
                warehouseId: order.warehouseId,
              },
            },
            data: {
              stock: { increment: item.quantity },
            },
          });

          const productInfo = await tx.product.findUnique({
            where: { id: item.productId },
            select: { name: true },
          });

          return tx.stockTransferLog.create({
            data: {
              quantity: item.quantity,
              transactionType: TransactionType.IN,
              description: `Stock IN ${productInfo?.name} to ${order.warehouseId} warehouse for CANCELED ORDER, qty: ${item.quantity}`,
              productStockId: productStock.id,
              warehouseId: order.warehouseId,
            },
          });
        });

        // Wait for all stock updates to complete
        await Promise.all(updateStockPromises);

        // Create transaction history entry for refund
        await tx.transactionHistory.create({
          data: {
            userId: order.cart.user.id,
            orderId: order.id,
            amount: order.total,
            type: TransactionType.REFUND,
          },
        });

        // Create a new cart for the user (same as in cancelOrder)
        await createNewCart(order.cart.user.id);

        return true;
      } catch (error) {
        console.error(`Failed to cancel order ${order.id}:`, error);
        return false;
      }
    });

    const results = await Promise.all(cancelOrderPromises);
    const canceledCount = results.filter((result) => result).length;

    return canceledCount;
  });
};

export const confirmOrder = async (userId: number, orderId: number) => {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findFirst({
      where: {
        id: orderId,
        cart: {
          userId: userId,
        },
        paymentStatus: PaymentStatus.SHIPPED,
      },
    });

    if (!order) {
      throw new Error('Order not found or cannot be confirmed');
    }

    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: PaymentStatus.DELIVERED,
      },
    });

    return updatedOrder;
  });
};

export const confirmPayment = async (userId: number, orderId: number) => {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findFirst({
      where: {
        id: orderId,
        cart: {
          userId: userId,
        },
        paymentStatus: PaymentStatus.PENDING,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new Error('Order not found or cannot confirm payment');
    }

    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: PaymentStatus.PAID,
      },
    });

    // Create a transaction history entry
    await tx.transactionHistory.create({
      data: {
        userId: userId,
        orderId: orderId,
        amount: order.total,
        type: TransactionType.PURCHASE,
      },
    });

    return updatedOrder;
  });
};

export const cancelOrder = async (
  userId: number,
  orderId: number,
  source: CancellationSource,
) => {
  return await prisma.$transaction(async (tx) => {
    const updatedOrder = await tx.order.update({
      where: {
        id: orderId,
        paymentStatus: PaymentStatus.PENDING,
        paymentProof: null,
      },
      data: {
        paymentStatus: PaymentStatus.CANCELED,
        cancellationSource: source,
      },
      include: {
        items: true,
      },
    });

    if (!updatedOrder) {
      throw new Error('Order not found OR cannot be cancelled');
    }

    await createNewCart(userId);

    for (const item of updatedOrder.items) {
      const productStock = await tx.productStock.update({
        where: {
          productId_warehouseId: {
            productId: item.productId,
            warehouseId: updatedOrder.warehouseId,
          },
        },
        data: {
          stock: { increment: item.quantity },
        },
      });

      const productInfo = await tx.product.findUnique({
        where: { id: item.productId },
        select: { name: true },
      });

      await tx.stockTransferLog.create({
        data: {
          quantity: item.quantity,
          transactionType: TransactionType.IN,
          description: `Stock IN ${productInfo?.name} to warehouse ${updatedOrder.warehouseId} due to order cancellation, qty: ${item.quantity}`,
          productStockId: productStock.id,
          warehouseId: updatedOrder.warehouseId,
        },
      });
    }

    await tx.transactionHistory.create({
      data: {
        userId: userId,
        orderId: updatedOrder.id,
        amount: updatedOrder.total,
        type: TransactionType.REFUND,
      },
    });

    // // Create a new cart for the user
    // await createNewCart(userId);

    return updatedOrder;
  });
};

export const uploadPaymentProof = async (
  userId: number,
  orderId: string,
  file: Express.Multer.File,
) => {
  const validatedOrderId = validateOrderId.parse(parseInt(orderId, 10));
  const validatedFile = validateFile(file);
  const shippedAtLimit = new Date(Date.now() + 2 * 60 * 1000);
  const order = await prisma.order.findFirst({
    where: {
      id: validatedOrderId,
      cart: {
        userId: userId,
      },
    },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  return await prisma.order.update({
    where: {
      id: validatedOrderId,
    },
    data: {
      paymentProof: `/assets/payment/${validatedFile.filename}`,
      paymentStatus: PaymentStatus.PENDING,
      shippedAt: shippedAtLimit,
    },
  });
};

export const checkAndMutateStock = async (
  warehouseId: number,
  products: Array<{ productId: number; quantity: number }>,
  latitude: number,
  longitude: number,
) => {
  const validatedWarehouseId = validateWarehouseId.parse(warehouseId);

  return await prisma.$transaction(async (tx) => {
    for (const product of products) {
      let stockInWarehouse = await tx.productStock.findFirst({
        where: {
          productId: product.productId,
          warehouseId: validatedWarehouseId,
        },
        include: {
          product: true,
          warehouse: true,
        },
      });

      let remainingQuantity = product.quantity;
      const availableStock = stockInWarehouse ? stockInWarehouse.stock : 0;
      const deficitQuantity = remainingQuantity - availableStock;

      if (deficitQuantity > 0) {
        const warehousesWithStock = await tx.productStock.findMany({
          where: {
            productId: product.productId,
            stock: { gt: 0 },
            NOT: { warehouseId: warehouseId },
          },
          include: {
            product: true,
            warehouse: true,
          },
        });

        const sortedWarehouses = warehousesWithStock.sort((a, b) => {
          const distanceA = calculateDistance(
            latitude,
            longitude,
            a.warehouse.latitude!,
            a.warehouse.longitude!,
          );
          const distanceB = calculateDistance(
            latitude,
            longitude,
            b.warehouse.latitude!,
            b.warehouse.longitude!,
          );
          return distanceA - distanceB;
        });

        let currentDeficit = deficitQuantity;
        for (const warehouseWithStock of sortedWarehouses) {
          if (currentDeficit <= 0) break;

          const transferQuantity = Math.min(
            warehouseWithStock.stock,
            currentDeficit,
          );

          const stockTransfer = await tx.stockTransfer.create({
            data: {
              stockRequest: transferQuantity,
              stockProcess: transferQuantity,
              note: `Stock transfer for order fulfillment`,
              productId: product.productId,
              status: TransferStatus.COMPLETED,
            },
          });

          await tx.stockTransferLog.create({
            data: {
              quantity: transferQuantity,
              transactionType: TransactionType.OUT,
              description: `Stock OUT ${warehouseWithStock.product.name} from ${warehouseWithStock.warehouse.name} to ${stockInWarehouse?.warehouse.name}, qty: ${transferQuantity} for ORDER. (Automatic Transfer)`,
              productStockId: warehouseWithStock.id,
              warehouseId: warehouseWithStock.warehouseId,
            },
          });

          await tx.productStock.update({
            where: { id: warehouseWithStock.id },
            data: { stock: { decrement: transferQuantity } },
          });

          if (stockInWarehouse) {
            await tx.productStock.update({
              where: { id: stockInWarehouse.id },
              data: { stock: { increment: transferQuantity } },
            });
          } else {
            stockInWarehouse = await tx.productStock.create({
              data: {
                stock: transferQuantity,
                productId: product.productId,
                warehouseId: warehouseId,
              },
              include: {
                product: true,
                warehouse: true,
              },
            });
          }

          await tx.stockTransferLog.create({
            data: {
              quantity: transferQuantity,
              transactionType: TransactionType.IN,
              description: `Stock IN ${stockInWarehouse.product.name} to ${stockInWarehouse.warehouse.name} from ${warehouseWithStock.warehouse.name}, qty: ${transferQuantity} for ORDER. (Automatic Transfer)`,
              productStockId: stockInWarehouse.id,
              warehouseId: warehouseId,
            },
          });

          currentDeficit -= transferQuantity;
        }

        if (currentDeficit > 0) {
          throw new Error('Insufficient stock available in nearby warehouses');
        }
      }

      if (stockInWarehouse) {
        await tx.productStock.update({
          where: { id: stockInWarehouse.id },
          data: { stock: { decrement: remainingQuantity } },
        });
      }
    }
  });
};

export const autoReceiveOrders = async () => {
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  return await prisma.$transaction(async (tx) => {
    // Proses untuk Order Confirmation (2 hari)
    const ordersToAutoConfirm = await tx.order.findMany({
      where: {
        paymentStatus: PaymentStatus.SHIPPED,
        shippedAt: {
          lt: twoDaysAgo,
        },
      },
    });

    let autoConfirmedCount = 0;

    for (const order of ordersToAutoConfirm) {
      try {
        await tx.order.update({
          where: { id: order.id },
          data: { paymentStatus: PaymentStatus.DELIVERED },
        });
        autoConfirmedCount++;
      } catch (error) {
        console.error(`Failed to auto-confirm order ${order.id}:`, error);
      }
    }

    // Proses untuk Send User Orders (7 hari)
    const ordersToAutoComplete = await tx.order.findMany({
      where: {
        paymentStatus: PaymentStatus.SHIPPED,
        shippedAt: {
          lt: sevenDaysAgo,
        },
      },
    });

    let autoCompletedCount = 0;

    for (const order of ordersToAutoComplete) {
      try {
        await tx.order.update({
          where: { id: order.id },
          data: { paymentStatus: PaymentStatus.DELIVERED },
        });
        autoCompletedCount++;
      } catch (error) {
        console.error(`Failed to auto-complete order ${order.id}:`, error);
      }
    }

    return { autoConfirmedCount, autoCompletedCount };
  });
};
