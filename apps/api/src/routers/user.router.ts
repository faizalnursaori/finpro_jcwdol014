import express from 'express';
import { updateUser, getUserByEmail, updateUserPassword, updateUserByToken, resetUserPassword, createUser, verifyUser,confirmation  } from '@/controllers/user.controller';
import upload from '@/middleware/uploader';
const router = express.Router();

router.post('/', createUser)
router.put('/:id',upload.single("image"), updateUser)
router.put('/password/:id', updateUserPassword)
router.put('/register/:token', updateUserByToken)
router.put('/reset-password/:token', resetUserPassword)
router.get('/:email', getUserByEmail)
router.post('/verify', verifyUser)
router.get('/verify/:token', confirmation)

export default router;
