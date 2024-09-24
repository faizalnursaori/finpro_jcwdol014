import express from 'express';
import {
  createAdmin,
  deleteAdmin,
  getAdmins,
  getUsers,
  updateUser,
} from '@/controllers/admin.controller';
import { SuperAdminGuard } from '@/middleware/auth.middleware';
import { authenticateToken2 } from '@/middleware/auth.middleware';
import { AdminGuard } from '@/middleware/auth.middleware';

const router = express.Router();

router.get('/users', authenticateToken2, AdminGuard, getUsers);
router.get('/admins', authenticateToken2, SuperAdminGuard, getAdmins);
router.post('/', authenticateToken2, SuperAdminGuard, createAdmin);
router.patch('/:id', authenticateToken2, SuperAdminGuard, updateUser);
router.delete('/:id', authenticateToken2, SuperAdminGuard, deleteAdmin);

export const adminRouter = router;
