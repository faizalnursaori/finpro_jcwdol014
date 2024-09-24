import { Router } from 'express';

import {
  createStock,
  deleteProductStock,
  getProductStock,
  getProductStockByWarehouseId,
  updateProductStock,
} from '@/controllers/productStock.controller';

const router = Router();

router.get('/', getProductStock);
router.get('/:warehouseId', getProductStockByWarehouseId);
router.put('/update-stock', updateProductStock);
router.post('/', createStock);
router.delete('/:id', deleteProductStock);

export const stockRouter = router;
