import express from 'express';
import {
  createAdmin,
  deleteAdmin,
  getAdmins,
  getUsers,
  updateUser,
} from '@/controllers/admin.controller';
import { SuperAdminGuard } from '@/middleware/auth.middleware';
import { authenticateToken } from '@/middleware/auth.middleware';
import { AdminGuard } from '@/middleware/auth.middleware';

const router = express.Router();

router.get('/users', authenticateToken, AdminGuard, getUsers);
router.get('/admins', authenticateToken, SuperAdminGuard, getAdmins);
router.post('/', authenticateToken, SuperAdminGuard, createAdmin);
router.patch('/:id', authenticateToken, SuperAdminGuard, updateUser);
router.delete('/:id', authenticateToken, SuperAdminGuard, deleteAdmin);

export const adminRouter = router;
