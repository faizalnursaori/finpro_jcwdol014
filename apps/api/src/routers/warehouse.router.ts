import { Router } from 'express';
import {
  createWarehouse,
  getWarehouses,
  getWarehouseById,
  updateWarehouse,
  deleteWarehouse,
  findNearestWarehouse,
  getWarehouseByUserId,
} from '@/controllers/warehouse.controller';

const router = Router();

// Create Warehouse
router.post('/', createWarehouse);

// Get All Warehouses
router.get('/', getWarehouses);

// Get Warehouse by ID
router.get('/:id', getWarehouseById);

// Update Warehouse
router.put('/:id', updateWarehouse);

// Delete Warehouse
router.delete('/:id', deleteWarehouse);

// Find Nearest Warehouse
router.post('/nearest', findNearestWarehouse);

// Get Warehouse by User ID
router.get('/user/:userId', getWarehouseByUserId);

export default router;
