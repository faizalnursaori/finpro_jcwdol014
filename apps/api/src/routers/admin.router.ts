import express from 'express';
import {
  createAdmin,
  deleteAdmin,
  getAdminByPage,
  getUserByPage,
  searchUsers,
  updateUser,
} from '@/controllers/admin.controller';
import {
  authenticateToken,
  AdminGuard,
  SuperAdminGuard,
} from '@/middleware/auth.middleware';

const router = express.Router();

router.get('/users', authenticateToken, SuperAdminGuard, getUserByPage);
router.get('/admins', authenticateToken, SuperAdminGuard, getAdminByPage);
router.get('/search/users', authenticateToken, AdminGuard, searchUsers);
router.get('/search/admins', authenticateToken, SuperAdminGuard, searchUsers);
router.post('/', authenticateToken, SuperAdminGuard, createAdmin);
router.patch('/:id', authenticateToken, SuperAdminGuard, updateUser);
router.delete('/:id', authenticateToken, SuperAdminGuard, deleteAdmin);

export const adminRouter = router;
