import { Router } from 'express';
import { authenticateToken, SuperAdminGuard } from '@/middleware/auth.middleware';

import { getWarehouses, getWarehouse, createWarehouse, updateWarehouse, deleteWarehouse } from '@/controllers/warehouse.controller';

const router = Router()

router.get('/', getWarehouses)
router.get('/:id', authenticateToken,SuperAdminGuard, getWarehouse)
router.post('/create', authenticateToken,SuperAdminGuard, createWarehouse)
router.put('/update/:id', authenticateToken,SuperAdminGuard, updateWarehouse)
router.delete('/delete/:id', authenticateToken,SuperAdminGuard, deleteWarehouse)

export default router