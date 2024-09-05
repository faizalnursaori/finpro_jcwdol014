import express from 'express';
import {
  checkout,
  cancelExpired,
  cancel,
  uploadProof,
  checkStock,
  getOrderList
} from '../controllers/order.controller';
import { authenticateToken } from '@/middleware/auth.middleware';

const router = express.Router();

router.get('/', authenticateToken, getOrderList)

// Route for checkout
router.post('/checkout', authenticateToken, checkout);

// Route for canceling expired orders
router.post('/cancel-expired', cancelExpired);

// Route for canceling an order
router.post('/cancel', authenticateToken, cancel);

// Route for uploading payment proof
router.post('/upload-proof', authenticateToken, uploadProof);

// Route for checking stock
router.post('/check-stock', checkStock);

export default router;
