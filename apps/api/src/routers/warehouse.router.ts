import { Router } from 'express';

import { getWarehouses } from '@/controllers/warehouse.controller';

const router = Router()

//get Warehouse
router.get('/', getWarehouses)

export default router