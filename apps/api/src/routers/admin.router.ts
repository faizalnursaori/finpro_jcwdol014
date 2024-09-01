import express from 'express';
import {
  createAdmin,
  deleteAdmin,
  getAdminByPage,
  getUserByPage,
  searchUsers,
  updateUser,
} from '@/controllers/admin.controller';

const router = express.Router();

router.get('/getUsers', getUserByPage);
router.get('/getAdmins', getAdminByPage);
router.get('/search/end-user', searchUsers);
router.get('/search/admin', searchUsers);
router.post('/create', createAdmin);
router.patch('/update/:id', updateUser);
router.delete('/delete/:id', deleteAdmin);

export const adminRouter = router;
