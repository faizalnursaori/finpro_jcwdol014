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
  authenticateToken,
  SuperAdminGuard,
} from '@/middleware/auth.middleware';

const router = express.Router();

router.post('/', authenticateToken, SuperAdminGuard, createCategory);
router.get('/', authenticateToken, AdminGuard, getCategories);
router.get('/:id', authenticateToken, AdminGuard, getCategoryById);
router.put('/:id', authenticateToken, SuperAdminGuard, updateCategory);
router.delete('/:id', authenticateToken, SuperAdminGuard, deleteCategory);

export const categoryRouter = router;
