import { Request, Response } from 'express';
import {
  handleCheckout,
  cancelExpiredOrders,
  cancelOrder,
  confirmOrder,
  confirmPayment,
  uploadPaymentProof,
  checkAndMutateStock,
  getOrderDetailById,
  autoReceiveOrders,
} from '../services/order.service';
import { CancellationSource } from '@prisma/client';
import { AuthenticatedRequest } from '@/middleware/auth.middleware';
import prisma from '@/prisma';

export const getOrderDetail = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.userId;
    if (!userId || typeof userId !== 'number') {
      return res.status(400).json({ error: 'Valid userId is required' });
    }
    const orderId = parseInt(req.params.id);
    if (isNaN(orderId)) {
      return res.status(400).json({ error: 'Valid orderId is required' });
    }

    const order = await getOrderDetailById(userId, orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res
      .status(500)
      .json({ success: false, message: 'Error fetching order details' });
  }
};

export const getOrderList = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.userId;
    if (!userId || typeof userId !== 'number') {
      return res.status(400).json({ error: 'Valid userId is required' });
    }

    const {
      startDate,
      endDate,
      orderNumber,
      page = '1',
      limit = '10',
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);

    const filters: any = {};

    if (startDate && endDate) {
      filters.createdAt = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    if (orderNumber) {
      filters.id = parseInt(orderNumber as string);
    }

    const validSortFields = ['createdAt', 'total', 'paymentStatus'];
    const sortField = validSortFields.includes(sortBy as string)
      ? sortBy
      : 'createdAt';
    const order = sortOrder === 'asc' ? 'asc' : 'desc';

    const totalCount = await prisma.order.count({
      where: {
        ...filters,
        cart: {
          userId: userId,
        },
      },
    });

    const orders = await prisma.order.findMany({
      where: {
        ...filters,
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
      orderBy: {
        [sortField as string]: order,
      },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    });

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCount / limitNumber),
        totalItems: totalCount,
        itemsPerPage: limitNumber,
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Error fetching orders' });
  }
};

export const checkout = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId || typeof userId !== 'number') {
      return res.status(400).json({ error: 'Valid userId is required' });
    }
    const order = await handleCheckout(userId, req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to checkout' });
  }
};

export const cancelExpired = async (req: Request, res: Response) => {
  try {
    const canceledCount = await cancelExpiredOrders();
    res.status(200).json({ canceledCount });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel expired orders' });
  }
};

export const confirmOrderReceived = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.userId;
    if (!userId || typeof userId !== 'number') {
      return res.status(400).json({ error: 'Valid userId is required' });
    }

    const { orderId } = req.body;
    if (!orderId || typeof orderId !== 'number') {
      return res.status(400).json({ error: 'Valid orderId is required' });
    }

    const confirmedOrder = await confirmOrder(userId, orderId);
    res.status(200).json({ success: true, order: confirmedOrder });
  } catch (error) {
    console.error('Error confirming order received:', error);
    if (
      error instanceof Error &&
      error.message === 'Order not found or cannot be confirmed'
    ) {
      res.status(404).json({ success: false, message: error.message });
    } else {
      res
        .status(500)
        .json({ success: false, message: 'Failed to confirm order received' });
    }
  }
};

export const confirmOrderPayment = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.userId;
    if (!userId || typeof userId !== 'number') {
      return res.status(400).json({ error: 'Valid userId is required' });
    }

    const { orderId } = req.body;
    if (!orderId || typeof orderId !== 'number') {
      return res.status(400).json({ error: 'Valid orderId is required' });
    }

    const confirmedPayment = await confirmPayment(userId, orderId);
    res.status(200).json({ success: true, order: confirmedPayment });
  } catch (error) {
    console.error('Error confirming payment:', error);
    if (
      error instanceof Error &&
      error.message === 'Order not found or cannot confirm payment'
    ) {
      res.status(404).json({ success: false, message: error.message });
    } else {
      res
        .status(500)
        .json({ success: false, message: 'Failed to confirm payment' });
    }
  }
};

export const cancel = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId || typeof userId !== 'number') {
      return res.status(400).json({ error: 'Valid userId is required' });
    }
    const { orderId, source } = req.body;
    const canceledOrder = await cancelOrder(userId, orderId, source);
    res.status(200).json(canceledOrder);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const uploadProof = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId || typeof userId !== 'number') {
      return res.status(400).json({ error: 'Valid userId is required' });
    }

    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Payment proof file is required' });
    }

    const updatedOrder = await uploadPaymentProof(userId, orderId, req.file);
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Error uploading payment proof:', error);
    res.status(500).json({ message: 'Failed to upload payment proof' });
  }
};

export const checkStock = async (req: Request, res: Response) => {
  try {
    const { warehouseId, products, latitude, longitude } = req.body;
    await checkAndMutateStock(warehouseId, products, latitude, longitude);
    res.status(200).json({ message: 'Stock checked and mutated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const runAutoReceiveOrders = async (req: Request, res: Response) => {
  try {
    const autoReceivedCount = await autoReceiveOrders();
    res.status(200).json({ autoReceivedCount });
  } catch (error) {
    console.error('Error auto-receiving orders:', error);
    res.status(500).json({ message: 'Failed to auto-receive orders' });
  }
};
