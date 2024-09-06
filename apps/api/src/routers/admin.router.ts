import express from 'express';
import {
  createAdmin,
  deleteAdmin,
  getAdminByPage,
  getUserByPage,
  searchUsers,
  updateUser,
} from '@/controllers/admin.controller';
import { SuperAdminGuard } from '@/middleware/superAdminGuard';
import { verifyToken } from '@/middleware/verifyToken';
import { AdminGuard } from '@/middleware/adminGuard';

const router = express.Router();

router.get('/users', verifyToken, SuperAdminGuard, getUserByPage);
router.get('/admins', verifyToken, SuperAdminGuard, getAdminByPage);
router.get('/search/users', verifyToken, AdminGuard, searchUsers);
router.get('/search/admins', verifyToken, SuperAdminGuard, searchUsers);
router.post('/', verifyToken, SuperAdminGuard, createAdmin);
router.patch('/:id', verifyToken, SuperAdminGuard, updateUser);
router.delete('/:id', verifyToken, SuperAdminGuard, deleteAdmin);

export const adminRouter = router;
