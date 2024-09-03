import { Request, Response } from 'express';
import {
  handleCheckout,
  cancelExpiredOrders,
  cancelOrder,
  uploadPaymentProof,
  checkAndMutateStock,
} from '../services/order.service';
import multer from 'multer';
import { CancellationSource } from '@prisma/client';
import { AuthenticatedRequest } from '@/middleware/auth.middleware';

const upload = multer({ dest: 'uploads/' });

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
  upload.single('file')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    try {
      const userId = req.user?.userId;
      if (!userId || typeof userId !== 'number') {
        return res.status(400).json({ error: 'Valid userId is required' });
      }
      const { orderId } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const updatedOrder = await uploadPaymentProof(userId, orderId, req.file);
      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });
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
