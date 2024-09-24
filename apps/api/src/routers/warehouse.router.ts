import { Router } from 'express';
import { authenticateToken2, SuperAdminGuard } from '@/middleware/auth.middleware';

import {findNearestWarehouse,getWarehouseByUserId,getWarehouses, getWarehouse, createWarehouse, updateWarehouse, deleteWarehouse, getWarehousesByPage } from '@/controllers/warehouse.controller';

const router = Router()

router.get('/', getWarehouses)
router.get('/page',authenticateToken2, SuperAdminGuard, getWarehousesByPage)
router.get('/:id', authenticateToken2,SuperAdminGuard, getWarehouse)
router.post('/create', authenticateToken2,SuperAdminGuard, createWarehouse)
router.put('/update/:id', authenticateToken2,SuperAdminGuard, updateWarehouse)
router.delete('/delete/:id', authenticateToken2,SuperAdminGuard, deleteWarehouse)


// Update Warehouse
router.put('/:id', updateWarehouse);

// Delete Warehouse
router.delete('/:id', deleteWarehouse);

// Find Nearest Warehouse
router.post('/nearest', findNearestWarehouse);

// Get Warehouse by User ID
router.get('/user/:userId', getWarehouseByUserId);

export default router;
