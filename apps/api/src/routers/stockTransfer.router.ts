import express from 'express';
import {
  approveStockTransfer,
  createStockTransfer,
  getStockTransfer,
  getStockTransferByDestinationWarehouseId,
  rejectStockTransfer,
} from '@/controllers/stockTransfer.controller';

const router = express.Router();

router.get('/', getStockTransfer);
router.get('/:warehouseId', getStockTransferByDestinationWarehouseId);
router.post('/', createStockTransfer);
router.post('/approve/:id', approveStockTransfer);
router.put('/reject/:id', rejectStockTransfer);

export const stockTransferRouter = router;
