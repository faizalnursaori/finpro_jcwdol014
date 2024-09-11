import { Request, Response } from 'express';
import {
  handleCheckout,
  cancelExpiredOrders,
  cancelOrder,
  confirmOrder,
  uploadPaymentProof,
  checkAndMutateStock,
} from '../services/order.service';
import multer from 'multer';
import { CancellationSource } from '@prisma/client';
import { AuthenticatedRequest } from '@/middleware/auth.middleware';
import { getOrderDetailById } from '../services/order.service';
import prisma from '@/prisma';

const upload = multer({ dest: 'uploads/' });

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
    const { startDate, endDate, orderNumber } = req.query;

    const filters: any = {
      // Remove userId from here
    };

    if (startDate && endDate) {
      filters.createdAt = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    if (orderNumber) {
      filters.id = parseInt(orderNumber as string);
    }

    const orders = await prisma.order.findMany({
      where: {
        ...filters,
        cart: {
          userId: userId, // Add this line to filter by userId through the cart relation
        },
      },
      include: {
        items: true,
        warehouse: true,
        cart: true,
        address: true,
        voucher: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({ success: true, orders });
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

export const confirm = async (req: AuthenticatedRequest, res: Response) => {
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
    console.error('Error confirming order:', error);
    if (
      error instanceof Error &&
      error.message === 'Order not found or cannot be confirmed'
    ) {
      res.status(404).json({ success: false, message: error.message });
    } else {
      res
        .status(500)
        .json({ success: false, message: 'Failed to confirm order' });
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

    // File is already uploaded by the middleware, so we proceed with logic
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
