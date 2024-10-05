import express from 'express';
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '@/controllers/category.controller';
import {
  AdminGuard,
  authenticateToken2,
  SuperAdminGuard,
} from '@/middleware/auth.middleware';

const router = express.Router();

router.post('/', authenticateToken2, SuperAdminGuard, createCategory);
router.get('/', getCategories);
router.get('/:id', authenticateToken2, AdminGuard, getCategoryById);
router.put('/:id', authenticateToken2, SuperAdminGuard, updateCategory);
router.delete('/:id', authenticateToken2, SuperAdminGuard, deleteCategory);

export const categoryRouter = router;
