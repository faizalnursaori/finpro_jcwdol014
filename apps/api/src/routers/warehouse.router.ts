import { Router } from 'express';

import {
  getWarehouseByUserId,
  getWarehouses,
} from '@/controllers/warehouse.controller';

const router = Router();

//get Warehouse
router.get('/', getWarehouses);
router.get('/:userId', getWarehouseByUserId);

export default router;
