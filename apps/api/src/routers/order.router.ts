import express, { Request, Response, NextFunction } from 'express';
import {
  checkout,
  cancelExpired,
  cancel,
  uploadProof,
  checkStock,
  getOrderList,
  getOrderDetail,
  confirmOrderReceived,
  confirmOrderPayment,
  updateStatusOrder,
} from '../controllers/order.controller';
import {
  authenticateToken,
  AuthenticatedRequest,
} from '@/middleware/auth.middleware';
import { uploader } from '@/middleware/uploader.middleware';

const router = express.Router();

// Helper function to wrap handlers that use AuthenticatedRequest
const wrapAuthHandler = (
  handler: (
    req: AuthenticatedRequest,
    res: Response,
  ) => Promise<Response | undefined>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    handler(req as AuthenticatedRequest, res).catch(next);
  };
};

router.get('/', authenticateToken, wrapAuthHandler(getOrderList));
router.get('/:id', authenticateToken, wrapAuthHandler(getOrderDetail));

// Route for checkout
router.post('/checkout', authenticateToken, wrapAuthHandler(checkout));

// Route for canceling expired orders
router.post('/cancel-expired', authenticateToken, cancelExpired);

// Route for confirming order receipt
router.post(
  '/confirm-receipt',
  authenticateToken,
  wrapAuthHandler(confirmOrderReceived),
);

// Route for confirming order payment
router.post(
  '/confirm-payment',
  authenticateToken,
  wrapAuthHandler(confirmOrderPayment),
);

// Route for canceling an order
router.post('/cancel', authenticateToken, wrapAuthHandler(cancel));

router.post(
  '/update_status',
  authenticateToken,
  wrapAuthHandler(updateStatusOrder),
);

// Route for uploading payment proof
router.post(
  '/payment-proof',
  authenticateToken,
  uploader('/payment', 'PAYMENT').single('image'),
  wrapAuthHandler(uploadProof),
);

// Route for checking stock
router.post('/check-stock', checkStock);

export default router;
