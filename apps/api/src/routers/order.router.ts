import express from 'express';
import {
  checkout,
  cancelExpired,
  cancel,
  uploadProof,
  checkStock,
  getOrderList,
  getOrderDetail,
  confirm,
} from '../controllers/order.controller';
import { authenticateToken } from '@/middleware/auth.middleware';
import { uploader } from '@/middleware/uploader.middleware';

const router = express.Router();

router.get('/', authenticateToken, getOrderList);
router.get('/:id', authenticateToken, getOrderDetail);

// Route for checkout
router.post('/checkout', authenticateToken, checkout);

// Route for canceling expired orders
router.post('/cancel-expired', cancelExpired);

// Route for confirming an order
router.post('/confirm', authenticateToken, confirm);

// Route for canceling an order
router.post('/cancel', authenticateToken, cancel);

// Route for uploading payment proof
router.post(
  '/payment-proof',
  authenticateToken,
  uploader('/payment', 'PAYMENT').single('image'),
  uploadProof,
);

// Route for checking stock
router.post('/check-stock', checkStock);

export default router;
